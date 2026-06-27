// GM Turn screen — SWN faction-turn mechanics + AI brainstorm.
// Lets the GM step through faction actions, log results, and ask the AI for suggestions.

const { useState: useGMt, useMemo: useGMm } = React;

const FACTION_ACTIONS = [
  { name: 'Attack', desc: 'Pick an enemy faction asset; opposed roll of best of Cunning/Force/Wealth + 1d8. Winner inflicts damage on the loser\'s asset.' },
  { name: 'Buy Asset', desc: 'Spend FacCreds equal to the asset\'s cost; place it on a tag-appropriate planet.' },
  { name: 'Move Asset', desc: 'Move an asset to an adjacent hex; spike-drive-capable assets can jump further.' },
  { name: 'Repair Asset', desc: 'Spend a turn to repair an asset back to full HP. Cost equals asset HP missing.' },
  { name: 'Expand Influence', desc: 'Pay 1 Treasure per system; gain a foothold in a new system, allowing future asset placement there.' },
  { name: 'Sell Asset', desc: 'Recover half the asset\'s cost in FacCreds and remove it from play.' },
  { name: 'Use Asset Ability', desc: 'Trigger any special ability listed on a controlled asset.' },
  { name: 'Crash Build Asset', desc: 'Double cost, but place the asset immediately and finished this turn.' },
];

function GMTurnView({ sector, onLog, log = [], onUpdateFaction, onPickPlanet }) {
  const [aiThinking, setAiThinking] = useGMt(null);
  const [aiResult, setAiResult] = useGMt(null);
  const [actionFor, setActionFor] = useGMt(null);

  async function brainstorm(faction) {
    setAiThinking(faction.id);
    setAiResult(null);
    const factionsContext = sector.factions.map(f =>
      `- ${f.name} (HP ${f.hp}/${f.maxHp}, C:${f.cunning} F:${f.force} W:${f.wealth}, traits: ${f.traits.join('/')}, goal: ${f.goal}, HQ: ${f.hqPlanetName || 'unknown'})`
    ).join('\n');
    const recentLog = log.slice(0, 6).map(l => `- T${l.turn}: ${l.factionName} — ${l.action}: ${l.text}`).join('\n') || '(none)';
    const hooksContext = sector.hooks.filter(h => h.status !== 'Resolved').slice(0, 5).map(h => `- ${h.planetName}: ${h.text}`).join('\n') || '(none)';

    const prompt = `You are a Stars Without Number GM brainstorming the next faction-turn action for one faction in the Cradle of Embers sector — an ancient ember-lit stellar nursery where worlds still coalesce from glowing dust.

FACTION TAKING ACTION:
${faction.name}
- Traits: ${faction.traits.join(', ')}
- Goal: ${faction.goal}
- Cunning ${faction.cunning} / Force ${faction.force} / Wealth ${faction.wealth}
- HP ${faction.hp}/${faction.maxHp}
- HQ: ${faction.hqPlanetName || 'unknown'}
- Assets: ${faction.assets.map(a => a.name).join(', ')}

OTHER FACTIONS:
${factionsContext}

RECENT EVENTS:
${recentLog}

ACTIVE HOOKS:
${hooksContext}

Available SWN faction actions: ${FACTION_ACTIONS.map(a => a.name).join(', ')}.

Suggest 3 distinct, in-character actions this faction would most plausibly take this turn, each tied to their stat profile (high Cunning → indirect; high Force → military; high Wealth → economic). Lean into the ember/cradle theme.

Return JSON shaped exactly:
{
  "suggestions": [
    { "action": "Attack" or another available action name,
      "target": "what or whom",
      "rationale": "1-2 sentence GM-facing reasoning",
      "narrative": "1-2 sentence in-fiction description of what happens" }
  ]
}`;

    const result = await window.askClaudeJSON(prompt, { suggestions: [{ action: 'Use Asset Ability', target: 'Self', rationale: 'AI unavailable — defaulting to passive action.', narrative: 'The faction consolidates its position quietly.' }] });
    setAiResult({ factionId: faction.id, ...result });
    setAiThinking(null);
  }

  function logAction(faction, suggestion) {
    onLog({
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      turn: (log[0]?.turn || 0) + 1,
      factionId: faction.id,
      factionName: faction.name,
      action: suggestion.action,
      target: suggestion.target,
      text: suggestion.narrative,
      rationale: suggestion.rationale,
      timestamp: Date.now(),
    });
    setAiResult(null);
    setActionFor(null);
  }

  function manualLog(faction, action) {
    const text = prompt('Describe what ' + faction.name + ' does with "' + action.name + '":');
    if (!text) return;
    onLog({
      id: 'log-' + Date.now(),
      turn: (log[0]?.turn || 0) + 1,
      factionId: faction.id,
      factionName: faction.name,
      action: action.name,
      target: '',
      text,
      rationale: '',
      timestamp: Date.now(),
    });
    setActionFor(null);
  }

  return React.createElement('div', { className: 'split-pane', style: { display: 'grid', gridTemplateColumns: '1fr 380px', height: '100%', overflow: 'hidden' } },
    // Faction list / brainstorm pane
    React.createElement('div', { style: { overflowY: 'auto', padding: 24 } },
      React.createElement('div', { style: { marginBottom: 18 } },
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: 'var(--fg-0)', letterSpacing: '-0.01em' } }, 'GM Faction Turn'),
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } },
          'Step each faction through one action. Tap ✦ Brainstorm to ask the Oracle.')
      ),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880 } },
        sector.factions.map(f => React.createElement('div', { key: f.id, className: 'panel' },
          React.createElement('div', { className: 'panel-body' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--fg-0)' } }, f.name),
                React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 } },
                  f.traits.join(' · ') + ' · ' + (f.hqPlanetName ? 'HQ ' + f.hqPlanetName : 'no HQ')),
                React.createElement('div', { style: { fontSize: 12.5, color: 'var(--fg-1)', marginTop: 6, fontStyle: 'italic' } }, '“' + f.goal + '”'),
                React.createElement('div', { style: { display: 'flex', gap: 16, marginTop: 10, fontFamily: 'JetBrains Mono', fontSize: 11 } },
                  React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'C '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.cunning)),
                  React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'F '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.force)),
                  React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'W '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.wealth)),
                  React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'HP '), React.createElement('span', { style: { color: f.hp / f.maxHp < 0.3 ? 'var(--danger)' : 'var(--fg-0)' } }, f.hp + '/' + f.maxHp))
                )
              ),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
                React.createElement('button', {
                  className: 'primary',
                  style: { fontSize: 12, whiteSpace: 'nowrap' },
                  disabled: aiThinking === f.id,
                  onClick: () => brainstorm(f),
                }, aiThinking === f.id ? '⌛ Thinking…' : '✦ Brainstorm'),
                React.createElement('button', {
                  style: { fontSize: 12, whiteSpace: 'nowrap' },
                  onClick: () => setActionFor(actionFor === f.id ? null : f.id),
                }, '⊞ Manual Action')
              )
            ),

            // AI brainstorm result
            aiResult?.factionId === f.id && aiResult.suggestions && React.createElement('div', { style: { marginTop: 14, padding: 12, background: 'rgba(255, 148, 87, 0.06)', border: '1px solid rgba(255, 148, 87, 0.3)', borderRadius: 8 } },
              React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 8 } }, '✦ ORACLE SUGGESTIONS'),
              aiResult.suggestions.map((s, i) => React.createElement('div', { key: i, style: { padding: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-soft)', borderRadius: 6, marginBottom: 8 } },
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 4 } },
                  React.createElement('span', { className: 'tag accent' }, s.action),
                  React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)' } }, '→ ', s.target || '(no target)')
                ),
                React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-1)', marginBottom: 6 } }, '“' + s.narrative + '”'),
                React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', marginBottom: 8 } }, s.rationale),
                React.createElement('button', { style: { fontSize: 11, padding: '3px 8px' }, onClick: () => logAction(f, s) }, '+ Log This Action')
              ))
            ),

            // Manual action panel
            actionFor === f.id && React.createElement('div', { style: { marginTop: 14, padding: 12, background: 'var(--bg-1)', border: '1px solid var(--border-soft)', borderRadius: 8 } },
              React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em', marginBottom: 8 } }, 'PICK AN ACTION'),
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 } },
                FACTION_ACTIONS.map(a => React.createElement('button', {
                  key: a.name,
                  style: { fontSize: 11, justifyContent: 'flex-start', textAlign: 'left' },
                  onClick: () => manualLog(f, a),
                  title: a.desc,
                }, a.name))
              )
            )
          )
        ))
      )
    ),
    // Right: turn log
    React.createElement('div', { style: { borderLeft: '1px solid var(--border-soft)', background: 'rgba(10,5,7,0.85)', overflowY: 'auto', padding: 16 } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 } },
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--fg-0)' } }, 'Turn Log'),
        log.length > 0 && React.createElement('button', { className: 'ghost danger', style: { fontSize: 11 }, onClick: () => { if (confirm('Clear all turn log?')) onLog('__clear__'); } }, 'Clear')
      ),
      log.length === 0
        ? React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 13, padding: 12, textAlign: 'center', border: '1px dashed var(--border-soft)', borderRadius: 6 } }, 'No actions logged yet. Brainstorm or pick a manual action for a faction.')
        : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          log.map(entry => React.createElement('div', { key: entry.id, style: { padding: 10, background: 'var(--bg-2)', border: '1px solid var(--border-soft)', borderRadius: 6 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 } },
              React.createElement('span', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.08em' } }, 'TURN ' + entry.turn),
              React.createElement('span', { className: 'tag', style: { fontSize: 10 } }, entry.action)
            ),
            React.createElement('div', { style: { fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, entry.factionName),
            entry.target && React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', fontFamily: 'JetBrains Mono' } }, '→ ' + entry.target),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--fg-1)', marginTop: 4, fontStyle: 'italic' } }, '“' + entry.text + '”')
          ))
        )
    )
  );
}

window.GMTurnView = GMTurnView;
window.FACTION_ACTIONS = FACTION_ACTIONS;
