// Cinematic landing / intro screen for Cradle of Embers.
// Full-viewport overlay with drifting ember particles, the sector lore, and an Enter CTA.

const { useState: useISs, useEffect: useISe, useRef: useISr } = React;

function IntroScreen({ sector, seed, onEnter }) {
  const canvasRef = useISr(null);
  const [exiting, setExiting] = useISs(false);
  // Safety net: setTimeout fires even in throttled/background tabs (unlike rAF/CSS
  // animations), guaranteeing the content becomes visible if the entrance animation stalls.
  const [revealed, setRevealed] = useISs(false);
  useISe(() => {
    const t = setTimeout(() => setRevealed(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useISe(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h;
    function resize() {
      w = cvs.clientWidth; h = cvs.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    // Ember motes drifting upward from a warm hearth at the bottom-center.
    const motes = [];
    const COUNT = 90;
    function spawn(initial) {
      const cx = w * (0.5 + (Math.random() - 0.5) * 0.7);
      return {
        x: cx,
        y: initial ? Math.random() * h : h + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.25 + Math.random() * 0.75),
        r: 0.6 + Math.random() * 2.0,
        life: 0,
        maxLife: 320 + Math.random() * 360,
        hue: 18 + Math.random() * 26,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: 1 + Math.random() * 2.5,
      };
    }
    for (let i = 0; i < COUNT; i++) motes.push(spawn(true));

    let raf, t0 = performance.now();
    function frame(t) {
      const dt = Math.min(50, t - t0) / 16.67;
      t0 = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // warm hearth glow at bottom
      const hg = ctx.createRadialGradient(w / 2, h + 40, 0, w / 2, h + 40, h * 0.85);
      hg.addColorStop(0, 'rgba(255, 130, 50, 0.20)');
      hg.addColorStop(0.4, 'rgba(200, 70, 30, 0.10)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      for (const m of motes) {
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.vy -= 0.0015 * dt; // slight acceleration upward
        m.flickerPhase += 0.05 * m.flickerSpeed * dt;
        const lifeT = m.life / m.maxLife;
        const fade = lifeT < 0.1 ? lifeT / 0.1 : lifeT > 0.7 ? Math.max(0, 1 - (lifeT - 0.7) / 0.3) : 1;
        const flick = 0.6 + Math.sin(m.flickerPhase) * 0.4;
        const alpha = fade * flick * 0.9;
        const r = m.r * (1 + Math.sin(m.flickerPhase) * 0.15);
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r * 4);
        grad.addColorStop(0, `hsla(${m.hue}, 100%, 65%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${m.hue - 6}, 100%, 50%, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${m.hue + 10}, 100%, 80%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        if (m.y < -10 || m.life > m.maxLife) Object.assign(m, spawn(false));
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // Player: play the exit animation, then enter. GM: hand off immediately so the
  // app can show the password modal over the intro (intro unmounts on success).
  function enterPlayer() {
    setExiting(true);
    setTimeout(() => onEnter('player'), 850);
  }
  function enterGM() {
    onEnter('gm');
  }

  const worldCount = sector.systems.flatMap(s => s.planets).length;
  const stats = [
    { n: sector.systems.length, l: 'Systems' },
    { n: worldCount, l: 'Worlds' },
    { n: sector.factions.length, l: 'Factions' },
    { n: sector.npcs.length, l: 'NPCs' },
  ];

  return React.createElement('div', { className: 'intro-overlay' + (exiting ? ' exiting' : ''), 'data-screen-label': 'intro' },
    React.createElement('canvas', { ref: canvasRef, className: 'intro-canvas' }),
    React.createElement('div', { className: 'intro-vignette' }),
    React.createElement('div', { className: 'intro-content' + (revealed ? ' revealed' : '') },
      React.createElement('div', { className: 'intro-kicker', style: { animationDelay: '0.1s' } }, 'A Stars Without Number Sector'),
      React.createElement('div', { className: 'intro-sigil', style: { animationDelay: '0.2s' } },
        React.createElement('svg', { viewBox: '0 0 120 120', width: 92, height: 92 },
          React.createElement('defs', null,
            React.createElement('radialGradient', { id: 'introCore', cx: '50%', cy: '50%', r: '50%' },
              React.createElement('stop', { offset: '0%', stopColor: '#ffe2a8' }),
              React.createElement('stop', { offset: '45%', stopColor: '#ff9457' }),
              React.createElement('stop', { offset: '100%', stopColor: '#d65a2c' })
            )
          ),
          React.createElement('polygon', { points: '60,8 105,34 105,86 60,112 15,86 15,34', fill: 'none', stroke: 'rgba(255,148,87,0.55)', strokeWidth: 1.5 }),
          React.createElement('polygon', { points: '60,22 93,41 93,79 60,98 27,79 27,41', fill: 'none', stroke: 'rgba(255,148,87,0.30)', strokeWidth: 1 }),
          React.createElement('circle', { cx: 60, cy: 60, r: 15, fill: 'url(#introCore)' }),
          React.createElement('circle', { cx: 60, cy: 60, r: 24, fill: 'none', stroke: 'rgba(255,210,140,0.4)', strokeWidth: 0.75 })
        )
      ),
      React.createElement('h1', { className: 'intro-title', style: { animationDelay: '0.32s' } }, 'Cradle of Embers'),
      React.createElement('p', { className: 'intro-lore', style: { animationDelay: '0.46s' } }, sector.sectorLore),
      React.createElement('div', { className: 'intro-stats', style: { animationDelay: '0.6s' } },
        stats.flatMap((s, i) => {
          const arr = [React.createElement('div', { key: 's' + i, className: 'intro-stat' },
            React.createElement('div', { className: 'intro-stat-n' }, s.n),
            React.createElement('div', { className: 'intro-stat-l' }, s.l)
          )];
          if (i < stats.length - 1) arr.push(React.createElement('div', { key: 'd' + i, className: 'intro-stat-div' }));
          return arr;
        })
      ),
      React.createElement('div', { className: 'intro-cta-row', style: { animationDelay: '0.74s', display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' } },
        React.createElement('button', { className: 'intro-cta', onClick: enterPlayer },
          'Enter as Player',
          React.createElement('span', { className: 'intro-cta-arrow' }, '→')
        ),
        React.createElement('button', {
          className: 'intro-cta',
          onClick: enterGM,
          style: { background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', boxShadow: 'none' },
          title: 'GM access requires a password',
        },
          '🔒 Enter as GM',
          React.createElement('span', { className: 'intro-cta-arrow' }, '→')
        )
      ),
      React.createElement('div', { className: 'intro-seed', style: { animationDelay: '0.9s' } }, 'ROOM · ' + seed)
    )
  );
}

window.IntroScreen = IntroScreen;
