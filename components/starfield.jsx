// Animated starfield backdrop. Stars parallax based on currentView; nebula clouds shift between views.
// Used as a fixed background layer behind the app.

const { useEffect, useRef } = React;

function Starfield({ viewKey, intensity = 1, palette = 'cool' }) {
  const canvasRef = useRef(null);
  const animRef = useRef({ stars: [], nebulas: [], targetX: 0, targetY: 0, x: 0, y: 0, w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    animRef.current.dpr = dpr;

    function resize() {
      const r = cvs.getBoundingClientRect();
      cvs.width = Math.floor(r.width * dpr);
      cvs.height = Math.floor(r.height * dpr);
      animRef.current.w = r.width;
      animRef.current.h = r.height;
      seed();
    }

    // Seed stars in 3 layers for parallax.
    function seed() {
      const { w, h } = animRef.current;
      const stars = [];
      const counts = [180, 110, 50];
      const speeds = [0.04, 0.10, 0.22]; // parallax depth multipliers
      const sizes = [[0.4, 1.0], [0.7, 1.6], [1.0, 2.4]];
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < counts[layer] * intensity; i++) {
          const tint = Math.random();
          let color;
          if (tint < 0.65) color = [240, 245, 255];
          else if (tint < 0.85) color = [200, 215, 255];
          else if (tint < 0.95) color = [255, 235, 200];
          else color = [255, 200, 200];
          stars.push({
            x: Math.random() * w * 1.5 - w * 0.25,
            y: Math.random() * h * 1.5 - h * 0.25,
            r: sizes[layer][0] + Math.random() * (sizes[layer][1] - sizes[layer][0]),
            speed: speeds[layer],
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.6 + Math.random() * 1.6,
            color,
            baseAlpha: 0.4 + Math.random() * 0.6,
          });
        }
      }
      // Nebula blobs
      const nebulas = [];
      const palettes = {
        cool: [[60, 80, 180], [120, 60, 200], [40, 100, 200]],
        warm: [[180, 80, 60], [200, 120, 60], [180, 60, 120]],
        teal: [[40, 150, 180], [60, 200, 200], [60, 130, 220]],
      };
      const pal = palettes[palette] || palettes.cool;
      for (let i = 0; i < 4; i++) {
        nebulas.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 200 + Math.random() * 320,
          color: pal[i % pal.length],
          drift: (Math.random() - 0.5) * 0.08,
          alpha: 0.05 + Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
        });
      }
      animRef.current.stars = stars;
      animRef.current.nebulas = nebulas;
    }

    resize();
    window.addEventListener('resize', resize);

    let raf;
    let t0 = performance.now();

    function frame(t) {
      const dt = Math.min(60, t - t0) / 1000;
      t0 = t;
      const { w, h, stars, nebulas } = animRef.current;
      // Lerp camera toward target
      animRef.current.x += (animRef.current.targetX - animRef.current.x) * Math.min(1, dt * 1.4);
      animRef.current.y += (animRef.current.targetY - animRef.current.y) * Math.min(1, dt * 1.4);
      const camX = animRef.current.x;
      const camY = animRef.current.y;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Deep space gradient
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h));
      g.addColorStop(0, 'rgba(15, 19, 32, 1)');
      g.addColorStop(0.6, 'rgba(7, 9, 13, 1)');
      g.addColorStop(1, 'rgba(0, 0, 4, 1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Nebulas
      for (const n of nebulas) {
        n.phase += dt * 0.15;
        const ox = Math.sin(n.phase) * 12;
        const oy = Math.cos(n.phase * 0.8) * 8;
        const grad = ctx.createRadialGradient(
          n.x + ox - camX * 0.3, n.y + oy - camY * 0.3, 0,
          n.x + ox - camX * 0.3, n.y + oy - camY * 0.3, n.r
        );
        const c = n.color;
        grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${n.alpha})`);
        grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Stars
      for (const s of stars) {
        s.twinklePhase += dt * s.twinkleSpeed;
        const tw = 0.5 + Math.sin(s.twinklePhase) * 0.5;
        const a = s.baseAlpha * (0.55 + tw * 0.45);
        let x = s.x - camX * s.speed;
        let y = s.y - camY * s.speed;
        // Wrap
        x = ((x % w) + w) % w;
        y = ((y % h) + h) % h;
        const [r, g, b] = s.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.4) {
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.18})`;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, palette]);

  // Shift starfield target on view change for a subtle pan
  useEffect(() => {
    // Map viewKey to a target position so it feels like we're "moving"
    const hash = String(viewKey || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    animRef.current.targetX = (hash % 200) - 100;
    animRef.current.targetY = ((hash * 37) % 200) - 100;
  }, [viewKey]);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: {
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
    },
  });
}

window.Starfield = Starfield;
