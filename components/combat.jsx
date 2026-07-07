// Tactical combat map — square grid with terrain, tokens, initiative tracker, fog of war.

const { useState: useCS, useRef: useCR, useEffect: useCE } = React;

const TERRAIN_TYPES = {
  floor:    { name: 'Floor',    color: '#2a2f38', cost: 1, passable: true },
  rough:    { name: 'Rough',    color: '#4a3f30', cost: 2, passable: true },
  water:    { name: 'Water',    color: '#2a4a6f', cost: 2, passable: true },
  wall:     { name: 'Wall',     color: '#0e1116', cost: Infinity, passable: false },
  cover:    { name: 'Cover',    color: '#3a4a55', cost: 1, passable: true, cover: 1 },
  hazard:   { name: 'Hazard',   color: '#5a2020', cost: 1, passable: true, danger: true },
  exit:     { name: 'Exit',     color: '#1f5a2a', cost: 1, passable: true },
};

const TOKEN_TYPES = [
  { kind: 'pc', label: 'PC', color: '#58a6ff', icon: '◉' },
  { kind: 'npc', label: 'Ally', color: '#3fb950', icon: '◆' },
  { kind: 'enemy', label: 'Enemy', color: '#f85149', icon: '✖' },
  { kind: 'neutral', label: 'Neutral', color: '#f0b849', icon: '◇' },
  { kind: 'hazard', label: 'Marker', color: '#d2a8ff', icon: '✱' },
];

const PRESETS = {
  'Cargo Bay Boarding': {
    cols: 22, rows: 14, terrain: (x, y) => {
      if (x === 0 || x === 21 || y === 0 || y === 13) return 'wall';
      if ((x === 7 || x === 14) && y > 1 && y < 12) return 'cover';
      if (x === 11 && (y === 3 || y === 4 || y === 9 || y === 10)) return 'cover';
      if (x >= 18 && x <= 20 && y >= 6 && y <= 8) return 'exit';
      return 'floor';
    },
    tokens: [
      { x: 2, y: 6, kind: 'pc', name: 'Player 1', hp: 12, maxHp: 12 },
      { x: 2, y: 7, kind: 'pc', name: 'Player 2', hp: 14, maxHp: 14 },
      { x: 3, y: 5, kind: 'pc', name: 'Player 3', hp: 10, maxHp: 10 },
      { x: 17, y: 5, kind: 'enemy', name: 'Pirate', hp: 6, maxHp: 8 },
      { x: 17, y: 9, kind: 'enemy', name: 'Pirate', hp: 8, maxHp: 8 },
      { x: 19, y: 7, kind: 'enemy', name: 'Boss', hp: 22, maxHp: 22 },
    ],
  },
  'Ruined Hab Block': {
    cols: 24, rows: 16, terrain: (x, y) => {
      if (x === 0 || x === 23 || y === 0 || y === 15) return 'wall';
      // Inner rooms
      if (y === 5 && x > 1 && x < 10 && x !== 5) return 'wall';
      if (y === 10 && x > 13 && x < 22 && x !== 18) return 'wall';
      if (x === 12 && y > 2 && y < 13 && y !== 7 && y !== 8) return 'wall';
      // Rubble cover
      if ((x + y) % 7 === 3 && y > 0 && y < 15 && x > 0 && x < 23) {
        return Math.random() < 0.6 ? 'rough' : 'cover';
      }
      // Hazard pools
      if (x === 16 && y === 13) return 'hazard';
      if (x === 17 && y === 13) return 'hazard';
      return 'floor';
    },
    tokens: [
      { x: 2, y: 2, kind: 'pc', name: 'Vex', hp: 11, maxHp: 12 },
      { x: 3, y: 3, kind: 'pc', name: 'Mira', hp: 14, maxHp: 14 },
      { x: 2, y: 4, kind: 'pc', name: 'Cob', hp: 9, maxHp: 10 },
      { x: 20, y: 12, kind: 'enemy', name: 'Maneater', hp: 10, maxHp: 10 },
      { x: 22, y: 8, kind: 'enemy', name: 'Maneater', hp: 10, maxHp: 10 },
      { x: 14, y: 6, kind: 'neutral', name: 'Survivor', hp: 4, maxHp: 4 },
    ],
  },
  'Blank Grid': {
    cols: 24, rows: 16, terrain: (x, y) => (x === 0 || x === 23 || y === 0 || y === 15) ? 'wall' : 'floor',
    tokens: [],
  },
};

function makeMap(presetName) {
  const p = PRESETS[presetName];
  const grid = [];
  for (let y = 0; y < p.rows; y++) {
    const row = [];
    for (let x = 0; x < p.cols; x++) row.push(p.terrain(x, y));
    grid.push(row);
  }
  const tokens = p.tokens.map((t, i) => ({ id: 'tok-' + Date.now() + '-' + i, ...t, init: Math.floor(Math.random() * 20) + 1 }));
  return { cols: p.cols, rows: p.rows, grid, tokens, turn: 0, round: 1, name: presetName, backdrop: null };
}

const DEFAULT_BACKDROP = { scale: 100, offsetX: 0, offsetY: 0, opacity: 70 };

function CombatView() {
  const [map, setMap] = useCS(() => makeMap('Cargo Bay Boarding'));
  const [tool, setTool] = useCS('select'); // select, paint-terrain, paint-token
  const [paintTerrain, setPaintTerrain] = useCS('cover');
  const [paintTokenKind, setPaintTokenKind] = useCS('enemy');
  const [selTokenId, setSelTokenId] = useCS(null);
  const [showGrid, setShowGrid] = useCS(true);
  const [showRanges, setShowRanges] = useCS(false);
  const [tf, setTf] = useCS({ x: 40, y: 80, k: 1 });
  const dragRef = useCR(null);
  const containerRef = useCR(null);
  const fileInputRef = useCR(null);

  const cell = 38; // px per cell at zoom 1
  const W = map.cols * cell;
  const H = map.rows * cell;

  function setTerrainAt(x, y, t) {
    setMap(m => {
      const grid = m.grid.map(r => r.slice());
      grid[y][x] = t;
      return { ...m, grid };
    });
  }
  function addToken(x, y, kind) {
    const tok = TOKEN_TYPES.find(t => t.kind === kind);
    const id = 'tok-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setMap(m => ({
      ...m,
      tokens: [...m.tokens, { id, x, y, kind, name: tok.label, hp: 8, maxHp: 8, init: Math.floor(Math.random() * 20) + 1 }],
    }));
    setSelTokenId(id);
  }
  function moveToken(id, x, y) {
    setMap(m => ({ ...m, tokens: m.tokens.map(t => t.id === id ? { ...t, x, y } : t) }));
  }
  function updateToken(id, patch) {
    setMap(m => ({ ...m, tokens: m.tokens.map(t => t.id === id ? { ...t, ...patch } : t) }));
  }
  function deleteToken(id) {
    setMap(m => ({ ...m, tokens: m.tokens.filter(t => t.id !== id) }));
    if (selTokenId === id) setSelTokenId(null);
  }

  // ── Backdrop image: upload a generated battle map, then nudge it into
  // alignment with the grid using scale/offset/opacity controls. Stored as
  // a data URL directly on the map object — no file/repo step needed.
  function setBackdropImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      setMap(m => ({ ...m, backdrop: { ...DEFAULT_BACKDROP, src: reader.result } }));
    };
    reader.readAsDataURL(file);
  }
  function updateBackdrop(patch) {
    setMap(m => ({ ...m, backdrop: m.backdrop ? { ...m.backdrop, ...patch } : m.backdrop }));
  }
  function removeBackdrop() {
    setMap(m => ({ ...m, backdrop: null }));
  }

  function gridFromEvent(e) {
    const r = containerRef.current.getBoundingClientRect();
    const lx = (e.clientX - r.left - tf.x) / tf.k;
    const ly = (e.clientY - r.top - tf.y) / tf.k;
    return { x: Math.floor(lx / cell), y: Math.floor(ly / cell), lx, ly };
  }

  function onPointerDown(e) {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      // pan
      dragRef.current = { mode: 'pan', sx: e.clientX, sy: e.clientY, ox: tf.x, oy: tf.y };
      return;
    }
    const { x, y } = gridFromEvent(e);
    if (x < 0 || y < 0 || x >= map.cols || y >= map.rows) return;

    if (tool === 'paint-terrain') {
      dragRef.current = { mode: 'paint' };
      setTerrainAt(x, y, paintTerrain);
    } else if (tool === 'paint-token') {
      addToken(x, y, paintTokenKind);
    } else {
      // select: token under cursor?
      const tok = map.tokens.find(t => t.x === x && t.y === y);
      if (tok) {
        setSelTokenId(tok.id);
        dragRef.current = { mode: 'drag-token', id: tok.id, startX: tok.x, startY: tok.y };
      } else {
        setSelTokenId(null);
        dragRef.current = { mode: 'pan', sx: e.clientX, sy: e.clientY, ox: tf.x, oy: tf.y };
      }
    }
  }
  function onPointerMove(e) {
    if (!dragRef.current) return;
    if (dragRef.current.mode === 'pan') {
      const dx = e.clientX - dragRef.current.sx;
      const dy = e.clientY - dragRef.current.sy;
      setTf(t => ({ ...t, x: dragRef.current.ox + dx, y: dragRef.current.oy + dy }));
    } else if (dragRef.current.mode === 'paint') {
      const { x, y } = gridFromEvent(e);
      if (x < 0 || y < 0 || x >= map.cols || y >= map.rows) return;
      setTerrainAt(x, y, paintTerrain);
    } else if (dragRef.current.mode === 'drag-token') {
      const { x, y } = gridFromEvent(e);
      if (x < 0 || y < 0 || x >= map.cols || y >= map.rows) return;
      moveToken(dragRef.current.id, x, y);
    }
  }
  function onPointerUp() { dragRef.current = null; }
  function onWheel(e) {
    e.preventDefault();
    const r = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const factor = e.deltaY < 0 ? 1.12 : 1/1.12;
    const newK = Math.max(0.4, Math.min(3, tf.k * factor));
    const px = (mx - tf.x) / tf.k;
    const py = (my - tf.y) / tf.k;
    setTf({ k: newK, x: mx - px * newK, y: my - py * newK });
  }

  const sortedInit = [...map.tokens].sort((a, b) => b.init - a.init);
  const selToken = map.tokens.find(t => t.id === selTokenId);

  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', height: '100%', overflow: 'hidden' } },
    // Map area
    React.createElement('div', {
      ref: containerRef,
      style: { position: 'relative', overflow: 'hidden', background: '#080a0e' },
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
      onWheel,
    },
      // Toolbar (floating top)
      React.createElement('div', { style: { position: 'absolute', top: 12, left: 12, zIndex: 5, display: 'flex', gap: 8, flexWrap: 'wrap', background: 'rgba(13,17,23,0.85)', padding: 8, border: '1px solid var(--border-soft)', borderRadius: 8, backdropFilter: 'blur(6px)' } },
        React.createElement('select', {
          value: map.name,
          onChange: e => setMap(makeMap(e.target.value)),
          style: { width: 160, fontSize: 11, padding: '4px 8px' },
        }, Object.keys(PRESETS).map(k => React.createElement('option', { key: k, value: k }, k))),
        ['select', 'paint-terrain', 'paint-token'].map(t => React.createElement('button', {
          key: t,
          className: tool === t ? 'primary' : 'ghost',
          style: { fontSize: 11 },
          onClick: () => setTool(t),
        }, t === 'select' ? '◉ Select' : t === 'paint-terrain' ? '▦ Terrain' : '✚ Token')),
        tool === 'paint-terrain' && React.createElement('select', {
          value: paintTerrain,
          onChange: e => setPaintTerrain(e.target.value),
          style: { width: 110, fontSize: 11, padding: '4px 8px' },
        }, Object.entries(TERRAIN_TYPES).map(([k, v]) => React.createElement('option', { key: k, value: k }, v.name))),
        tool === 'paint-token' && React.createElement('select', {
          value: paintTokenKind,
          onChange: e => setPaintTokenKind(e.target.value),
          style: { width: 110, fontSize: 11, padding: '4px 8px' },
        }, TOKEN_TYPES.map(t => React.createElement('option', { key: t.kind, value: t.kind }, t.label))),
        React.createElement('button', { className: showGrid ? 'primary' : 'ghost', style: { fontSize: 11 }, onClick: () => setShowGrid(g => !g) }, '# Grid'),
        React.createElement('button', { className: showRanges ? 'primary' : 'ghost', style: { fontSize: 11 }, onClick: () => setShowRanges(r => !r) }, '◌ Ranges'),
        React.createElement('input', {
          ref: fileInputRef, type: 'file', accept: 'image/*', style: { display: 'none' },
          onChange: e => { if (e.target.files[0]) setBackdropImage(e.target.files[0]); e.target.value = ''; },
        }),
        React.createElement('button', {
          className: map.backdrop ? 'primary' : 'ghost', style: { fontSize: 11 },
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
        }, '🖼 ' + (map.backdrop ? 'Change Map Image' : 'Upload Map Image')),
        map.backdrop && React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: removeBackdrop }, '✕ Remove')
      ),
      // Backdrop alignment panel — nudge scale/offset/opacity until the grid
      // lines up with crate corners in the generated map image.
      map.backdrop && React.createElement('div', {
        style: {
          position: 'absolute', top: 12, right: 12, zIndex: 5, width: 220,
          background: 'rgba(13,17,23,0.9)', padding: 12, border: '1px solid var(--border-soft)',
          borderRadius: 8, backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', gap: 10,
        },
      },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '0.05em', textTransform: 'uppercase' } }, 'Align Backdrop'),
        [
          { key: 'scale', label: 'Scale', min: 25, max: 300, step: 1, unit: '%' },
          { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 1, unit: '%' },
        ].map(({ key, label, min, max, step, unit }) => React.createElement('div', { key },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-3)', marginBottom: 2 } },
            React.createElement('span', null, label), React.createElement('span', null, map.backdrop[key] + unit)),
          React.createElement('input', {
            type: 'range', min, max, step, value: map.backdrop[key], style: { width: '100%' },
            onChange: e => updateBackdrop({ [key]: +e.target.value }),
          }),
        )),
        [['offsetX', 'X'], ['offsetY', 'Y']].map(([key, label]) => React.createElement('div', { key, style: { display: 'flex', alignItems: 'center', gap: 6 } },
          React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)', width: 14 } }, label),
          React.createElement('button', { className: 'ghost', style: { fontSize: 11, padding: '2px 8px' }, onClick: () => updateBackdrop({ [key]: map.backdrop[key] - 10 }) }, '−10'),
          React.createElement('button', { className: 'ghost', style: { fontSize: 11, padding: '2px 6px' }, onClick: () => updateBackdrop({ [key]: map.backdrop[key] - 1 }) }, '−1'),
          React.createElement('input', {
            type: 'number', value: map.backdrop[key], style: { width: 52, fontSize: 11, textAlign: 'center' },
            onChange: e => updateBackdrop({ [key]: +e.target.value || 0 }),
          }),
          React.createElement('button', { className: 'ghost', style: { fontSize: 11, padding: '2px 6px' }, onClick: () => updateBackdrop({ [key]: map.backdrop[key] + 1 }) }, '+1'),
          React.createElement('button', { className: 'ghost', style: { fontSize: 11, padding: '2px 8px' }, onClick: () => updateBackdrop({ [key]: map.backdrop[key] + 10 }) }, '+10'),
        )),
        React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => updateBackdrop(DEFAULT_BACKDROP) }, '↺ Reset Alignment')
      ),
      // Help (bottom)
      React.createElement('div', { style: { position: 'absolute', bottom: 12, left: 12, zIndex: 5, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--fg-3)', background: 'rgba(13,17,23,0.7)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-soft)' } },
        'CLICK TOKEN TO SELECT · DRAG TO MOVE · SHIFT+DRAG TO PAN · SCROLL TO ZOOM'),
      // SVG canvas
      React.createElement('svg', {
        width: '100%', height: '100%', style: { display: 'block', position: 'absolute', inset: 0 },
      },
        React.createElement('g', { transform: `translate(${tf.x}, ${tf.y}) scale(${tf.k})` },
          // Backdrop image (generated battle map), aligned via scale/offset controls
          map.backdrop && React.createElement('image', {
            href: map.backdrop.src,
            x: map.backdrop.offsetX,
            y: map.backdrop.offsetY,
            width: W * (map.backdrop.scale / 100),
            height: H * (map.backdrop.scale / 100),
            opacity: map.backdrop.opacity / 100,
            preserveAspectRatio: 'none',
          }),
          // Outer frame
          React.createElement('rect', { x: -2, y: -2, width: W + 4, height: H + 4, fill: 'none', stroke: 'var(--border-1)', strokeWidth: 1 }),
          // Cells — when a backdrop is present, floor tiles go transparent (let the
          // art show through) while walls/cover/hazard/exit stay tinted so their
          // mechanical meaning still reads on top of the artwork.
          map.grid.map((row, y) => row.map((t, x) => {
            const def = TERRAIN_TYPES[t];
            const hasBackdrop = !!map.backdrop;
            const isFloor = t === 'floor';
            return React.createElement('g', { key: x + ',' + y },
              React.createElement('rect', {
                x: x * cell, y: y * cell, width: cell, height: cell,
                fill: def.color,
                fillOpacity: hasBackdrop ? (isFloor ? 0 : 0.4) : 1,
                stroke: showGrid ? 'rgba(48, 54, 61, 0.5)' : 'none',
                strokeWidth: 0.5,
              }),
              def.cover && React.createElement('rect', {
                x: x * cell + 4, y: y * cell + 4, width: cell - 8, height: cell - 8,
                fill: 'none', stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1, strokeDasharray: '2 2',
              }),
              def.danger && React.createElement('text', {
                x: x * cell + cell / 2, y: y * cell + cell / 2 + 4,
                textAnchor: 'middle', fontSize: 14, fill: 'rgba(255,150,150,0.8)',
              }, '⚠'),
              t === 'exit' && React.createElement('text', {
                x: x * cell + cell / 2, y: y * cell + cell / 2 + 4,
                textAnchor: 'middle', fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'rgba(200,255,200,0.7)',
              }, 'EXIT')
            );
          })),
          // Range overlay for selected token
          selToken && showRanges && (() => {
            const range = 6; // standard move
            const cx = selToken.x * cell + cell / 2;
            const cy = selToken.y * cell + cell / 2;
            return React.createElement('circle', { cx, cy, r: range * cell, fill: 'rgba(88,166,255,0.08)', stroke: 'rgba(88,166,255,0.4)', strokeWidth: 1, strokeDasharray: '4 4' });
          })(),
          // Tokens
          map.tokens.map(t => {
            const def = TOKEN_TYPES.find(x => x.kind === t.kind);
            const cx = t.x * cell + cell / 2;
            const cy = t.y * cell + cell / 2;
            const isSel = t.id === selTokenId;
            const isCur = sortedInit[map.turn]?.id === t.id;
            return React.createElement('g', { key: t.id, style: { cursor: 'grab' } },
              isSel && React.createElement('circle', { cx, cy, r: cell * 0.55, fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.5, strokeDasharray: '3 3' }),
              isCur && React.createElement('circle', { cx, cy, r: cell * 0.6, fill: 'none', stroke: 'var(--warning)', strokeWidth: 2 }),
              React.createElement('circle', { cx, cy, r: cell * 0.4, fill: def.color, stroke: '#000', strokeWidth: 1, opacity: 0.95 }),
              React.createElement('text', { x: cx, y: cy + 4, textAnchor: 'middle', fontSize: 14, fontFamily: 'Space Grotesk', fontWeight: 700, fill: '#fff' }, def.icon),
              React.createElement('text', { x: cx, y: cy + cell * 0.4 + 12, textAnchor: 'middle', fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'var(--fg-1)' }, t.name),
              // HP bar above
              React.createElement('rect', { x: cx - cell * 0.4, y: cy - cell * 0.45 - 4, width: cell * 0.8, height: 3, fill: 'rgba(0,0,0,0.6)', rx: 1.5 }),
              React.createElement('rect', { x: cx - cell * 0.4, y: cy - cell * 0.45 - 4, width: cell * 0.8 * (t.hp / t.maxHp), height: 3, fill: t.hp / t.maxHp < 0.3 ? 'var(--danger)' : t.hp / t.maxHp < 0.6 ? 'var(--warning)' : 'var(--success)', rx: 1.5 })
            );
          })
        )
      )
    ),
    // Right: initiative & selected token
    React.createElement('div', { style: { borderLeft: '1px solid var(--border-soft)', background: 'rgba(13,17,23,0.85)', overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
        React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18, color: 'var(--fg-0)' } }, 'Round ' + map.round),
        React.createElement('div', { style: { display: 'flex', gap: 4 } },
          React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => setMap(m => {
            const next = (m.turn + 1) % m.tokens.length;
            return { ...m, turn: next, round: next === 0 ? m.round + 1 : m.round };
          }) }, 'Next Turn →')
        )
      ),
      React.createElement('div', { className: 'panel' },
        React.createElement('div', { className: 'panel-title' }, 'Initiative'),
        React.createElement('div', { className: 'panel-body', style: { padding: 4 } },
          sortedInit.map((t, i) => {
            const def = TOKEN_TYPES.find(x => x.kind === t.kind);
            const isCur = i === map.turn;
            return React.createElement('div', { key: t.id,
              onClick: () => setSelTokenId(t.id),
              style: {
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                background: isCur ? 'var(--accent-bg)' : 'transparent',
                borderLeft: isCur ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                borderRadius: 4,
              }
            },
              React.createElement('span', { style: { width: 20, height: 20, borderRadius: '50%', background: def.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 } }, def.icon),
              React.createElement('span', { style: { flex: 1, fontSize: 12 } }, t.name),
              React.createElement('span', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--fg-3)' } }, t.init),
              React.createElement('span', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: t.hp / t.maxHp < 0.3 ? 'var(--danger)' : 'var(--fg-1)' } }, t.hp + '/' + t.maxHp)
            );
          })
        )
      ),
      // Selected token
      selToken ? React.createElement('div', { className: 'panel' },
        React.createElement('div', { className: 'panel-title' }, 'Selected Token'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('input', { value: selToken.name, onChange: e => updateToken(selToken.id, { name: e.target.value }), style: { marginBottom: 8 } }),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', width: 50 } }, 'HP'),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => updateToken(selToken.id, { hp: Math.max(0, selToken.hp - 1) }) }, '−'),
            React.createElement('span', { style: { fontFamily: 'JetBrains Mono', fontSize: 14, minWidth: 50, textAlign: 'center' } }, selToken.hp + '/' + selToken.maxHp),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => updateToken(selToken.id, { hp: Math.min(selToken.maxHp, selToken.hp + 1) }) }, '+'),
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', width: 50 } }, 'Max'),
            React.createElement('input', { type: 'number', value: selToken.maxHp, onChange: e => updateToken(selToken.id, { maxHp: +e.target.value || 1 }), style: { width: 80 } })
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', width: 50 } }, 'Init'),
            React.createElement('input', { type: 'number', value: selToken.init, onChange: e => updateToken(selToken.id, { init: +e.target.value || 0 }), style: { width: 80 } })
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', width: 50 } }, 'Type'),
            React.createElement('select', { value: selToken.kind, onChange: e => updateToken(selToken.id, { kind: e.target.value }) },
              TOKEN_TYPES.map(t => React.createElement('option', { key: t.kind, value: t.kind }, t.label))
            )
          ),
          React.createElement('button', { className: 'danger', style: { width: '100%', marginTop: 8 }, onClick: () => deleteToken(selToken.id) }, 'Delete Token')
        )
      ) : React.createElement('div', { className: 'empty', style: { padding: 20, border: '1px dashed var(--border-soft)', borderRadius: 8 } }, 'Click a token to edit')
    )
  );
}

window.CombatView = CombatView;
