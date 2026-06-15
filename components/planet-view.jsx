// 3D Planet view: rotating Three.js sphere with procedural texture/bump/clouds, +
// detailed character sheet (right panel) and orbit thumb-strip for system planets.

const { useRef, useEffect, useState, useMemo } = React;

function PlanetCanvas({ planet, starColor, autoRotate = true }) {
  const containerRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !window.THREE) return;
    let raf;
    let cleanup = () => {};
    try {
    const THREE = window.THREE;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000);
    camera.position.set(0, 0, 4.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    // Generate planet texture
    const texCanvas = window.generatePlanetTexture(1024, planet.biome, planet.textureSeed);
    const bumpCanvas = window.generateBumpTexture(512, planet.biome, planet.textureSeed);
    const tex = new THREE.CanvasTexture(texCanvas);
    tex.anisotropy = 4;
    const bump = new THREE.CanvasTexture(bumpCanvas);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      bumpMap: bump,
      bumpScale: 0.04,
      roughness: 0.95,
      metalness: 0.0,
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), mat);
    sphere.rotation.z = (planet.axialTilt || 0) * Math.PI / 180;
    scene.add(sphere);

    // Cloud layer if atmosphere is breathable / engineered
    let clouds = null;
    if (['temperate', 'engineered', 'ocean', 'toxic'].includes(planet.biome)) {
      const cloudCanvas = window.generateCloudTexture(1024, planet.textureSeed + 7919);
      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        opacity: planet.biome === 'toxic' ? 0.45 : 0.75,
      });
      clouds = new THREE.Mesh(new THREE.SphereGeometry(1.015, 64, 64), cloudMat);
      sphere.add(clouds);
    }

    // Atmosphere halo (back-side fresnel sphere)
    const atmoCol = (() => {
      const map = { temperate: 0x6fb8ff, ice: 0xbedcff, molten: 0xff6a30, toxic: 0xc8dc55, engineered: 0xff9ed6, desert: 0xf0c08c, ocean: 0x6fb8ff, rocky: 0x6a7c8a };
      return map[planet.biome] || 0x6a7c8a;
    })();
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(atmoCol) },
        intensity: { value: planet.biome === 'rocky' || planet.biome === 'ice' ? 0.5 : 1.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        uniform float intensity;
        void main() {
          float i = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 2.5);
          gl_FragColor = vec4(glowColor, i * intensity);
        }
      `,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.18, 64, 64), atmoMat);
    scene.add(atmo);

    // Ring system
    let ring = null;
    if (planet.ringSystem) {
      const ringGeo = new THREE.RingGeometry(1.4, 2.2, 128);
      // UV remap so we get radial gradient
      const pos = ringGeo.attributes.position;
      const v3 = new THREE.Vector3();
      const uv = [];
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const d = v3.length();
        const t = (d - 1.4) / (2.2 - 1.4);
        uv.push(t, 0);
      }
      ringGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      // Procedural ring canvas
      const rc = document.createElement('canvas');
      rc.width = 256; rc.height = 1;
      const rctx = rc.getContext('2d');
      const rgrad = rctx.createLinearGradient(0, 0, 256, 0);
      rgrad.addColorStop(0, 'rgba(0,0,0,0)');
      rgrad.addColorStop(0.15, 'rgba(190,170,140,0.7)');
      rgrad.addColorStop(0.35, 'rgba(220,200,170,0.4)');
      rgrad.addColorStop(0.45, 'rgba(0,0,0,0)');
      rgrad.addColorStop(0.55, 'rgba(180,160,130,0.6)');
      rgrad.addColorStop(0.85, 'rgba(160,140,110,0.3)');
      rgrad.addColorStop(1, 'rgba(0,0,0,0)');
      rctx.fillStyle = rgrad;
      rctx.fillRect(0, 0, 256, 1);
      const ringTex = new THREE.CanvasTexture(rc);
      const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 - 0.18;
      sphere.add(ring);
    }

    // Lighting — directional sun keyed off star color
    const sun = new THREE.DirectionalLight(new THREE.Color(starColor || '#ffffff'), 2.2);
    sun.position.set(4, 1.5, 2);
    scene.add(sun);
    const amb = new THREE.AmbientLight(0x404a5f, 0.35);
    scene.add(amb);

    // Moon meshes
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);
    const moons = planet.moons.map((m, i) => {
      const mTex = new THREE.CanvasTexture(window.generatePlanetTexture(256, m.biome, m.textureSeed));
      const mMat = new THREE.MeshStandardMaterial({ map: mTex, roughness: 1 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(m.radius * 0.2, 32, 32), mMat);
      // Random orbital phase
      mesh.userData = { distance: m.distance, phase: i * 1.3, speed: 0.3 - i * 0.05 };
      moonGroup.add(mesh);
      return mesh;
    });

    // Mouse drag rotate
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let yaw = 0, pitch = 0;
    let velYaw = 0;

    function down(e) {
      isDragging = true; lastX = e.clientX; lastY = e.clientY;
      el.style.cursor = 'grabbing';
    }
    function move(e) {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.005;
      pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * 0.005));
      velYaw = dx * 0.005;
    }
    function up() {
      isDragging = false;
      el.style.cursor = 'grab';
    }
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    function onWheel(e) {
      e.preventDefault();
      const z = e.deltaY < 0 ? 0.92 : 1.08;
      camera.position.z = Math.max(2.2, Math.min(8, camera.position.z * z));
    }
    el.addEventListener('wheel', onWheel, { passive: false });

    let t0 = performance.now();
    let camR = camera.position.z;
    function frame(t) {
      try {
        const dt = Math.min(60, t - t0) / 1000;
        t0 = t;
        if (!isDragging && autoRotate) {
          yaw += dt * 0.12;
        } else if (!isDragging) {
          yaw += velYaw;
          velYaw *= 0.94;
        }
        sphere.rotation.y = yaw;
        camera.position.y = Math.sin(pitch) * camR;
        camera.position.z = Math.cos(pitch) * camR;
        camera.lookAt(0, 0, 0);
        if (clouds) clouds.rotation.y += dt * 0.04;
        moons.forEach((m, i) => {
          const d = m.userData;
          d.phase += dt * d.speed;
          m.position.set(Math.cos(d.phase) * d.distance, Math.sin(d.phase * 0.3) * 0.4, Math.sin(d.phase) * d.distance);
        });
        renderer.render(scene, camera);
      } catch (err) {
        console.error('[planet] frame error', err.message);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onResize() {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      try { renderer.render(scene, camera); } catch {}
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    stateRef.current = { renderer, scene };

    cleanup = () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', onWheel);
      renderer.dispose();
      try { el.removeChild(renderer.domElement); } catch {}
      tex.dispose(); bump.dispose();
      mat.dispose();
      sphere.geometry.dispose();
      atmo.geometry.dispose();
      atmoMat.dispose();
    };
    // Render one frame synchronously so the planet is visible even if RAF is throttled.
    try { renderer.render(scene, camera); } catch (e) { console.error('[planet] initial render error', e.message); }
    } catch (err) {
      console.error('[planet] setup error', err.message);
    }
    return () => cleanup();
  }, [planet.id, planet.textureSeed, planet.biome, planet.ringSystem, starColor, autoRotate]);

  return React.createElement('div', {
    ref: containerRef,
    style: { width: '100%', height: '100%', position: 'absolute', inset: 0 },
  });
}

function Editable({ value, onChange, multiline, style }) {
  const ref = useRef(null);
  return React.createElement(multiline ? 'div' : 'span', {
    ref,
    className: 'editable',
    contentEditable: true,
    suppressContentEditableWarning: true,
    style,
    onBlur: e => {
      const v = e.currentTarget.innerText;
      if (v !== value) onChange(v);
    },
    onKeyDown: e => {
      if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
    },
  }, value);
}

function PlanetSheet({ planet, system, onUpdate, onRerollTexture, onSelectPlanet }) {
  const habTag = planet.atmosphere.habitable && planet.biosphere.name === 'Human-Miscible';
  const TT = window.Tooltip;
  const E = window.SWN.explanations;
  function kvLabel(key, label) {
    return TT ? React.createElement(TT, {
      content: React.createElement('div', null,
        React.createElement('strong', null, label),
        React.createElement('div', { style: { marginTop: 4, color: 'var(--fg-2)' } }, E[key] || '')
      )
    }, label) : label;
  }
  const tagClassFor = (t) => {
    const danger = ['Maneaters', 'Quarantined World', 'Sealed Menace', 'Civil War', 'Radioactive World', 'Hatred', 'Zombies', 'Tyranny', 'Police State'];
    const warn = ['Cold War', 'Holy War', 'Warlords', 'Forbidden Tech', 'Unbraked AI', 'Pretech Cultists'];
    const good = ['Trade Hub', 'Beautiful', 'Pleasure World', 'Utopia', 'Post-Scarcity', 'Xenophiles'];
    if (danger.includes(t.name)) return 'danger';
    if (warn.includes(t.name)) return 'warn';
    if (good.includes(t.name)) return 'success';
    return '';
  };

  return React.createElement('div', { className: 'planet-sheet' },
    // Header
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 } },
      React.createElement(Editable, {
        value: planet.name,
        onChange: v => onUpdate({ name: v }),
        style: { fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 24, color: 'var(--fg-0)', letterSpacing: '-0.01em' },
      }),
      React.createElement('span', { className: 'planet-class' }, system.hexId)
    ),
    React.createElement('div', { className: 'planet-class', style: { marginBottom: 16 } },
      `${system.starName} · ${system.starType.class}-type star · Orbit ${system.planets.indexOf(planet) + 1}`
    ),

    // Tags row
    React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 } },
      habTag && React.createElement('span', { className: 'tag success' }, '◉ Habitable'),
      planet.ringSystem && React.createElement('span', { className: 'tag' }, '◯ Ring System'),
      planet.moons.length > 0 && React.createElement('span', { className: 'tag' }, `☾ ${planet.moons.length} ${planet.moons.length === 1 ? 'moon' : 'moons'}`),
      React.createElement('span', { className: 'tag' }, planet.techLevel.tl)
    ),

    // Vitals panel
    React.createElement('div', { className: 'panel', style: { marginBottom: 12 } },
      React.createElement('div', { className: 'panel-title' }, 'World Profile'),
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { className: 'kv' },
          React.createElement('div', { className: 'k' }, kvLabel('atmosphere', 'Atmosphere')),
          React.createElement('div', { className: 'v' },
            planet.atmosphere.name,
            React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 11 } }, planet.atmosphere.desc)
          ),
          React.createElement('div', { className: 'k' }, kvLabel('temperature', 'Temperature')),
          React.createElement('div', { className: 'v' },
            planet.temperature.name,
            React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 11 } }, planet.temperature.desc)
          ),
          React.createElement('div', { className: 'k' }, kvLabel('biosphere', 'Biosphere')),
          React.createElement('div', { className: 'v' },
            planet.biosphere.name,
            React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 11 } }, planet.biosphere.desc)
          ),
          React.createElement('div', { className: 'k' }, kvLabel('population', 'Population')),
          React.createElement('div', { className: 'v' },
            planet.population.name + (planet.population.range ? ` · ${planet.population.range}` : ''),
            React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 11 } }, planet.population.desc)
          ),
          React.createElement('div', { className: 'k' }, kvLabel('techLevel', 'Tech Level')),
          React.createElement('div', { className: 'v' }, planet.techLevel.tl + ' — ',
            React.createElement('span', { style: { color: 'var(--fg-3)' } }, planet.techLevel.desc)
          )
        )
      )
    ),

    // Physical stats
    React.createElement('div', { className: 'panel', style: { marginBottom: 12 } },
      React.createElement('div', { className: 'panel-title' }, 'Physical'),
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { className: 'kv' },
          React.createElement('div', { className: 'k' }, kvLabel('gravity', 'Gravity')),
          React.createElement('div', { className: 'v' }, planet.gravity + ' g'),
          React.createElement('div', { className: 'k' }, kvLabel('dayLength', 'Day')),
          React.createElement('div', { className: 'v' }, planet.dayLength + ' hours'),
          React.createElement('div', { className: 'k' }, kvLabel('yearLength', 'Year')),
          React.createElement('div', { className: 'v' }, planet.yearLength + ' local days'),
          React.createElement('div', { className: 'k' }, kvLabel('axialTilt', 'Axial tilt')),
          React.createElement('div', { className: 'v' }, planet.axialTilt + '°'),
          React.createElement('div', { className: 'k' }, kvLabel('biome', 'Biome class')),
          React.createElement('div', { className: 'v' }, planet.biome)
        ),
        React.createElement('div', { style: { marginTop: 12, display: 'flex', gap: 8 } },
          React.createElement('button', { className: 'ghost', onClick: onRerollTexture, style: { fontSize: 12 } }, '↻ Reroll Surface')
        )
      )
    ),

    // World tags
    React.createElement('div', { className: 'panel', style: { marginBottom: 12 } },
      React.createElement('div', { className: 'panel-title' }, 'World Tags'),
      React.createElement('div', { className: 'panel-body' },
        planet.tags.map((t, i) => React.createElement('div', {
          key: i,
          style: { marginBottom: i < planet.tags.length - 1 ? 10 : 0 },
        },
          React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 2 } },
            TT ? React.createElement(TT, {
              content: React.createElement('div', null,
                React.createElement('strong', null, t.name),
                React.createElement('div', { style: { marginTop: 4, color: 'var(--fg-2)' } }, t.desc),
                React.createElement('div', { style: { marginTop: 6, fontSize: 11, color: 'var(--fg-3)', fontStyle: 'italic' } }, 'World Tag · drives local adventure hooks')
              )
            }, React.createElement('span', { className: 'tag ' + tagClassFor(t) }, t.name))
              : React.createElement('span', { className: 'tag ' + tagClassFor(t) }, t.name)
          ),
          React.createElement('div', { style: { color: 'var(--fg-2)', fontSize: 12 } }, t.desc)
        ))
      )
    ),

    // Moons
    planet.moons.length > 0 && React.createElement('div', { className: 'panel', style: { marginBottom: 12 } },
      React.createElement('div', { className: 'panel-title' }, `Moons (${planet.moons.length})`),
      React.createElement('div', { className: 'panel-body' },
        planet.moons.map((m, i) => React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < planet.moons.length - 1 ? '1px solid var(--border-soft)' : 'none' } },
          React.createElement('span', null, m.name + ' · ', React.createElement('span', { style: { color: 'var(--fg-3)' } }, m.biome)),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' } }, m.distance.toFixed(1) + ' R')
        ))
      )
    ),

    // GM Notes
    React.createElement('div', { className: 'panel', style: { marginBottom: 12 } },
      React.createElement('div', { className: 'panel-title' }, 'GM Notes'),
      React.createElement('div', { className: 'panel-body' },
        React.createElement('textarea', {
          value: planet.notes || '',
          placeholder: 'Player history, locations they\'ve visited, NPCs encountered…',
          onChange: e => onUpdate({ notes: e.target.value }),
          rows: 4,
        })
      )
    ),

    // System neighbors strip
    system.planets.length > 1 && React.createElement('div', { className: 'panel' },
      React.createElement('div', { className: 'panel-title' }, 'System Planets'),
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          system.planets.map(p => React.createElement('div', {
            key: p.id,
            onClick: () => onSelectPlanet(p),
            style: {
              padding: '6px 10px',
              background: p.id === planet.id ? 'var(--accent-bg)' : 'var(--bg-2)',
              border: '1px solid ' + (p.id === planet.id ? 'var(--accent-soft)' : 'var(--border-soft)'),
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
            }
          }, p.name))
        )
      )
    )
  );
}

function PlanetView({ system, planet, onUpdate, onSelectPlanet, onRerollTexture, autoRotate }) {
  return React.createElement('div', { className: 'planet-view' },
    React.createElement('div', { className: 'planet-stage' },
      React.createElement(PlanetCanvas, {
        planet,
        starColor: system.starType.color,
        autoRotate,
      }),
      React.createElement('div', { className: 'stage-overlay' },
        React.createElement('div', { className: 'top-row' },
          React.createElement('div', { className: 'corner-mark' },
            `${system.hexId} · ${planet.name.toUpperCase()}`),
          React.createElement('div', { className: 'corner-mark' },
            `${planet.biome.toUpperCase()} · ${planet.techLevel.tl}`)
        ),
        React.createElement('div', { className: 'bottom-row' },
          React.createElement('div', { className: 'corner-mark' },
            React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'GRAV'),
            React.createElement('span', { style: { color: 'var(--fg-0)' } }, ' ' + planet.gravity + 'g')
          ),
          React.createElement('div', { className: 'corner-mark', style: { fontFamily: 'JetBrains Mono', fontSize: 10 } },
            'DRAG TO ROTATE · SCROLL TO ZOOM')
        )
      )
    ),
    React.createElement(PlanetSheet, { planet, system, onUpdate, onSelectPlanet, onRerollTexture })
  );
}

window.PlanetView = PlanetView;
window.PlanetCanvas = PlanetCanvas;
