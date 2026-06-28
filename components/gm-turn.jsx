// GM Turn — faction turn order reference panel.

function GMTurnView({ sector, onLog, log = [], onUpdateFaction, onPickPlanet }) {
  return React.createElement('div', { style: { overflowY: 'auto', padding: '16px 24px' } },
    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--fg-0)', letterSpacing: '-0.01em', marginBottom: 14 } }, 'Faction Turn Order'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 880 } },
      sector.factions.map(f => React.createElement('div', { key: f.id, style: { display: 'flex', alignItems: 'baseline', gap: 16, padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 6 } },
        React.createElement('div', { style: { flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, f.name),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', fontFamily: 'JetBrains Mono' } }, (f.tags || f.traits || []).join(' · ')),
        React.createElement('div', { style: { display: 'flex', gap: 12, fontFamily: 'JetBrains Mono', fontSize: 11, flexShrink: 0 } },
          React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'C '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.cunning)),
          React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'F '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.force)),
          React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'W '), React.createElement('span', { style: { color: 'var(--fg-0)' } }, f.wealth)),
          React.createElement('span', null, React.createElement('span', { style: { color: 'var(--fg-3)' } }, 'HP '), React.createElement('span', { style: { color: f.hp / f.maxHp < 0.3 ? 'var(--danger)' : 'var(--fg-0)' } }, f.hp + '/' + f.maxHp))
        )
      ))
    )
  );
}

window.GMTurnView = GMTurnView;
