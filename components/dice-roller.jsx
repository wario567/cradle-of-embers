// Universal SWN dice roller — floating panel. d20 attacks/saves/skills, weapon damage,
// 2d6 skill checks, custom NdX. Keeps a roll history. Persists open/closed per browser.

const { useState: useDRs, useRef: useDRr, useEffect: useDRe } = React;

// Parse a dice expression like "2d6+2", "1d20", "3d4", "1d10+2". Returns {rolls, total, expr}.
function rollExpr(expr, extraMod = 0) {
  const m = String(expr).replace(/\s/g, '').match(/^(\d+)?d(\d+)([+-]\d+)?(\*|#)?$/i);
  if (!m) {
    // maybe a flat number
    const n = parseInt(expr, 10);
    if (!isNaN(n)) return { rolls: [n], total: n + extraMod, mod: extraMod, expr };
    return null;
  }
  const count = parseInt(m[1] || '1', 10);
  const sides = parseInt(m[2], 10);
  const mod = (m[3] ? parseInt(m[3], 10) : 0) + extraMod;
  const rolls = [];
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce((a, b) => a + b, 0) + mod;
  return { rolls, total, mod, sides, count, expr };
}

// ───────────────────────── 3D tumbling dice ─────────────────────────
// A CSS-3D cube per die. Front face (ember) lands on the rolled value; the
// other faces carry decoys so the tumble reads as a real die. d6 shows pips,
// everything else shows the numeral. Re-mounting (keyed by roll id) replays it.
const FACE_T = [
  'translateZ(26px)',                  // front  (the value face)
  'rotateX(90deg) translateZ(26px)',   // top
  'rotateY(90deg) translateZ(26px)',   // right
  'rotateY(-90deg) translateZ(26px)',  // left
  'rotateY(180deg) translateZ(26px)',  // back
  'rotateX(-90deg) translateZ(26px)',  // bottom
];
const FACE_NAMES = ['front', 'top', 'right', 'left', 'back', 'bottom'];

// 3×3 pip layout (cells 0-8) for standard d6 faces.
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

function makeDecoys(value, sides) {
  if (sides === 6) return [1, 2, 3, 4, 5, 6].filter(n => n !== value).sort(() => Math.random() - 0.5);
  const out = [], seen = new Set([value]);
  let g = 0;
  while (out.length < 5 && g++ < 60) {
    const n = Math.floor(Math.random() * sides) + 1;
    if (!seen.has(n)) { seen.add(n); out.push(n); }
  }
  while (out.length < 5) out.push(Math.floor(Math.random() * sides) + 1);
  return out;
}

function faceContent(isD6, n) {
  if (isD6) {
    const lit = PIPS[n] || [];
    return React.createElement('div', { className: 'die-pips' },
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(c =>
        React.createElement('span', { key: c, className: 'die-pip' }, lit.includes(c) ? React.createElement('i') : null)));
  }
  const digits = String(n).length;
  const fs = digits >= 3 ? 17 : digits === 2 ? 23 : 29;
  return React.createElement('span', { className: 'die-num', style: { fontSize: fs } }, n);
}

// The d6 is a real 3D CSS cube (6 faces, pips).
function Die3D({ value, delay }) {
  const nums = [value].concat(makeDecoys(value, 6)); // [front, top, right, left, back, bottom]
  return React.createElement('div', { className: 'die-wrap' },
    React.createElement('div', { className: 'die3d', style: { animationDelay: (delay || 0) + 'ms' } },
      FACE_T.map((t, i) => React.createElement('div', {
        key: i, className: 'die-face die-face--' + FACE_NAMES[i] + (i === 0 ? ' die-face--main' : ''), style: { transform: t },
      }, faceContent(true, nums[i])))),
    React.createElement('div', { className: 'die-shadow', style: { animationDelay: (delay || 0) + 'ms' } })
  );
}

// ── Polyhedral dice (d4/d8/d10/d12/d20 …) drawn as their real faceted shapes ──
// Each die is an SVG silhouette of the correct polyhedron: dark back-facets give
// depth, the ember "main" facet carries the rolled value. Coordinates in a
// 100×100 box. This is how dice are conventionally illustrated, so a d20 reads
// as a 20-sided icosahedron rather than a cube.
const SHADE = { a: '#2c1d15', b: '#231711', c: '#1a110b', d: '#34201610' };
const DIE_GEO = {
  4: {
    faces: [
      { pts: '50,6 8,86 50,60', fill: '#2c1d15' },
      { pts: '50,6 50,60 92,86', fill: '#1a110b' },
    ],
    main: '8,86 92,86 50,60', outline: '50,6 92,86 8,86',
    vx: 50, vy: 78, fs: 22,
  },
  8: {
    faces: [
      { pts: '50,3 11,50 50,50', fill: '#2c1d15' },
      { pts: '50,3 50,50 89,50', fill: '#1a110b' },
    ],
    main: '11,50 89,50 50,97', outline: '50,3 89,50 50,97 11,50',
    vx: 50, vy: 66, fs: 26,
  },
  10: {
    faces: [
      { pts: '50,3 14,38 30,50 50,20', fill: '#2c1d15' },
      { pts: '50,3 50,20 70,50 86,38', fill: '#231711' },
      { pts: '86,38 78,72 70,50', fill: '#1a110b' },
      { pts: '78,72 50,97 50,78 70,50', fill: '#2c1d15' },
      { pts: '50,97 22,72 30,50 50,78', fill: '#231711' },
      { pts: '22,72 14,38 30,50', fill: '#1a110b' },
    ],
    main: '50,20 70,50 50,78 30,50', outline: '50,3 86,38 78,72 50,97 22,72 14,38',
    vx: 50, vy: 50, fs: 24,
  },
  12: {
    faces: [
      { pts: '50,2 95.6,35.2 70.9,43.2 50,28', fill: '#231711' },
      { pts: '95.6,35.2 78.2,88.8 62.9,67.8 70.9,43.2', fill: '#1a110b' },
      { pts: '78.2,88.8 21.8,88.8 37.1,67.8 62.9,67.8', fill: '#2c1d15' },
      { pts: '21.8,88.8 4.4,35.2 29.1,43.2 37.1,67.8', fill: '#231711' },
      { pts: '4.4,35.2 50,2 50,28 29.1,43.2', fill: '#1a110b' },
    ],
    main: '50,28 70.9,43.2 62.9,67.8 37.1,67.8 29.1,43.2', outline: '50,2 95.6,35.2 78.2,88.8 21.8,88.8 4.4,35.2',
    vx: 50, vy: 50, fs: 24,
  },
  20: {
    faces: [
      { pts: '50,30 8.4,26 50,2', fill: '#2c1d15' },
      { pts: '50,30 50,2 91.6,26', fill: '#231711' },
      { pts: '50,30 91.6,26 72,66', fill: '#1a110b' },
      { pts: '72,66 91.6,26 91.6,74', fill: '#231711' },
      { pts: '72,66 91.6,74 50,98', fill: '#2c1d15' },
      { pts: '28,66 50,98 8.4,74', fill: '#231711' },
      { pts: '28,66 8.4,74 8.4,26', fill: '#1a110b' },
      { pts: '28,66 8.4,26 50,30', fill: '#2c1d15' },
    ],
    main: '50,30 72,66 28,66', outline: '50,2 91.6,26 91.6,74 50,98 8.4,74 8.4,26',
    vx: 50, vy: 56, fs: 22,
  },
  generic: {
    faces: [], main: '50,4 91,27 91,73 50,96 9,73 9,27', outline: '50,4 91,27 91,73 50,96 9,73 9,27',
    vx: 50, vy: 50, fs: 22,
  },
};

function DieShape({ value, sides, delay }) {
  const geo = DIE_GEO[sides] || DIE_GEO.generic;
  const fs = String(value).length >= 2 ? geo.fs - 4 : geo.fs;
  const gid = 'dg' + sides;
  return React.createElement('div', { className: 'die-wrap' },
    React.createElement('svg', { className: 'die-shape', viewBox: '0 0 100 100', style: { animationDelay: (delay || 0) + 'ms' } },
      React.createElement('defs', null,
        React.createElement('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0.25', y2: '1' },
          React.createElement('stop', { offset: '0', stopColor: '#ffc792' }),
          React.createElement('stop', { offset: '1', stopColor: '#d65a2c' }))),
      geo.faces.map((f, i) => React.createElement('polygon', { key: i, points: f.pts, fill: f.fill, stroke: '#ffcb9a', strokeOpacity: 0.13, strokeWidth: 0.8, strokeLinejoin: 'round' })),
      React.createElement('polygon', { points: geo.main, fill: 'url(#' + gid + ')', stroke: '#ffe0c0', strokeWidth: 1, strokeLinejoin: 'round' }),
      React.createElement('polygon', { points: geo.outline, fill: 'none', stroke: '#ffcb9a', strokeOpacity: 0.55, strokeWidth: 1.4, strokeLinejoin: 'round' }),
      React.createElement('text', { x: geo.vx, y: geo.vy, fill: '#1a0d07', textAnchor: 'middle', dominantBaseline: 'central', style: { fontSize: fs, fontWeight: 800, fontFamily: 'var(--font-mono, ui-monospace, monospace)' } }, value)),
    React.createElement('div', { className: 'die-shadow', style: { animationDelay: (delay || 0) + 'ms' } })
  );
}

function OneDie({ value, sides, delay }) {
  return sides === 6
    ? React.createElement(Die3D, { value, delay })
    : React.createElement(DieShape, { value, sides, delay });
}

// CSS fallback stage (reduced-motion / no-WebGL)
function DiceStageCSS({ entry }) {
  const rolls = entry.rolls || [];
  const shown = rolls.slice(0, 6);
  const extra = rolls.length - shown.length;
  return React.createElement('div', { className: 'dice-stage' },
    shown.map((v, i) => React.createElement(OneDie, { key: i, value: v, sides: entry.sides, delay: i * 70 })),
    extra > 0 ? React.createElement('div', { className: 'die-overflow' }, '+' + extra + ' more') : null
  );
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const can3D = typeof window !== 'undefined' && window.DiceBox && window.DiceBox.supported() && !prefersReduced;

// Real 3D physics dice (Three.js). Persistent renderer; each new roll re-tumbles.
function Dice3DStage({ entry }) {
  const hostRef = useDRr(null);
  const boxRef = useDRr(null);
  useDRe(() => {
    if (!hostRef.current) return;
    boxRef.current = window.DiceBox.create(hostRef.current);
    return () => { if (boxRef.current) { boxRef.current.dispose(); boxRef.current = null; } };
  }, []);
  useDRe(() => {
    if (boxRef.current && entry && entry.sides) boxRef.current.roll({ sides: entry.sides, values: entry.rolls });
  }, [entry && entry.id]);
  const extra = (entry.rolls || []).length - 6;
  return React.createElement('div', { className: 'dice-stage dice-stage--3d' },
    React.createElement('div', { className: 'dice-canvas-host', ref: hostRef }),
    extra > 0 ? React.createElement('div', { className: 'die-overflow die-overflow--abs' }, '+' + extra + ' more') : null
  );
}

function DiceStage({ entry }) {
  return can3D
    ? React.createElement(Dice3DStage, { entry })
    : React.createElement(DiceStageCSS, { entry });
}

function DiceRoller({ open, setOpen }) {
  const [history, setHistory] = useDRs([]);
  const [custom, setCustom] = useDRs('1d20');
  const [mod, setMod] = useDRs(0);
  const [lastFlash, setLastFlash] = useDRs(null);

  function doRoll(expr, label, extraMod = 0) {
    const r = rollExpr(expr, extraMod);
    if (!r) return;
    const entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      label: label || expr,
      expr,
      rolls: r.rolls,
      mod: r.mod,
      total: r.total,
      sides: r.sides,
      nat20: r.sides === 20 && r.rolls.length === 1 && r.rolls[0] === 20,
      nat1: r.sides === 20 && r.rolls.length === 1 && r.rolls[0] === 1,
      at: Date.now(),
    };
    setHistory(h => [entry, ...h].slice(0, 40));
    setLastFlash(entry.id);
    setTimeout(() => setLastFlash(null), 600);
  }

  // External rolls — character sheets, NPC blocks, etc. dispatch `swn-roll`
  // CustomEvents with { expr, label, mod }. Opens the panel and rolls.
  useDRe(() => {
    function onExternalRoll(e) {
      const d = e.detail || {};
      if (!d.expr) return;
      setOpen(true);
      doRoll(d.expr, d.label || d.expr, d.mod || 0);
    }
    window.addEventListener('swn-roll', onExternalRoll);
    return () => window.removeEventListener('swn-roll', onExternalRoll);
  }, []);

  const QUICK = [
    { label: 'd20', expr: '1d20' },
    { label: 'Skill 2d6', expr: '2d6' },
    { label: 'd4', expr: '1d4' },
    { label: 'd6', expr: '1d6' },
    { label: 'd8', expr: '1d8' },
    { label: 'd10', expr: '1d10' },
    { label: 'd12', expr: '1d12' },
    { label: 'd100', expr: '1d100' },
  ];

  if (!open) {
    return React.createElement('button', {
      className: 'dice-fab',
      title: 'Dice roller',
      onClick: () => setOpen(true),
    }, '⚂');
  }

  return React.createElement('div', { className: 'dice-panel' },
    React.createElement('div', { className: 'dice-head' },
      React.createElement('span', { className: 'dice-title' }, '⚂ Dice'),
      React.createElement('button', { className: 'ghost', style: { fontSize: 13, padding: '2px 6px' }, onClick: () => setOpen(false) }, '✕')
    ),

    // Quick dice
    React.createElement('div', { className: 'dice-grid' },
      QUICK.map(q => React.createElement('button', {
        key: q.label, className: 'dice-btn',
        onClick: () => doRoll(q.expr, q.label, q.expr === '1d20' ? +mod : 0),
      }, q.label))
    ),

    // d20 + modifier row (attacks/saves/skills)
    React.createElement('div', { className: 'dice-mod-row' },
      React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'd20 +'),
      React.createElement('input', {
        type: 'number', value: mod, onChange: e => setMod(parseInt(e.target.value, 10) || 0),
        style: { width: 56 },
      }),
      React.createElement('button', { className: 'dice-btn primary', style: { flex: 1 }, onClick: () => doRoll('1d20', 'd20+' + mod, +mod) }, 'Roll d20+' + (mod >= 0 ? mod : mod))
    ),

    // Custom expression
    React.createElement('div', { className: 'dice-mod-row' },
      React.createElement('input', {
        value: custom, onChange: e => setCustom(e.target.value),
        onKeyDown: e => { if (e.key === 'Enter') doRoll(custom, custom); },
        placeholder: 'e.g. 2d6+2', style: { flex: 1, fontFamily: 'var(--font-mono)' },
      }),
      React.createElement('button', { className: 'dice-btn', onClick: () => doRoll(custom, custom) }, 'Roll')
    ),

    // 3D physics dice (Three.js); stage persists across rolls so the effect re-tumbles
    history[0] && history[0].sides ? React.createElement(DiceStage, { key: 'dice-stage', entry: history[0] }) : null,
    history[0] && React.createElement('div', { key: 'res-' + history[0].id, className: 'dice-result' + (history[0].nat20 ? ' crit' : history[0].nat1 ? ' fumble' : '') },
      React.createElement('div', { className: 'dice-result-total' }, history[0].total),
      React.createElement('div', { className: 'dice-result-detail' },
        history[0].label + ' · [' + history[0].rolls.join(', ') + ']' + (history[0].mod ? (history[0].mod > 0 ? ' +' + history[0].mod : ' ' + history[0].mod) : ''),
        history[0].nat20 ? ' · NAT 20!' : history[0].nat1 ? ' · NAT 1' : ''
      )
    ),

    // History
    React.createElement('div', { className: 'dice-history' },
      history.slice(1, 12).map(h => React.createElement('div', { key: h.id, className: 'dice-hist-row' + (lastFlash === h.id ? ' flash' : '') },
        React.createElement('span', { className: 'dice-hist-label' }, h.label),
        React.createElement('span', { className: 'dice-hist-rolls' }, '[' + h.rolls.join(',') + ']' + (h.mod ? (h.mod > 0 ? '+' + h.mod : h.mod) : '')),
        React.createElement('span', { className: 'dice-hist-total' + (h.nat20 ? ' crit' : h.nat1 ? ' fumble' : '') }, h.total)
      ))
    )
  );
}

window.DiceRoller = DiceRoller;
window.rollExpr = rollExpr;
// Convenience: fire a roll into the dice panel from anywhere (sheets, NPC blocks).
window.rollDice = function (expr, label, mod) {
  window.dispatchEvent(new CustomEvent('swn-roll', { detail: { expr, label, mod: mod || 0 } }));
};
