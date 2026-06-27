// Real 3D dice — Three.js polyhedra with a lightweight physics tumble.
// No external physics lib: gravity + floor bounces + angular damping, easing
// onto the rolled face. Reuses the THREE global the app already loads for planets.
// Exposed as window.DiceBox: .supported(), .create(container) -> { roll, dispose, resize }.
(function () {
  const T = window.THREE;
  const EMBER = 0xe1702c, EMBER_HI = 0xff9a57, EDGE = 0x3a1b0d, NUM_DARK = '#1c0e06';

  function supported() {
    if (!T) return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  // ── geometry per die; returns a THREE geometry centred on origin ──
  function makeGeometry(sides, r) {
    switch (sides) {
      case 4: return new T.TetrahedronGeometry(r * 1.25);
      case 6: return new T.BoxGeometry(r * 1.42, r * 1.42, r * 1.42);
      case 8: return new T.OctahedronGeometry(r * 1.2);
      case 12: return new T.DodecahedronGeometry(r * 1.12);
      case 20: return new T.IcosahedronGeometry(r * 1.12);
      case 10: case 100: return pentBipyramid(r);
      default: return new T.IcosahedronGeometry(r * 1.12);
    }
  }

  // Pentagonal bipyramid — a clean, robust 10-faced solid that reads as a d10.
  function pentBipyramid(r) {
    const ry = r * 1.32, rr = r * 1.02;
    const ring = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      ring.push([Math.cos(a) * rr, 0, Math.sin(a) * rr]);
    }
    const top = [0, ry, 0], bot = [0, -ry, 0];
    const pos = [];
    const tri = (a, b, c) => { pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); };
    for (let i = 0; i < 5; i++) {
      const n = (i + 1) % 5;
      tri(top, ring[i], ring[n]);       // upper cap
      tri(bot, ring[n], ring[i]);       // lower cap (reversed winding)
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }

  // ── group coplanar triangles into faces; return {normal, centroid} each ──
  function extractFaces(geo) {
    const pos = geo.attributes.position;
    const a = new T.Vector3(), b = new T.Vector3(), c = new T.Vector3();
    const ab = new T.Vector3(), ac = new T.Vector3(), n = new T.Vector3();
    const groups = [];
    const triCount = pos.count / 3;
    for (let t = 0; t < triCount; t++) {
      a.fromBufferAttribute(pos, t * 3); b.fromBufferAttribute(pos, t * 3 + 1); c.fromBufferAttribute(pos, t * 3 + 2);
      ab.subVectors(b, a); ac.subVectors(c, a); n.crossVectors(ab, ac).normalize();
      let g = groups.find(gr => gr.normal.dot(n) > 0.985);
      if (!g) { g = { normal: n.clone(), vs: new T.Vector3(), nv: 0, keys: new Set() }; groups.push(g); }
      [a, b, c].forEach(v => {
        const k = v.x.toFixed(3) + ',' + v.y.toFixed(3) + ',' + v.z.toFixed(3);
        if (!g.keys.has(k)) { g.keys.add(k); g.vs.add(v); g.nv++; }
      });
    }
    return groups.map(g => ({ normal: g.normal.clone().normalize(), centroid: g.vs.clone().multiplyScalar(1 / g.nv) }));
  }

  // ── number textures (transparent bg, dark numeral) cached by string ──
  const texCache = {};
  function numberTexture(str) {
    if (texCache[str]) return texCache[str];
    const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, S, S);
    const digits = str.length;
    ctx.font = '700 ' + (digits >= 3 ? 52 : digits === 2 ? 66 : 82) + 'px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(255,224,192,0.85)'; ctx.strokeText(str, S / 2, S / 2 + 4);
    ctx.fillStyle = NUM_DARK; ctx.fillText(str, S / 2, S / 2 + 4);
    // underline 6/9 so they're unambiguous when tumbling
    if (str === '6' || str === '9') { ctx.fillRect(S / 2 - 20, S / 2 + 30, 40, 6); }
    const tex = new T.CanvasTexture(cv);
    tex.anisotropy = 4; tex.colorSpace = T.SRGBColorSpace;
    texCache[str] = tex;
    return tex;
  }

  // ── build one die group: solid + edges + numbered face planes ──
  function buildDie(sides, r) {
    const geo = makeGeometry(sides, r);
    const faces = extractFaces(geo);
    const grp = new T.Group();

    const mat = new T.MeshStandardMaterial({ color: EMBER, roughness: 0.42, metalness: 0.12, flatShading: true });
    const solid = new T.Mesh(geo, mat);
    solid.castShadow = true; solid.receiveShadow = false;
    grp.add(solid);

    const edges = new T.LineSegments(new T.EdgesGeometry(geo, 18),
      new T.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.55 }));
    grp.add(edges);

    // a number plane per face (content set later via setFaces)
    const planes = faces.map(f => {
      const size = r * (sides >= 20 ? 0.62 : sides >= 12 ? 0.78 : sides >= 8 ? 0.9 : 1.0);
      const pm = new T.MeshBasicMaterial({ transparent: true, depthWrite: false });
      const plane = new T.Mesh(new T.PlaneGeometry(size, size), pm);
      const p = f.centroid.clone().add(f.normal.clone().multiplyScalar(0.012));
      plane.position.copy(p);
      plane.lookAt(p.clone().add(f.normal));
      grp.add(plane);
      return plane;
    });

    grp.userData = { faces, planes, solid };
    return grp;
  }

  // assign the rolled value to face 0, plausible decoys elsewhere
  function setFaces(grp, value, sides) {
    const { planes } = grp.userData;
    planes.forEach((pl, i) => {
      let label;
      if (i === 0) label = String(value);
      else label = String(1 + Math.floor(Math.random() * Math.max(2, Math.min(sides, 99))));
      pl.material.map = numberTexture(label);
      pl.material.needsUpdate = true;
    });
  }

  function create(container) {
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 5.4, 7.2); camera.lookAt(0, 0.1, 0);

    scene.add(new T.AmbientLight(0x5a4a52, 1.4));
    const key = new T.DirectionalLight(0xfff1e2, 2.6);
    key.position.set(-4, 9, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1; key.shadow.camera.far = 30;
    key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0012; key.shadow.radius = 4;
    scene.add(key);
    const ember = new T.PointLight(0xff8a44, 1.1, 40); ember.position.set(2.5, 1.5, 4); scene.add(ember);

    const floor = new T.Mesh(new T.PlaneGeometry(60, 60), new T.ShadowMaterial({ opacity: 0.4 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; floor.receiveShadow = true;
    scene.add(floor);

    let dice = [];          // active die states
    let pool = {};          // reusable die groups keyed by sides
    let raf = null, running = false, startT = 0;
    const REST_Y = 0.0;     // floor plane; die center rests at +radius

    function sizeTo() {
      const w = Math.max(40, container.clientWidth), h = Math.max(40, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }

    function clearDice() {
      dice.forEach(d => scene.remove(d.grp));
      dice = [];
    }

    function roll(opts) {
      const sides = opts.sides || 20;
      const values = (opts.values || [1]).slice(0, 6);
      sizeTo();
      clearDice();

      const n = values.length;
      const r = n >= 5 ? 0.66 : n >= 3 ? 0.8 : 0.95;          // shrink solids when crowded
      const spacing = n >= 5 ? 1.7 : n >= 3 ? 2.1 : 2.5;
      const x0 = -((n - 1) * spacing) / 2;

      values.forEach((val, i) => {
        const grp = buildDie(sides, r);
        setFaces(grp, val, sides);
        const restPos = new T.Vector3(x0 + i * spacing, REST_Y + r, 0);

        // target orientation: result face (index 0) points toward camera, tilted up a touch
        const f0 = grp.userData.faces[0];
        const want = camera.position.clone().sub(restPos).normalize().add(new T.Vector3(0, 0.18, 0)).normalize();
        const qTarget = new T.Quaternion().setFromUnitVectors(f0.normal.clone().normalize(), want);

        // start high with a random orientation + spin
        grp.position.set(restPos.x + (Math.random() - 0.5) * 0.6, restPos.y + 4.2 + Math.random() * 1.2, (Math.random() - 0.5) * 0.6);
        grp.quaternion.setFromEuler(new T.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28));
        const axis = new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const angVel = axis.multiplyScalar(9 + Math.random() * 7);

        scene.add(grp);
        dice.push({
          grp, restPos, qTarget, angVel, r,
          vy: 1 + Math.random() * 1.5, bounces: 0,
          delay: i * 0.07, settleFrom: null, settled: false,
        });
      });

      startT = performance.now() / 1000;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    }

    const GRAV = -24, RESTITUTION = 0.42, SETTLE_AT = 0.92, SETTLE_DUR = 0.5;
    let lastT = 0;

    function tick() {
      const now = performance.now() / 1000;
      let dt = Math.min(0.05, now - (lastT || now)); lastT = now;
      let anyActive = false;

      dice.forEach(d => {
        const lt = (now - startT) - d.delay;        // local elapsed for this die
        if (lt < 0) { anyActive = true; return; }

        if (lt < SETTLE_AT) {
          // free tumble + gravity bounce
          anyActive = true;
          d.vy += GRAV * dt;
          d.grp.position.y += d.vy * dt;
          const floorY = d.restPos.y;
          if (d.grp.position.y <= floorY) {
            d.grp.position.y = floorY;
            if (d.vy < 0) { d.vy = -d.vy * RESTITUTION; d.bounces++; d.angVel.multiplyScalar(0.55); }
            if (Math.abs(d.vy) < 0.8) d.vy = 0;
          }
          // ease horizontal drift back toward rest
          d.grp.position.x += (d.restPos.x - d.grp.position.x) * Math.min(1, dt * 4);
          d.grp.position.z += (d.restPos.z - d.grp.position.z) * Math.min(1, dt * 4);
          // integrate spin
          const av = d.angVel;
          const ang = av.length() * dt;
          if (ang > 1e-5) {
            const dq = new T.Quaternion().setFromAxisAngle(av.clone().normalize(), ang);
            d.grp.quaternion.premultiply(dq);
          }
          d.angVel.multiplyScalar(0.992);
        } else if (lt < SETTLE_AT + SETTLE_DUR) {
          // settle: slerp to target face, ease to rest position
          anyActive = true;
          if (!d.settleFrom) { d.settleFrom = d.grp.quaternion.clone(); d.settlePos = d.grp.position.clone(); }
          const u = (lt - SETTLE_AT) / SETTLE_DUR;
          const e = 1 - Math.pow(1 - u, 3);
          d.grp.quaternion.copy(d.settleFrom).slerp(d.qTarget, e);
          d.grp.position.lerpVectors(d.settlePos, d.restPos, e);
        } else if (!d.settled) {
          d.grp.quaternion.copy(d.qTarget);
          d.grp.position.copy(d.restPos);
          d.settled = true;
        }
      });

      renderer.render(scene, camera);

      if (anyActive) { raf = requestAnimationFrame(tick); }
      else { running = false; raf = null; }
    }

    sizeTo();
    renderer.render(scene, camera);

    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => { sizeTo(); if (!running) renderer.render(scene, camera); }); ro.observe(container); }

    const api = {
      roll,
      resize: () => { sizeTo(); if (!running) renderer.render(scene, camera); },
      // test/debug: snap every die to its settled pose and render one frame
      _settleNow() {
        dice.forEach(d => { d.grp.quaternion.copy(d.qTarget); d.grp.position.copy(d.restPos); d.settled = true; });
        renderer.render(scene, camera);
      },
      _debug: { scene, camera, renderer, get dice() { return dice; } },
      dispose() {
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        clearDice();
        scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); } });
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        if (window.__diceBoxLast === api) window.__diceBoxLast = null;
      },
    };
    window.__diceBoxLast = api;
    return api;
  }

  window.DiceBox = { supported, create };
})();
