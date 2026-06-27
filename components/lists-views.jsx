// Factions, NPCs, Timeline, Hooks — list+detail panels in similar style.

const { useState: useStateLP } = React;

// ---------------- FACTIONS ----------------
function FactionsView({ sector, onUpdate, onPickPlanet }) {
  const [selId, setSelId] = useStateLP(sector.factions[0]?.id || null);
  const sel = sector.factions.find(f => f.id === selId) || sector.factions[0];

  function updateSel(patch) {
    onUpdate({ ...sel, ...patch });
  }

  return React.createElement('div', { className: 'split-pane', style: { display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%', overflow: 'hidden' } },
    // List
    React.createElement('div', { style: { borderRight: '1px solid var(--border-soft)', overflowY: 'auto', padding: 16, background: 'rgba(13,17,23,0.6)' } },
      React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 10 } }, `${sector.factions.length} Factions`),
      React.createElement('div', { className: 'list' },
        sector.factions.map(f => React.createElement('div', {
          key: f.id,
          className: 'list-item' + (f.id === sel?.id ? ' active' : ''),
          onClick: () => setSelId(f.id),
        },
          React.createElement('div', { className: 'title' }, f.name),
          React.createElement('div', { className: 'meta' }, (f.tags || f.traits || []).join(' · ')),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 } },
            React.createElement('div', { className: 'hp-bar' + (f.hp / f.maxHp < 0.3 ? ' crit' : f.hp / f.maxHp < 0.6 ? ' low' : ''), style: { flex: 1 } },
              React.createElement('div', { style: { width: `${(f.hp / f.maxHp) * 100}%` } })
            ),
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' } }, `${f.hp}/${f.maxHp}`)
          )
        ))
      )
    ),
    // Detail
    sel ? React.createElement('div', { style: { overflowY: 'auto', padding: 24 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 } },
        React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 28, color: 'var(--fg-0)' } }, sel.name),
        sel.hqPlanetName && React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } },
          'HQ: ', React.createElement('span', { style: { color: 'var(--accent)', cursor: 'pointer' }, onClick: () => {
            const p = sector.systems.flatMap(s => s.planets).find(p => p.id === sel.hqPlanetId);
            if (p) onPickPlanet(p);
          } }, sel.hqPlanetName))
      ),
      React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 } },
        (sel.tags || sel.traits || []).map(t => React.createElement('span', { key: t, className: 'tag accent' }, t))
      ),

      // Stats grid
      React.createElement('div', { className: 'grid-3', style: { marginBottom: 18 } },
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Combat HP'),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8 } },
              React.createElement('span', { style: { fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 600, color: 'var(--fg-0)' } }, sel.hp),
              React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '/ ' + sel.maxHp)
            ),
            React.createElement('div', { className: 'hp-bar' + (sel.hp / sel.maxHp < 0.3 ? ' crit' : sel.hp / sel.maxHp < 0.6 ? ' low' : ''), style: { marginTop: 8 } },
              React.createElement('div', { style: { width: `${(sel.hp / sel.maxHp) * 100}%` } })),
            React.createElement('div', { style: { marginTop: 8, display: 'flex', gap: 4 } },
              React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => updateSel({ hp: Math.max(0, sel.hp - 1) }) }, '−1'),
              React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => updateSel({ hp: Math.min(sel.maxHp, sel.hp + 1) }) }, '+1')
            )
          )
        ),
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Attributes'),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } },
              ['cunning', 'force', 'wealth'].map(a => React.createElement('div', { key: a, style: { textAlign: 'center', flex: 1 } },
                React.createElement('div', { style: { fontSize: 10, textTransform: 'uppercase', color: 'var(--fg-3)', letterSpacing: '0.08em' } }, a),
                React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600, color: 'var(--fg-0)' } }, sel[a])
              ))
            )
          )
        ),
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Long-Term Goal'),
          React.createElement('div', { className: 'panel-body', style: { fontSize: 13 } }, sel.goal)
        )
      ),

      // Assets
      React.createElement('div', { className: 'panel', style: { marginBottom: 18 } },
        React.createElement('div', { className: 'panel-title' }, `Assets (${sel.assets.length})`),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
            sel.assets.map((a, i) => React.createElement('div', { key: i, className: 'asset-pill' },
              a.name,
              React.createElement('span', { style: { color: 'var(--fg-3)' } }, `· ${a.cost}cr · HP ${a.hp}`)
            ))
          )
        )
      ),
      // Notes
      React.createElement('div', { className: 'panel' },
        React.createElement('div', { className: 'panel-title' }, 'GM Notes'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('textarea', {
            value: sel.notes || '',
            placeholder: 'Schemes in motion, alliances, what the players know…',
            onChange: e => updateSel({ notes: e.target.value }),
            rows: 5,
          })
        )
      )
    ) : null
  );
}

// ---------------- NPCs ----------------
function NPCsView({ sector, onUpdate, onAddNPC, onDeleteNPC, onPickPlanet }) {
  const [selId, setSelId] = useStateLP(sector.npcs[0]?.id || null);
  const sel = sector.npcs.find(n => n.id === selId);
  const TT = window.Tooltip;
  const E = window.SWN.explanations;

  function update(patch) {
    if (sel) onUpdate({ ...sel, ...patch });
  }
  function updateAttr(key, value) {
    update({ attrs: { ...sel.attrs, [key]: +value || 0 } });
  }
  function rollAttrs() {
    const r = () => Math.floor(Math.random() * 6) + 1;
    const attrs = {};
    ['STR','DEX','CON','INT','WIS','CHA'].forEach(k => attrs[k] = r() + r() + r());
    update({ attrs });
  }

  function attrModLocal(a) {
    if (a <= 3) return -2;
    if (a <= 7) return -1;
    if (a <= 13) return 0;
    if (a <= 17) return 1;
    return 2;
  }

  return React.createElement('div', { className: 'split-pane', style: { display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%', overflow: 'hidden' } },
    React.createElement('div', { style: { borderRight: '1px solid var(--border-soft)', overflowY: 'auto', padding: 16, background: 'rgba(10,5,7,0.6)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 } },
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase' } }, `${sector.npcs.length} NPCs`),
        React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => { const n = onAddNPC(); setSelId(n.id); } }, '+ NEW')
      ),
      React.createElement('div', { className: 'list' },
        sector.npcs.map(n => React.createElement('div', {
          key: n.id,
          className: 'list-item' + (n.id === sel?.id ? ' active' : ''),
          onClick: () => setSelId(n.id),
        },
          React.createElement('div', { className: 'title' }, n.name),
          React.createElement('div', { className: 'meta' }, `${n.role} · L${n.level || '?'} · ${n.locationName || '—'}`)
        ))
      )
    ),
    sel ? React.createElement('div', { style: { overflowY: 'auto', padding: 24 } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 } },
        React.createElement('div', null,
          React.createElement('input', { value: sel.name, onChange: e => update({ name: e.target.value }), style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--fg-0)', background: 'transparent', border: 'none', padding: 0 } }),
          React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 } },
            sel.role + ' · L' + (sel.level || 1) + ' · ', sel.locationName ? React.createElement('span', { style: { color: 'var(--accent)', cursor: 'pointer' }, onClick: () => {
              const p = sector.systems.flatMap(s => s.planets).find(p => p.id === sel.locationId);
              if (p) onPickPlanet(p);
            } }, sel.locationName) : '—'
          )
        ),
        React.createElement('button', { className: 'danger', style: { fontSize: 11 }, onClick: () => { onDeleteNPC(sel.id); setSelId(sector.npcs[0]?.id); } }, 'Delete')
      ),

      // Personality
      React.createElement('div', { className: 'grid-2', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Trait'),
          React.createElement('div', { className: 'panel-body', style: { fontSize: 13 } },
            React.createElement('textarea', { value: sel.trait, onChange: e => update({ trait: e.target.value }), rows: 2, style: { background: 'transparent', border: 'none', padding: 0, fontSize: 13 } })
          )
        ),
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Goal'),
          React.createElement('div', { className: 'panel-body', style: { fontSize: 13 } },
            React.createElement('textarea', { value: sel.goal, onChange: e => update({ goal: e.target.value }), rows: 2, style: { background: 'transparent', border: 'none', padding: 0, fontSize: 13 } })
          )
        )
      ),

      // Attributes — full SWN
      sel.attrs && React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Attributes',
          React.createElement('button', { className: 'ghost', style: { marginLeft: 'auto', fontSize: 11 }, onClick: rollAttrs }, '⚂ Reroll 3d6')
        ),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(76px, 1fr))', gap: 10 } },
            ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(k => React.createElement('div', { key: k, style: { textAlign: 'center' } },
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null,
                  React.createElement('strong', null, k),
                  React.createElement('div', { style: { marginTop: 4 } }, E[k])
                ) }, k) : k
              ),
              React.createElement('input', { type: 'number', value: sel.attrs[k], onChange: e => updateAttr(k, e.target.value),
                style: { textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 600, padding: '4px 0', background: 'var(--bg-1)' } }),
              React.createElement('div', { style: { fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--fg-3)' } }, 'mod ' + (attrModLocal(sel.attrs[k]) >= 0 ? '+' : '') + attrModLocal(sel.attrs[k]))
            ))
          )
        )
      ),

      // Combat
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Combat'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'HP'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                React.createElement('input', { type: 'number', value: sel.hp, onChange: e => update({ hp: +e.target.value || 0 }), style: { width: 60 } }),
                React.createElement('span', { style: { color: 'var(--fg-3)' } }, '/'),
                React.createElement('input', { type: 'number', value: sel.maxHp || sel.hp, onChange: e => update({ maxHp: +e.target.value || 0 }), style: { width: 60 } })
              )
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Armor Class'), React.createElement('div', { style: { marginTop: 4 } }, E.ac)) }, 'AC') : 'AC'
              ),
              React.createElement('input', { type: 'number', value: sel.ac ?? 10, onChange: e => update({ ac: +e.target.value || 10 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Attack Bonus'), React.createElement('div', { style: { marginTop: 4 } }, E.ab)) }, 'AB') : 'AB'
              ),
              React.createElement('input', { type: 'number', value: sel.ab ?? 0, onChange: e => update({ ab: +e.target.value || 0 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Morale'), React.createElement('div', { style: { marginTop: 4 } }, E.morale)) }, 'Morale') : 'Morale'
              ),
              React.createElement('input', { type: 'number', value: sel.morale ?? 8, onChange: e => update({ morale: +e.target.value || 8 }) })
            )
          ),
          // Saves
          sel.saves && React.createElement('div', { style: { marginTop: 12 } },
            React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 4 } },
              TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Saving Throws'), React.createElement('div', { style: { marginTop: 4 } }, E.saves)) }, 'Saves') : 'Saves'
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10 } },
              ['physical', 'evasion', 'mental'].map(s => React.createElement('div', { key: s },
                React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, s),
                React.createElement('input', { type: 'number', value: sel.saves[s], onChange: e => update({ saves: { ...sel.saves, [s]: +e.target.value || 15 } }) })
              ))
            )
          )
        )
      ),

      // Skills + Gear
      React.createElement('div', { className: 'grid-2', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Skills'),
          React.createElement('div', { className: 'panel-body' },
            sel.skills?.length > 0 ? sel.skills.map((sk, i) => React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < sel.skills.length - 1 ? '1px solid var(--border-soft)' : 'none' } },
              React.createElement('span', null, sk.name),
              React.createElement('span', { style: { fontFamily: 'JetBrains Mono', color: 'var(--fg-3)' } }, '+' + sk.level)
            )) : React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 12 } }, 'No skills set.')
          )
        ),
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Gear'),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('textarea', { value: (sel.gear || []).join('\n'), onChange: e => update({ gear: e.target.value.split('\n').filter(Boolean) }), rows: 4, placeholder: 'One item per line' })
          )
        )
      ),

      React.createElement('div', { className: 'panel' },
        React.createElement('div', { className: 'panel-title' }, 'GM Notes'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('textarea', { value: sel.notes || '', onChange: e => update({ notes: e.target.value }), rows: 5, placeholder: 'Relationships, secrets, last seen…' })
        )
      )
    ) : React.createElement('div', { className: 'empty' }, 'Select an NPC')
  );
}

// ---------------- TIMELINE ----------------
function TimelineView({ sector, onUpdate, onAdd }) {
  return React.createElement('div', { style: { padding: 32, height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 600, color: 'var(--fg-0)' } }, 'Sector Timeline'),
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } }, sector.timeline.length + ' recorded events')
      ),
      React.createElement('button', { onClick: onAdd }, '+ Add Event')
    ),
    React.createElement('div', { style: { position: 'relative', paddingLeft: 32 } },
      React.createElement('div', { style: { position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, var(--accent), transparent)' } }),
      sector.timeline.map((e, i) => React.createElement('div', { key: e.id, style: { position: 'relative', marginBottom: 20 } },
        React.createElement('div', { style: { position: 'absolute', left: -32, top: 6, width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-0)', border: '2px solid var(--accent)' } }),
        React.createElement('div', { className: 'panel', style: { maxWidth: 720 } },
          React.createElement('div', { className: 'panel-body' },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 } },
              React.createElement('input', {
                value: e.year,
                onChange: ev => onUpdate({ ...e, year: ev.target.value }),
                style: { width: 80, fontFamily: 'JetBrains Mono', fontSize: 14, color: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 },
              }),
              React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' } }, 'CE')
            ),
            React.createElement('textarea', {
              value: e.text,
              onChange: ev => onUpdate({ ...e, text: ev.target.value }),
              rows: 2,
              style: { background: 'transparent', border: 'none', padding: 0, color: 'var(--fg-1)', fontSize: 14 },
            })
          )
        )
      ))
    )
  );
}

// ---------------- HOOKS ----------------
function HooksView({ sector, onUpdate, onAdd, onPickPlanet }) {
  return React.createElement('div', { style: { padding: 32, height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 600, color: 'var(--fg-0)' } }, 'Adventure Hooks'),
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } }, sector.hooks.length + ' loose threads')
      ),
      React.createElement('button', { onClick: onAdd }, '+ Generate Hook')
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 16 } },
      sector.hooks.map(h => React.createElement('div', { key: h.id, className: 'panel' },
        React.createElement('div', { className: 'panel-title' },
          React.createElement('span', { style: { cursor: 'pointer', color: 'var(--accent)' }, onClick: () => {
            const p = sector.systems.flatMap(s => s.planets).find(p => p.id === h.planetId);
            if (p) onPickPlanet(p);
          } }, h.planetName),
          React.createElement('span', { style: { marginLeft: 'auto' } },
            React.createElement('select', {
              value: h.status,
              onChange: e => onUpdate({ ...h, status: e.target.value }),
              style: { width: 'auto', padding: '2px 6px', fontSize: 11, fontFamily: 'JetBrains Mono' },
            },
              React.createElement('option', null, 'Open'),
              React.createElement('option', null, 'In Progress'),
              React.createElement('option', null, 'Resolved'),
              React.createElement('option', null, 'Abandoned')
            )
          )
        ),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('textarea', {
            value: h.text,
            onChange: e => onUpdate({ ...h, text: e.target.value }),
            rows: 4,
            style: { background: 'transparent', border: 'none', padding: 0, fontSize: 13, color: 'var(--fg-1)' },
          })
        )
      ))
    )
  );
}

// ---------------- ROUTES ----------------
function RoutesView({ sector, onPickPlanet }) {
  const routeWithDetail = sector.routes.map(r => {
    const a = sector.systems.find(s => s.hexId === r.fromHex);
    const b = sector.systems.find(s => s.hexId === r.toHex);
    return { ...r, sysA: a, sysB: b };
  }).sort((x, y) => x.distance - y.distance);

  return React.createElement('div', { style: { padding: 32, height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { marginBottom: 18 } },
      React.createElement('div', { style: { fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 600, color: 'var(--fg-0)' } }, 'Trade Routes'),
      React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } },
        sector.routes.length + ' active routes · spike drive distance in hexes')
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 720 } },
      routeWithDetail.map(r => React.createElement('div', { key: r.id, className: 'panel', style: { padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 } },
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }, onClick: () => onPickPlanet(r.sysA.planets[0]) }, r.sysA.planets[0]?.name || r.fromHex),
        React.createElement('div', { style: { flex: 1, height: 2, background: r.traffic === 'Heavy' ? 'var(--accent)' : 'rgba(88,166,255,0.3)', position: 'relative' } },
          React.createElement('div', { style: { position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--fg-3)', fontFamily: 'JetBrains Mono' } },
            r.distance + ' hex · ' + r.traffic)),
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }, onClick: () => onPickPlanet(r.sysB.planets[0]) }, r.sysB.planets[0]?.name || r.toHex)
      ))
    )
  );
}

window.FactionsView = FactionsView;
window.NPCsView = NPCsView;
window.TimelineView = TimelineView;
window.HooksView = HooksView;
window.RoutesView = RoutesView;
