// System view — orbit diagram with the star + planets + moons.

const { useState: useStateSV, useEffect: useEffectSV } = React;

function SystemView({ system, onPickPlanet }) {
  const [tick, setTick] = useStateSV(0);
  useEffectSV(() => {
    let raf;
    let t0 = performance.now();
    function loop(t) {
      setTick(t / 1000);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const w = 1200, h = 720;
  const cx = w / 2, cy = h / 2;
  const starColor = system.starType.color;

  // Orbit radii — log-spaced
  const orbits = system.planets.map((_, i) => 90 + i * 80);

  // Biome → color summary
  const biomeColor = (b) => ({
    rocky: '#9a7c5d', temperate: '#5a8c5a', ice: '#cfe2f5', molten: '#ff7a3c',
    toxic: '#c9d44a', engineered: '#b58be6', desert: '#e2b070', ocean: '#4e90c7',
  }[b] || '#aaa');

  return React.createElement('div', { style: { width: '100%', height: '100%', position: 'relative', overflow: 'hidden' } },
    React.createElement('svg', {
      viewBox: `0 0 ${w} ${h}`,
      preserveAspectRatio: 'xMidYMid meet',
      style: { width: '100%', height: '100%', display: 'block' }
    },
      React.createElement('defs', null,
        React.createElement('radialGradient', { id: 'sun-glow', cx: '50%', cy: '50%', r: '50%' },
          React.createElement('stop', { offset: '0%', stopColor: starColor, stopOpacity: 1 }),
          React.createElement('stop', { offset: '40%', stopColor: starColor, stopOpacity: 0.4 }),
          React.createElement('stop', { offset: '100%', stopColor: starColor, stopOpacity: 0 })
        ),
        React.createElement('filter', { id: 'sys-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' },
          React.createElement('feGaussianBlur', { stdDeviation: 4 })
        )
      ),
      // Header label
      React.createElement('text', { x: 32, y: 36, fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600, fill: 'var(--fg-0)' }, system.starName + ' SYSTEM'),
      React.createElement('text', { x: 32, y: 56, fontFamily: 'JetBrains Mono', fontSize: 11, fill: 'var(--fg-3)' },
        `${system.hexId} · ${system.starType.class}-class · ${system.starType.desc} · ${system.starType.temp}`),
      // Coord scale on right
      React.createElement('g', { transform: `translate(${w - 220}, 26)` },
        React.createElement('text', { x: 0, y: 0, fontFamily: 'JetBrains Mono', fontSize: 10, fill: 'var(--fg-3)' }, 'PLANETS'),
        React.createElement('text', { x: 0, y: 16, fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 600, fill: 'var(--fg-0)' }, system.planets.length + ' worlds'),
        React.createElement('text', { x: 0, y: 32, fontFamily: 'JetBrains Mono', fontSize: 10, fill: 'var(--fg-3)' },
          system.planets.reduce((sum, p) => sum + p.moons.length, 0) + ' moons total')
      ),
      // Orbit rings
      orbits.map((r, i) => React.createElement('circle', {
        key: 'o' + i, cx, cy, r, fill: 'none', stroke: 'rgba(88, 166, 255, 0.16)', strokeWidth: 0.5, strokeDasharray: '3 4',
      })),
      // Sun glow
      React.createElement('circle', { cx, cy, r: 90, fill: 'url(#sun-glow)' }),
      React.createElement('circle', { cx, cy, r: 22, fill: starColor, filter: 'url(#sys-glow)' }),
      React.createElement('circle', { cx, cy, r: 16, fill: starColor }),
      // Planets
      system.planets.map((p, i) => {
        const r = orbits[i];
        const speed = 1 / (i + 4) * 0.35;
        const a = tick * speed + i * 0.7;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        const pr = 5 + p.radius * 0.9;
        return React.createElement('g', { key: p.id, onClick: () => onPickPlanet(p), style: { cursor: 'pointer' } },
          React.createElement('circle', { cx: px, cy: py, r: pr * 2.2, fill: biomeColor(p.biome), opacity: 0.18 }),
          React.createElement('circle', { cx: px, cy: py, r: pr, fill: biomeColor(p.biome), stroke: 'rgba(255,255,255,0.4)', strokeWidth: 0.5 }),
          p.ringSystem && React.createElement('ellipse', { cx: px, cy: py, rx: pr * 1.8, ry: pr * 0.4, fill: 'none', stroke: biomeColor(p.biome), strokeWidth: 0.8, opacity: 0.7 }),
          // Moons
          p.moons.map((m, mi) => {
            const ma = tick * (0.6 + mi * 0.2) + mi;
            const mr = pr + 8 + mi * 5;
            const mx = px + Math.cos(ma) * mr;
            const my = py + Math.sin(ma) * mr;
            return React.createElement('circle', { key: mi, cx: mx, cy: my, r: 1.5, fill: biomeColor(m.biome) });
          }),
          // Label
          React.createElement('text', { x: px + pr + 8, y: py + 4, fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, fill: 'var(--fg-0)' }, p.name),
          React.createElement('text', { x: px + pr + 8, y: py + 18, fontSize: 9, fontFamily: 'JetBrains Mono', fill: 'var(--fg-3)' },
            `${p.biome.toUpperCase()} · ${p.techLevel.tl} · ${p.tags[0].name}`)
        );
      }),
      // Tap to focus
      React.createElement('text', { x: 32, y: h - 22, fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'var(--fg-3)' },
        'CLICK A PLANET TO OPEN 3D VIEW · ORBITS NOT TO SCALE')
    )
  );
}

window.SystemView = SystemView;
