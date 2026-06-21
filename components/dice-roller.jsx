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

    // Result big readout
    history[0] && React.createElement('div', { className: 'dice-result' + (history[0].nat20 ? ' crit' : history[0].nat1 ? ' fumble' : '') },
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
