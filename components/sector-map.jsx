// Sector hex map — pan/zoom SVG, hex grid with star systems, route overlays, hover/click.

const { useState, useRef, useEffect, useMemo } = React;

// Pointy-top hex math.
const HEX_R = 40; // radius (center-to-corner) at zoom=1
function hexCenter(col, row) {
  const w = Math.sqrt(3) * HEX_R; // hex width
  const h = 2 * HEX_R; // hex height
  const x = col * w + (row % 2 ? w / 2 : 0) + w / 2;
  const y = row * h * 0.75 + h / 2;
  return { x, y };
}
function hexCorners(cx, cy, r = HEX_R) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function SectorMap({ sector, selectedHex, onSelect, showLabels, showGrid, showRoutes }) {
  const svgRef = useRef(null);
  const [tf, setTf] = useState({ x: 0, y: 0, k: 1 });
  const [drag, setDrag] = useState(null);
  const [hoverHex, setHoverHex] = useState(null);
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute extents and auto-fit on mount / when sector changes
  const layout = useMemo(() => {
    const cells = [];
    for (let col = 0; col < sector.cols; col++) {
      for (let row = 0; row < sector.rows; row++) {
        const { x, y } = hexCenter(col, row);
        cells.push({ col, row, x, y });
      }
    }
    const xs = cells.map(c => c.x);
    const ys = cells.map(c => c.y);
    const minX = Math.min(...xs) - HEX_R;
    const maxX = Math.max(...xs) + HEX_R;
    const minY = Math.min(...ys) - HEX_R;
    const maxY = Math.max(...ys) + HEX_R;
    return { cells, minX, maxX, minY, maxY, contentW: maxX - minX, contentH: maxY - minY };
  }, [sector.cols, sector.rows]);

  // Auto-fit when size changes
  useEffect(() => {
    if (!size.w || !size.h) return;
    const padX = 40, padY = 40;
    const k = Math.min((size.w - padX * 2) / layout.contentW, (size.h - padY * 2) / layout.contentH);
    const x = (size.w - layout.contentW * k) / 2 - layout.minX * k;
    const y = (size.h - layout.contentH * k) / 2 - layout.minY * k;
    setTf({ x, y, k });
  }, [size.w, size.h, layout.contentW, layout.contentH, layout.minX, layout.minY, sector.seed]);

  // Pan handlers
  function onPointerDown(e) {
    if (e.button !== 0 && e.button !== 1) return;
    setDrag({ sx: e.clientX, sy: e.clientY, ox: tf.x, oy: tf.y, moved: false });
  }
  function onPointerMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    setTf(t => ({ ...t, x: drag.ox + dx, y: drag.oy + dy }));
  }
  function onPointerUp() { setDrag(null); }
  function onWheel(e) {
    e.preventDefault();
    const r = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const newK = Math.max(0.4, Math.min(4, tf.k * factor));
    // Zoom around mouse
    const px = (mx - tf.x) / tf.k;
    const py = (my - tf.y) / tf.k;
    setTf({ k: newK, x: mx - px * newK, y: my - py * newK });
  }

  // Map systems by hex
  const systemsByHex = useMemo(() => {
    const m = {};
    sector.systems.forEach(s => { m[s.col + ',' + s.row] = s; });
    return m;
  }, [sector]);

  // Coords for routes
  const routesData = useMemo(() => {
    return sector.routes.map(r => {
      const a = sector.systems.find(s => s.hexId === r.fromHex);
      const b = sector.systems.find(s => s.hexId === r.toHex);
      if (!a || !b) return null;
      const ca = hexCenter(a.col, a.row);
      const cb = hexCenter(b.col, b.row);
      return { ...r, ax: ca.x, ay: ca.y, bx: cb.x, by: cb.y };
    }).filter(Boolean);
  }, [sector]);

  const selSys = selectedHex && sector.systems.find(s => s.hexId === selectedHex);

  return React.createElement('div', {
    className: 'sector-map' + (drag ? ' dragging' : ''),
    style: { width: '100%', height: '100%' },
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onPointerLeave: onPointerUp,
    onWheel: onWheel,
  }, React.createElement('svg', {
    ref: svgRef,
    width: '100%',
    height: '100%',
    style: { display: 'block', position: 'absolute', inset: 0 },
  },
    // Defs for filters
    React.createElement('defs', null,
      React.createElement('filter', { id: 'star-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' },
        React.createElement('feGaussianBlur', { stdDeviation: 3, result: 'blur' }),
        React.createElement('feMerge', null,
          React.createElement('feMergeNode', { in: 'blur' }),
          React.createElement('feMergeNode', { in: 'SourceGraphic' })
        )
      ),
      React.createElement('filter', { id: 'route-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' },
        React.createElement('feGaussianBlur', { stdDeviation: 1.5, result: 'blur' }),
        React.createElement('feMerge', null,
          React.createElement('feMergeNode', { in: 'blur' }),
          React.createElement('feMergeNode', { in: 'SourceGraphic' })
        )
      )
    ),
    React.createElement('g', { transform: `translate(${tf.x}, ${tf.y}) scale(${tf.k})` },
      // Background grid hexes
      showGrid && layout.cells.map(c => {
        const pts = hexCorners(c.x, c.y).map(p => p.join(',')).join(' ');
        const hexId = String.fromCharCode(65 + c.col) + String(c.row + 1).padStart(2, '0');
        return React.createElement('polygon', {
          key: 'g' + c.col + '-' + c.row,
          points: pts,
          fill: 'rgba(56, 139, 253, 0.02)',
          stroke: 'rgba(88, 166, 255, 0.12)',
          strokeWidth: 0.6,
          'data-hex': hexId,
        });
      }),
      // Hex labels (coord)
      showLabels && showGrid && layout.cells.map(c => {
        const hexId = String.fromCharCode(65 + c.col) + String(c.row + 1).padStart(2, '0');
        return React.createElement('text', {
          key: 't' + c.col + '-' + c.row,
          x: c.x, y: c.y - HEX_R * 0.7,
          textAnchor: 'middle',
          fontSize: 8,
          fill: 'rgba(139, 148, 158, 0.5)',
          fontFamily: 'JetBrains Mono, monospace',
          style: { pointerEvents: 'none', userSelect: 'none' },
        }, hexId);
      }),
      // Routes
      showRoutes && routesData.map(r => React.createElement('g', { key: r.id },
        React.createElement('line', {
          x1: r.ax, y1: r.ay, x2: r.bx, y2: r.by,
          stroke: r.traffic === 'Heavy' ? 'rgba(88, 166, 255, 0.7)' : 'rgba(88, 166, 255, 0.35)',
          strokeWidth: r.traffic === 'Heavy' ? 1.6 : 1,
          strokeDasharray: r.traffic === 'Light' ? '3,3' : 'none',
          filter: 'url(#route-glow)',
        })
      )),
      // Systems
      sector.systems.map(s => {
        const { x, y } = hexCenter(s.col, s.row);
        const isSelected = selectedHex === s.hexId;
        const isHover = hoverHex === s.hexId;
        const r = 6 + (s.planets.length > 3 ? 2 : 0);
        return React.createElement('g', {
          key: s.hexId,
          className: 'hex-glyph',
          transform: `translate(${x}, ${y})`,
          onPointerDown: e => e.stopPropagation(),
          onClick: (e) => { if (!drag?.moved) onSelect(s.hexId); },
          onMouseEnter: () => setHoverHex(s.hexId),
          onMouseLeave: () => setHoverHex(null),
        },
          // Glow
          React.createElement('circle', {
            r: r * 3, fill: s.starType.color, opacity: isSelected ? 0.5 : isHover ? 0.35 : 0.22, filter: 'url(#star-glow)',
          }),
          // Star body
          React.createElement('circle', {
            r, fill: s.starType.color, stroke: 'white', strokeWidth: 0.5, opacity: 0.95,
          }),
          // Planet count dots arranged below
          ...s.planets.slice(0, 5).map((p, i) => React.createElement('circle', {
            key: i,
            cx: -((s.planets.length - 1) * 3) / 2 + i * 3,
            cy: r + 6,
            r: 1.2,
            fill: 'rgba(201, 209, 217, 0.7)',
          })),
          // Selection ring
          isSelected && React.createElement('circle', {
            r: r + 6, fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.5, strokeDasharray: '4 3',
          }),
          // Label
          showLabels && React.createElement('text', {
            x: 0, y: -r - 7,
            textAnchor: 'middle',
            fontSize: 11,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fill: isSelected ? 'var(--fg-0)' : 'var(--fg-1)',
            style: { pointerEvents: 'none', userSelect: 'none' },
          }, s.planets[0]?.name || s.starName),
          showLabels && React.createElement('text', {
            x: 0, y: -r + 4,
            textAnchor: 'middle',
            fontSize: 8,
            fontFamily: 'JetBrains Mono, monospace',
            fill: 'rgba(139, 148, 158, 0.85)',
            style: { pointerEvents: 'none', userSelect: 'none' },
          }, s.hexId + ' · ' + s.starType.class)
        );
      })
    ),
    // HUD: zoom + scale
    React.createElement('g', { transform: `translate(20, ${size.h - 70})` },
      React.createElement('rect', { x: 0, y: 0, width: 200, height: 50, fill: 'rgba(13,17,23,0.7)', stroke: 'var(--border-soft)', rx: 8 }),
      React.createElement('text', { x: 12, y: 18, fontSize: 10, fill: 'var(--fg-3)', fontFamily: 'JetBrains Mono', letterSpacing: 1 }, 'SECTOR'),
      React.createElement('text', { x: 12, y: 36, fontSize: 13, fill: 'var(--fg-0)', fontFamily: 'Space Grotesk', fontWeight: 600 }, sector.sectorName),
      React.createElement('text', { x: 12, y: 47, fontSize: 9, fill: 'var(--fg-3)', fontFamily: 'JetBrains Mono' }, `${sector.systems.length} systems · ${sector.systems.flatMap(s=>s.planets).length} worlds`)
    ),
    React.createElement('g', { transform: `translate(${size.w - 130}, ${size.h - 50})` },
      React.createElement('rect', { x: 0, y: 0, width: 110, height: 30, fill: 'rgba(13,17,23,0.7)', stroke: 'var(--border-soft)', rx: 8 }),
      React.createElement('text', { x: 12, y: 12, fontSize: 9, fill: 'var(--fg-3)', fontFamily: 'JetBrains Mono', letterSpacing: 1 }, 'ZOOM'),
      React.createElement('text', { x: 12, y: 24, fontSize: 11, fill: 'var(--fg-1)', fontFamily: 'JetBrains Mono' }, tf.k.toFixed(2) + 'x')
    ),
    // Hover tooltip
    hoverHex && (() => {
      const sys = sector.systems.find(s => s.hexId === hoverHex);
      if (!sys) return null;
      const { x, y } = hexCenter(sys.col, sys.row);
      const sx = tf.x + x * tf.k + 16;
      const sy = tf.y + y * tf.k - 30;
      return React.createElement('foreignObject', { x: sx, y: sy, width: 220, height: 120, style: { pointerEvents: 'none' } },
        React.createElement('div', { xmlns: 'http://www.w3.org/1999/xhtml', style: {
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid var(--border-1)',
          borderRadius: '6px',
          padding: '8px 10px',
          font: '12px IBM Plex Sans, sans-serif',
          color: 'var(--fg-1)',
        } },
          React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '13px', color: 'var(--fg-0)' } }, sys.planets[0]?.name || sys.starName),
          React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--fg-3)', marginTop: '2px' } },
            `${sys.hexId} · ${sys.starType.class}-type star · ${sys.planets.length} ${sys.planets.length === 1 ? 'planet' : 'planets'}`
          ),
          sys.planets[0] && React.createElement('div', { style: { marginTop: '4px', fontSize: '11px' } },
            sys.planets[0].tags.map(t => t.name).join(', ')
          )
        )
      );
    })()
  ));
}

window.SectorMap = SectorMap;
