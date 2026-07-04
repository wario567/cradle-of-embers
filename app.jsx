// Main app — sidebar nav, view router, sector state.

const { useState: useASt, useEffect: useAEf, useMemo: useAMem, useRef: useAR } = React;

// ── GM NOTES VIEW ────────────────────────────────────────────────────────────
function GMNotesView({ sector }) {
  const lore = window.GM_LORE;
  const [tab, setGMTab] = useASt('sector');
  const [expandedFaction, setExpandedFaction] = useASt(null);
  const [expandedTurn, setExpandedTurn] = useASt(null);
  const [npcSearch, setNpcSearch] = useASt('');
  const [npcFaction, setNpcFaction] = useASt('all');
  const [expandedNPC, setExpandedNPC] = useASt(null);

  if (!lore) return React.createElement('div', { style: { padding: 24, color: 'var(--fg-3)' } }, 'GM_LORE not loaded.');

  const tabStyle = active => ({
    padding: '6px 14px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    background: active ? 'var(--accent)' : 'var(--bg-3)',
    color: active ? '#1a0d08' : 'var(--fg-2)',
    border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border-1)'),
    borderRadius: 3, cursor: 'pointer', fontWeight: active ? 700 : 400,
  });

  const card = (children, extra) => React.createElement('div', {
    style: { background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 6, padding: '14px 16px', marginBottom: 10, ...extra }
  }, children);

  const label = txt => React.createElement('div', { style: { fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 } }, txt);
  const prose = txt => React.createElement('p', { style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65, margin: '6px 0 0', whiteSpace: 'pre-wrap' } }, txt);
  const bullet = txt => React.createElement('li', { style: { fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 2 } }, txt);

  // Rich text: parse [[NPC:Name]], [[FACTION:Name]], [[WORLD:Name]] into clickable nav links
  const parseRichText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[\[(?:NPC|FACTION|WORLD):[^\]]+\]\])/g);
    return parts.map((part, i) => {
      const m = part.match(/^\[\[(NPC|FACTION|WORLD):([^\]]+)\]\]$/);
      if (m) {
        const tabMap = { NPC: 'npcs', FACTION: 'factions', WORLD: 'worlds' };
        const targetTab = tabMap[m[1]];
        return React.createElement('span', {
          key: i,
          onClick: () => {
            setGMTab(targetTab);
            if (m[1] === 'NPC') setNpcSearch(m[2]);
          },
          title: 'Go to ' + m[1].toLowerCase() + ': ' + m[2],
          style: { color: 'var(--accent)', cursor: 'pointer', borderBottom: '1px dashed var(--accent)', paddingBottom: 1 }
        }, m[2]);
      }
      return part;
    });
  };
  const richProse = (txt) => React.createElement('p', {
    style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65, margin: '6px 0 0', whiteSpace: 'pre-wrap' }
  }, parseRichText(txt));

  // Render a beat sub-section with type-aware styling
  const beatSection = (sec, si) => {
    const isReadAloud = sec.type === 'read-aloud';
    const isDialogue  = sec.type === 'dialogue';
    const isGM       = sec.type === 'gm';
    return React.createElement('div', { key: si, style: { marginTop: 12 } },
      sec.label && React.createElement('div', {
        style: {
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
          color: isReadAloud ? '#c8a96e' : isDialogue ? 'var(--fg-3)' : 'var(--fg-4)',
        }
      }, sec.label),
      React.createElement('p', {
        style: {
          fontSize: 13, lineHeight: 1.68, margin: 0, whiteSpace: 'pre-wrap',
          color: isReadAloud ? 'var(--fg-1)' : isDialogue ? 'var(--fg-1)' : 'var(--fg-2)',
          fontStyle: isReadAloud ? 'italic' : 'normal',
          background: isReadAloud ? 'rgba(200,169,110,0.07)' : isDialogue ? 'var(--bg-1)' : 'transparent',
          borderLeft: isReadAloud ? '2px solid #c8a96e' : isDialogue ? '2px solid var(--fg-4)' : 'none',
          padding: (isReadAloud || isDialogue) ? '8px 12px' : '0',
          borderRadius: (isReadAloud || isDialogue) ? '0 4px 4px 0' : '0',
        }
      }, parseRichText(sec.text))
    );
  };

  // SECTOR TAB
  const sectorTab = React.createElement('div', null,
    card([
      React.createElement('h3', { style: { margin: '0 0 6px', color: 'var(--fg-0)', fontSize: 15 } }, lore.sector.name),
      label('Overview'), prose(lore.sector.overview),
      label('Theme'), prose(lore.sector.theme),
    ]),
    card([
      label('Science: Stellar Nursery / Cradle'), prose(lore.sector.scienceTerm),
    ]),
    card([
      label('Ignition Front'), prose(lore.sector.ignitionFrontNote),
    ]),
  );

  // FACTIONS TAB
  const factionsTab = React.createElement('div', null,
    lore.factions.map(f => {
      const open = expandedFaction === f.id;
      const loreFac = sector.factions.find(sf => sf.loreId === f.id);
      return React.createElement('div', { key: f.id, style: { marginBottom: 8 } },
        React.createElement('div', {
          onClick: () => setExpandedFaction(open ? null : f.id),
          style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid ' + (open ? 'var(--accent)' : 'var(--border-1)'), borderRadius: open ? '6px 6px 0 0' : 6, cursor: 'pointer' },
        },
          React.createElement('span', { style: { flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, f.name),
          f.swnTags && React.createElement('span', { style: { fontSize: 10, color: 'var(--accent)', letterSpacing: '0.06em' } }, f.swnTags.join(' · ')),
          f.stats && React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 } },
            `C${f.stats.cunning} F${f.stats.force} W${f.stats.wealth} HP${loreFac ? loreFac.hp : f.stats.hp}`),
          React.createElement('span', { style: { color: 'var(--fg-4)', fontSize: 12 } }, open ? '▲' : '▼'),
        ),
        open && React.createElement('div', { style: { background: 'var(--bg-1)', border: '1px solid var(--accent)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '14px 16px' } },
          label('Tagline'), prose(f.tagline),
          f.symbol && React.createElement('div', { style: { marginTop: 12, marginBottom: 4, background: 'var(--bg-3)', border: '1px solid var(--border-0)', borderLeft: '3px solid var(--accent)', borderRadius: 4, padding: '10px 14px' } },
            React.createElement('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 6 } },
              label('Faction Symbol'),
              React.createElement('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' } }, f.symbol.name),
            ),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.65, marginBottom: 6 } }, f.symbol.look),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', fontStyle: 'italic' } }, 'Worn/displayed: ' + f.symbol.where),
          ),
          label('Name Origin'), prose(f.nameOrigin),
          label('Science Term'), prose(f.scienceTerm),
          label('GM Notes'), prose(f.gmNotes),
          f.secrets && f.secrets.length && React.createElement('div', { style: { marginTop: 10 } },
            label('Secrets'),
            React.createElement('ul', { style: { margin: '4px 0 0', paddingLeft: 18 } }, f.secrets.map((s, i) => bullet(s))),
          ),
          f.npcs && f.npcs.length && React.createElement('div', { style: { marginTop: 10 } },
            label('NPCs'),
            f.npcs.map((n, i) => React.createElement('div', { key: i, style: { background: 'var(--bg-3)', borderRadius: 4, padding: '8px 10px', marginBottom: 6 } },
              React.createElement('div', { style: { fontWeight: 600, fontSize: 12, color: 'var(--fg-0)' } }, n.name + (n.role ? ' — ' + n.role : '')),
              n.trait && React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-2)', marginTop: 2 } }, n.trait),
              n.quote && React.createElement('div', { style: { fontSize: 11, color: 'var(--accent)', fontStyle: 'italic', marginTop: 4 } }, n.quote),
              n.secret && React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', marginTop: 4 } }, '⚠ ' + n.secret),
            )),
          ),
        ),
      );
    })
  );

  // NPCS TAB
  const allNPCs = lore.factions.flatMap(f => (f.npcs || []).map(n => ({ ...n, factionId: f.id, factionName: f.name })));
  const filteredNPCs = allNPCs.filter(n => {
    const matchFaction = npcFaction === 'all' || n.factionId === npcFaction;
    const q = npcSearch.toLowerCase();
    const matchSearch = !q || n.name.toLowerCase().includes(q) || (n.role || '').toLowerCase().includes(q) || (n.trait || '').toLowerCase().includes(q);
    return matchFaction && matchSearch;
  });
  const npcsTab = React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' } },
      React.createElement('input', {
        placeholder: 'Search NPCs…',
        value: npcSearch,
        onChange: e => setNpcSearch(e.target.value),
        style: { flex: '1 1 180px', padding: '6px 10px', fontSize: 12, background: 'var(--bg-3)', border: '1px solid var(--border-1)', borderRadius: 4, color: 'var(--fg-1)', outline: 'none' },
      }),
      React.createElement('button', { onClick: () => setNpcFaction('all'), style: tabStyle(npcFaction === 'all') }, 'All'),
      lore.factions.map(f => React.createElement('button', { key: f.id, onClick: () => setNpcFaction(f.id), style: { ...tabStyle(npcFaction === f.id), maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, f.name)),
    ),
    filteredNPCs.length === 0 && React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 13, padding: 12 } }, 'No NPCs match.'),
    filteredNPCs.map(n => {
      const npcKey = n.factionId + '::' + n.name;
      const open = expandedNPC === npcKey;
      return React.createElement('div', { key: npcKey, style: { marginBottom: 8 } },
        React.createElement('div', {
          onClick: () => setExpandedNPC(open ? null : npcKey),
          style: { display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid ' + (open ? 'var(--accent)' : 'var(--border-1)'), borderRadius: open ? '6px 6px 0 0' : 6, cursor: 'pointer' },
        },
          React.createElement('span', { style: { fontWeight: 700, fontSize: 13, color: 'var(--fg-0)', flexShrink: 0 } }, n.name),
          React.createElement('span', { style: { fontSize: 11, color: 'var(--accent)', flexShrink: 0, marginLeft: 2 } }, n.factionName),
          React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, n.role ? ' — ' + n.role : ''),
          React.createElement('span', { style: { color: 'var(--fg-4)', fontSize: 12, flexShrink: 0 } }, open ? '▲' : '▼'),
        ),
        open && React.createElement('div', { style: { background: 'var(--bg-1)', border: '1px solid var(--accent)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '14px 16px' } },
          n.trait && React.createElement('div', { style: { marginBottom: 12 } },
            label('Character Trait'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65 } }, n.trait),
          ),
          n.appearance && React.createElement('div', { style: { marginBottom: 12 } },
            label('Appearance'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65 } }, n.appearance),
          ),
          n.voice && React.createElement('div', { style: { marginBottom: 12, background: 'rgba(255,180,80,0.07)', border: '1px solid rgba(255,180,80,0.22)', borderLeft: '3px solid var(--accent)', borderRadius: 4, padding: '10px 12px' } },
            label('Voice & Mannerisms'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.65 } }, n.voice),
          ),
          n.quote && React.createElement('blockquote', { style: { margin: '0 0 12px', padding: '8px 14px', borderLeft: '3px solid var(--fg-4)', color: 'var(--accent)', fontStyle: 'italic', fontSize: 13, lineHeight: 1.6 } }, n.quote),
          n.secret && React.createElement('div', { style: { marginBottom: 12, background: 'rgba(200,60,60,0.07)', border: '1px solid rgba(200,60,60,0.2)', borderLeft: '3px solid #c83c3c', borderRadius: 4, padding: '10px 12px' } },
            label('Secret (GM Only)'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65 } }, n.secret),
          ),
          n.plotPotential && React.createElement('div', { style: { marginBottom: 4 } },
            label('Plot Potential'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65 } }, n.plotPotential),
          ),
        ),
      );
    }),
  );

  // FACTION TURNS TAB
  const turnsTab = lore.factionTurns ? React.createElement('div', null,
    lore.factionTurns.map(turn => {
      const open = expandedTurn === turn.turn;
      return React.createElement('div', { key: turn.turn, style: { marginBottom: 8 } },
        React.createElement('div', {
          onClick: () => setExpandedTurn(open ? null : turn.turn),
          style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid ' + (open ? 'var(--accent)' : 'var(--border-1)'), borderRadius: open ? '6px 6px 0 0' : 6, cursor: 'pointer' },
        },
          React.createElement('span', { style: { flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, 'Turn ' + turn.turn + ' — ' + turn.label),
          React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', fontStyle: 'italic' } }, turn.worldState),
          React.createElement('span', { style: { color: 'var(--fg-4)', fontSize: 12, marginLeft: 8 } }, open ? '▲' : '▼'),
        ),
        open && React.createElement('div', { style: { background: 'var(--bg-1)', border: '1px solid var(--accent)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '14px 16px' } },
          turn.actions.map((a, i) => {
            const facName = (lore.factions.find(f => f.id === a.faction) || {}).name || a.faction;
            return React.createElement('div', { key: i, style: { background: 'var(--bg-2)', borderRadius: 4, padding: '10px 12px', marginBottom: 8 } },
              React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 } },
                React.createElement('span', { style: { fontWeight: 700, fontSize: 12, color: 'var(--accent)' } }, facName),
                React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)' } }, '— ' + a.action),
              ),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', marginBottom: 4 } }, a.detail),
              a.roll && React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', marginBottom: 4 } },
                'Roll: ' + a.roll.attacker + ' vs ' + a.roll.defender + ' → ' + a.roll.result,
              ),
              a.statChange && React.createElement('div', { style: { fontSize: 11, color: '#e8a87c', marginBottom: 4 } }, a.statChange),
              a.narrative && React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6, borderTop: '1px solid var(--border-1)', paddingTop: 6, marginTop: 4 } }, a.narrative),
            );
          }),
          React.createElement('div', { style: { marginTop: 10 } },
            label('Timeline Events This Turn'),
            React.createElement('ul', { style: { margin: '4px 0 0', paddingLeft: 18 } },
              (turn.timelineEvents || []).map((e, i) => bullet(e))
            ),
          ),
        ),
      );
    })
  ) : React.createElement('div', { style: { color: 'var(--fg-3)', padding: 12 } }, 'No faction turns recorded yet.');

  // PCs TAB
  const [expandedPC, setExpandedPC] = useASt(null);
  const pcsTab = React.createElement('div', null,
    (lore.playerCharacters || []).map(pc => {
      const pcOpen = expandedPC === pc.id;
      return React.createElement('div', { key: pc.id, style: { marginBottom: 10 } },
        React.createElement('div', {
          onClick: () => setExpandedPC(pcOpen ? null : pc.id),
          style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--bg-2)', border: '1px solid ' + (pcOpen ? 'var(--accent)' : 'var(--border-1)'), borderRadius: pcOpen ? '6px 6px 0 0' : 6, cursor: 'pointer' },
        },
          React.createElement('span', { style: { flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--fg-0)' } }, pc.playerName),
          React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-3)', fontStyle: 'italic', flex: 2 } }, pc.characterConcept.slice(0, 80) + (pc.characterConcept.length > 80 ? '…' : '')),
          React.createElement('span', { style: { color: 'var(--fg-4)', fontSize: 12, flexShrink: 0 } }, pcOpen ? '▲' : '▼'),
        ),
        pcOpen && React.createElement('div', { style: { background: 'var(--bg-1)', border: '1px solid var(--accent)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '16px 18px' } },
          label('GM Concept'), prose(pc.characterConcept),
          label('GM Notes'), prose(pc.gmNotes),
          pc.moralChallenges && pc.moralChallenges.length && React.createElement('div', { style: { marginTop: 12 } },
            label('Moral Challenges'),
            React.createElement('ul', { style: { margin: '4px 0 0', paddingLeft: 18 } }, pc.moralChallenges.map((c, i) => bullet(c))),
          ),
          pc.briefingSections && pc.briefingSections.length && React.createElement('div', { style: { marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-1)' } },
            React.createElement('div', { style: { fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 14 } }, 'Player Briefing'),
            pc.briefingSections.map((sec, i) => React.createElement('div', { key: i, style: { marginBottom: 16 } },
              React.createElement('div', { style: { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: sec.blank ? '#c87c3c' : 'var(--accent)', marginBottom: 5, fontWeight: 600 } }, sec.title + (sec.blank ? ' — NEEDS PLAYER INPUT' : '')),
              sec.body && React.createElement('div', {
                style: { fontSize: 13, color: sec.blank ? 'var(--fg-3)' : 'var(--fg-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: sec.blank ? 'rgba(200,120,60,0.06)' : 'transparent', border: sec.blank ? '1px dashed rgba(200,120,60,0.3)' : 'none', borderRadius: sec.blank ? 4 : 0, padding: sec.blank ? '8px 10px' : 0 }
              }, sec.body),
              sec.bullets && sec.bullets.length && React.createElement('ul', { style: { margin: '6px 0 0', paddingLeft: 18 } },
                sec.bullets.map((b, j) => React.createElement('li', { key: j, style: { fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.65, marginBottom: 4 } }, b))
              ),
            )),
          ),
        ),
      );
    })
  );

  // SESSION 1 TAB
  const s1 = lore.session1;
  const session1Tab = s1 ? React.createElement('div', null,
    card([
      React.createElement('h3', { style: { margin: '0 0 4px', color: 'var(--fg-0)' } }, s1.title),
      React.createElement('div', { style: { fontSize: 11, color: 'var(--accent)', marginBottom: 8 } }, s1.world + ' · ' + s1.worldTags.join(', ')),
      label('Premise'), prose(s1.premise),
      label('World'), prose(s1.worldDescription),
    ]),
    card([
      label('Player 1 Stakes'), prose(s1.characterStakes.player1),
      React.createElement('div', { style: { height: 12 } }),
      label('Player 2 Stakes'), prose(s1.characterStakes.player2),
    ]),
    card([
      label('Hidden Truths (GM Only)'),
      React.createElement('ul', { style: { margin: '4px 0 0', paddingLeft: 18 } }, s1.hiddenTruths.map((t, i) => bullet(t))),
    ]),
    s1.concordance && card([
      label('The Concordance — Treaty Details'),
      richProse(s1.concordance.overview),
      s1.concordance.greyArea && [label('The Grey Area'), richProse(s1.concordance.greyArea)],
      s1.concordance.secondaryCopy && [label('The Secondary Copy (GM Only)'), richProse(s1.concordance.secondaryCopy)],
      s1.concordance.theLatticeComplication && [label('The Lattice Complication (GM Only)'), richProse(s1.concordance.theLatticeComplication)],
      s1.concordance.parties && [
        React.createElement('div', { style: { fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: 12, marginBottom: 6 } }, 'Treaty Parties'),
        (s1.concordance.parties || []).map((p, i) => React.createElement('div', {
          key: i,
          style: { borderLeft: '2px solid var(--border-1)', paddingLeft: 10, marginBottom: 10 },
        },
          React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 3 } },
            React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: 'var(--fg-0)' } }, p.name),
            React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.07em' } }, p.role),
          ),
          React.createElement('p', { style: { fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' } }, parseRichText(p.stake)),
        )),
      ],
    ]),
    s1.aftermath && card([
      label('After Thessavar — What Comes Next (GM Only)'),
      richProse(s1.aftermath.overview),
      s1.aftermath.whyTheyLeave && [label('Why They Leave'), richProse(s1.aftermath.whyTheyLeave)],
      s1.aftermath.immediate && [label('Immediately'), richProse(s1.aftermath.immediate)],
      s1.aftermath.factionResponses && [label('Faction Responses'), richProse(s1.aftermath.factionResponses)],
      s1.aftermath.mediumTerm && [label('Medium Term'), richProse(s1.aftermath.mediumTerm)],
      s1.aftermath.thePCs && [label('The PCs'), richProse(s1.aftermath.thePCs)],
    ]),
    React.createElement('div', { style: { marginBottom: 6 } }, label('Session Beats')),
    (s1.beats || []).map(b => card([
      React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' } },
        React.createElement('span', { style: { fontWeight: 700, fontSize: 13, color: 'var(--accent)' } }, 'Beat ' + b.beat),
        React.createElement('span', { style: { fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, b.title),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-4)', fontStyle: 'italic' } }, b.type),
      ),
      b.gmNotes && richProse(b.gmNotes),
      (b.sections || []).map((sec, si) => beatSection(sec, si)),
    ])),
  ) : null;

  // NOTABLE WORLDS TAB
  const worldsTab = React.createElement('div', null,
    !(lore.notableWorlds && lore.notableWorlds.length) && React.createElement('div', { style: { color: 'var(--fg-3)', padding: 12 } }, 'No notable worlds defined.'),
    (lore.notableWorlds || []).map(w => card([
      React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 8 } },
        React.createElement('span', { style: { fontWeight: 700, fontSize: 15, color: 'var(--fg-0)' } }, w.name),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--accent)', letterSpacing: '0.06em' } }, w.role),
      ),
      React.createElement('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 } },
        [['Atmo', w.atmosphere], ['Temp', w.temperature], ['Pop', w.population], ['TL', w.techLevel]].map(([k, v]) =>
          v && React.createElement('div', { key: k, style: { fontSize: 11, color: 'var(--fg-3)' } },
            React.createElement('span', { style: { color: 'var(--fg-4)', marginRight: 4 } }, k),
            React.createElement('span', { style: { color: 'var(--fg-2)' } }, v),
          )
        ),
      ),
      w.tags && w.tags.length && React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 } },
        w.tags.map(t => React.createElement('span', { key: t, style: { fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-3)', border: '1px solid var(--border-1)', borderRadius: 3, padding: '2px 7px', color: 'var(--fg-3)' } }, t))
      ),
      label('Description'), prose(w.description),
      label('GM Notes'), prose(w.gmNotes),
    ]))
  );

  const tabs = ['sector', 'factions', 'npcs', 'turns', 'pcs', 'worlds', 'session1'];
  const tabLabels = { sector: 'Sector', factions: 'Factions', npcs: 'NPCs', turns: 'S0 Turns', pcs: 'PCs', worlds: 'Worlds', session1: 'Session 1' };

  return React.createElement('div', { style: { height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { padding: '20px 24px', maxWidth: 860, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 18 } },
        tabs.map(t => React.createElement('button', { key: t, onClick: () => setGMTab(t), style: tabStyle(tab === t) }, tabLabels[t]))
      ),
      tab === 'sector'   && sectorTab,
      tab === 'factions' && factionsTab,
      tab === 'npcs'     && npcsTab,
      tab === 'turns'    && turnsTab,
      tab === 'pcs'      && pcsTab,
      tab === 'worlds'   && worldsTab,
      tab === 'session1' && session1Tab,
    )
  );
}

// Pure-JS SHA-256 — works in any context (file://, HTTP, HTTPS).
// crypto.subtle requires a secure context and fails silently on plain HTTP.
function sha256(str) {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const input = str + '\0swn-gm';
  const bytes = [];
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 0x80) { bytes.push(c); }
    else if (c < 0x800) { bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); }
    else { bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); }
  }
  const len = bytes.length;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  const bits = (len * 8) >>> 0;
  bytes.push(0,0,0,0,(bits>>>24)&0xff,(bits>>>16)&0xff,(bits>>>8)&0xff,bits&0xff);
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < bytes.length; i += 64) {
    const w = new Uint32Array(64);
    for (let j = 0; j < 16; j++) w[j] = (bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3];
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j-15],7)^rotr(w[j-15],18)^(w[j-15]>>>3);
      const s1 = rotr(w[j-2],17)^rotr(w[j-2],19)^(w[j-2]>>>10);
      w[j] = (w[j-16]+s0+w[j-7]+s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = [h0,h1,h2,h3,h4,h5,h6,h7];
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(e,6)^rotr(e,11)^rotr(e,25);
      const ch = (e&f)^(~e&g);
      const temp1 = (h+S1+ch+K[j]+w[j]) >>> 0;
      const S0 = rotr(a,2)^rotr(a,13)^rotr(a,22);
      const maj = (a&b)^(a&c)^(b&c);
      const temp2 = (S0+maj) >>> 0;
      [h,g,f,e,d,c,b,a] = [g,f,e,(d+temp1)>>>0,c,b,a,(temp1+temp2)>>>0];
    }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;
    h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map(v=>v.toString(16).padStart(8,'0')).join('');
}

function getPlayerIdentity() {
  let id;
  try {
    id = localStorage.getItem('mp-user-id') || localStorage.getItem('coe-player-id');
    if (!id) { id = 'p-' + Math.random().toString(36).slice(2, 12); localStorage.setItem('coe-player-id', id); }
  } catch { id = 'p-anon'; }
  let name = '';
  try { name = localStorage.getItem('mp-name') || ''; } catch {}
  return { id, name };
}

const NAV_ICONS = {
  map:     '⬡',
  factions:'⚔',
  world:   '☥',
  party:   '☉',
  combat:  '⊞',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "seed": "cradle-of-embers",
  "starfield": "warm",
  "showLabels": true,
  "showGrid": true,
  "showRoutes": true,
  "autoRotatePlanet": true
}/*EDITMODE-END*/;

function App() {
  const tweakHook = window.useTweaks || (d => [d, () => {}]);
  const urlSeed = (() => {
    try { return new URLSearchParams(location.search).get('seed') || null; } catch { return null; }
  })();
  const initialTweaks = urlSeed ? { ...TWEAK_DEFAULTS, seed: urlSeed } : TWEAK_DEFAULTS;
  const [tweaks, setTweak] = tweakHook(initialTweaks);

  const [sector, setSector] = useASt(() => window.generateSector(tweaks.seed));
  const [me, setMe] = useASt(getPlayerIdentity);
  const [currentView, setCurrentView] = useASt('map');
  const [selectedSysHex, setSelectedSysHex] = useASt(null);
  const [selectedPlanetId, setSelectedPlanetId] = useASt(null);
  // Sub-views within Map and World
  const [mapMode, setMapMode] = useASt('sector'); // 'sector' | 'system' | 'planet'
  const [worldTab, setWorldTab] = useASt('timeline'); // 'timeline' | 'npcs' | 'hooks' | 'missions' | 'encounters'
  const [search, setSearch] = useASt('');

  const [party, setParty] = useASt([]);
  const [missions, setMissions] = useASt([]);
  const [encounters, setEncounters] = useASt([]);
  const [gmLog, setGmLog] = useASt([]);

  const [mpOpen, setMpOpen] = useASt(false);
  const [diceOpen, setDiceOpen] = useASt(false);

  const [role, setRole] = useASt(() => {
    try { return localStorage.getItem('coe-role'); } catch { return null; }
  });
  const [showIntro, setShowIntro] = useASt(() => {
    try { return !localStorage.getItem('coe-role'); } catch { return true; }
  });
  const [isGM, setIsGM] = useASt(() => {
    try { return localStorage.getItem('coe-role') === 'gm'; } catch { return false; }
  });
  const [gmModal, setGmModal] = useASt(null);
  const [gmPw, setGmPw] = useASt('');
  const [gmPw2, setGmPw2] = useASt('');
  const [gmErr, setGmErr] = useASt('');
  const gmPendingView = useAR(null);
  const gmAuthDismissesIntro = useAR(false);

  function enterAsPlayer() {
    setRole('player'); try { localStorage.setItem('coe-role', 'player'); } catch {}
    setIsGM(false); setShowIntro(false);
  }
  function enterAsGM() { gmAuthDismissesIntro.current = true; openGMModal(); }
  function commitGMRole() {
    setRole('gm'); try { localStorage.setItem('coe-role', 'gm'); } catch {}
    setIsGM(true);
  }

  useAEf(() => {
    setSector(window.generateSector(tweaks.seed));
    setSelectedSysHex(null); setSelectedPlanetId(null); setMapMode('sector');
  }, [tweaks.seed]);

  const storageKey = 'swn-edits-' + tweaks.seed;
  const campaignKey = 'swn-campaign-' + tweaks.seed;
  useAEf(() => {
    try { const raw = localStorage.getItem(storageKey); if (raw) setSector(s => mergeEdits(s, JSON.parse(raw))); } catch {}
    try {
      const raw = localStorage.getItem(campaignKey);
      if (raw) { const c = JSON.parse(raw); setParty(c.party||[]); setMissions(c.missions||[]); setEncounters(c.encounters||[]); setGmLog(c.gmLog||[]); }
      else { setParty([]); setMissions([]); setEncounters([]); setGmLog([]); }
    } catch {}
  }, [storageKey, campaignKey]);

  async function openGMModal() {
    let stored = localStorage.getItem('swn-gm-hash');
    // Try to pull the hash from PocketBase so it works cross-machine
    if (window.MP?.isReady()) {
      try {
        const remote = await window.MP.loadGMHash();
        if (remote) {
          localStorage.setItem('swn-gm-hash', remote);
          stored = remote;
        }
      } catch {}
    }
    setGmModal(stored ? 'unlock' : 'setup');
  }
  function closeGmModal() { setGmModal(null); setGmPw(''); setGmPw2(''); setGmErr(''); gmAuthDismissesIntro.current = false; }
  function onGMAuthSuccess() {
    commitGMRole();
    if (gmAuthDismissesIntro.current) { setShowIntro(false); gmAuthDismissesIntro.current = false; }
    if (gmPendingView.current) { setCurrentView(gmPendingView.current); gmPendingView.current = null; }
    closeGmModal();
  }
  async function submitGMPassword() {
    const GM_KEY = 'swn-gm-hash';
    const stored = localStorage.getItem(GM_KEY);
    async function persistHash(hash) {
      localStorage.setItem(GM_KEY, hash);
      if (window.MP?.isReady()) {
        try { await window.MP.saveGMHash(hash); } catch {}
      }
    }
    if (gmModal === 'setup') {
      if (!gmPw) return setGmErr('Enter a password.');
      if (gmPw !== gmPw2) return setGmErr('Passwords do not match.');
      await persistHash(await sha256(gmPw)); onGMAuthSuccess();
    } else if (gmModal === 'unlock') {
      if (!gmPw) return setGmErr('Enter password.');
      if (await sha256(gmPw) === stored) { onGMAuthSuccess(); } else { setGmErr('Incorrect password.'); }
    } else if (gmModal === 'change') {
      if (!gmPw) return setGmErr('Enter new password.');
      if (gmPw !== gmPw2) return setGmErr('Passwords do not match.');
      await persistHash(await sha256(gmPw)); closeGmModal();
    }
  }

  function saveCampaign(patch) {
    const next = { party, missions, encounters, gmLog, ...patch };
    if (patch.party !== undefined) setParty(patch.party);
    if (patch.missions !== undefined) setMissions(patch.missions);
    if (patch.encounters !== undefined) setEncounters(patch.encounters);
    if (patch.gmLog !== undefined) setGmLog(patch.gmLog);
    try { localStorage.setItem(campaignKey, JSON.stringify(next)); } catch {}
  }

  function saveEdits(updater) {
    setSector(prev => {
      const next = updater(prev);
      try { localStorage.setItem(storageKey, JSON.stringify(extractEdits(next))); } catch {}
      return next;
    });
  }

  const campaignState = useAMem(() => ({
    sectorEdits: extractEdits(sector), party, missions, encounters, gmLog,
  }), [sector, party, missions, encounters, gmLog]);

  function applyRemoteCampaign(data) {
    if (!data) return;
    if (data.sectorEdits) { setSector(prev => mergeEdits(prev, data.sectorEdits)); try { localStorage.setItem(storageKey, JSON.stringify(data.sectorEdits)); } catch {} }
    if (data.party) setParty(data.party);
    if (data.missions) setMissions(data.missions);
    if (data.encounters) setEncounters(data.encounters);
    if (data.gmLog) setGmLog(data.gmLog);
    try { localStorage.setItem(campaignKey, JSON.stringify({ party: data.party||party, missions: data.missions||missions, encounters: data.encounters||encounters, gmLog: data.gmLog||gmLog })); } catch {}
  }

  const allPlanets = useAMem(() => sector.systems.flatMap(s => s.planets), [sector]);
  const selSystem = sector.systems.find(s => s.hexId === selectedSysHex) || null;
  const selPlanet = (() => {
    if (!selectedPlanetId) return null;
    for (const s of sector.systems) { const p = s.planets.find(p => p.id === selectedPlanetId); if (p) return { planet: p, system: s }; }
    return null;
  })();

  function pickPlanet(planet) {
    const sys = sector.systems.find(s => s.planets.some(p => p.id === planet.id));
    setSelectedSysHex(sys.hexId); setSelectedPlanetId(planet.id);
    setCurrentView('map'); setMapMode('planet');
  }
  function pickSystem(hex) {
    setSelectedSysHex(hex); setCurrentView('map'); setMapMode('system');
  }
  function goToMap() { setCurrentView('map'); setMapMode('sector'); }

  function regenerate() { setTweak('seed', Math.random().toString(36).slice(2, 10)); }

  const searchResults = useAMem(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allPlanets.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.name.toLowerCase().includes(q)) ||
      p.biome.includes(q)
    ).slice(0, 10);
  }, [search, allPlanets]);

  // ── VIEW ROUTER ──────────────────────────────────────────────────────────────
  let viewEl = null;

  if (currentView === 'map') {
    if (mapMode === 'planet' && selPlanet) {
      viewEl = React.createElement(window.PlanetView, {
        system: selPlanet.system, planet: selPlanet.planet,
        autoRotate: tweaks.autoRotatePlanet,
        onUpdate: patch => saveEdits(s => updatePlanet(s, selPlanet.planet.id, patch)),
        onSelectPlanet: pickPlanet,
        onRerollTexture: () => saveEdits(s => updatePlanet(s, selPlanet.planet.id, { textureSeed: Math.floor(Math.random() * 100000) })),
      });
    } else if (mapMode === 'system' && selSystem) {
      viewEl = React.createElement(window.SystemView, { system: selSystem, onPickPlanet: pickPlanet });
    } else {
      viewEl = React.createElement(window.SectorMap, {
        sector, selectedHex: selectedSysHex,
        onSelect: pickSystem,
        showLabels: tweaks.showLabels, showGrid: tweaks.showGrid, showRoutes: tweaks.showRoutes,
      });
    }
  } else if (currentView === 'factions') {
    // Factions view with GM turn embedded below when GM
    viewEl = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', gap: 0 } },
      React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'hidden' } },
        React.createElement(window.FactionsView, {
          sector,
          isGM,
          onUpdate: f => saveEdits(s => ({ ...s, factions: s.factions.map(x => x.id === f.id ? f : x) })),
          onPickPlanet: pickPlanet,
        })
      ),
      isGM && React.createElement('div', { style: { borderTop: '1px solid var(--border-1)', flexShrink: 0 } },
        React.createElement(window.GMTurnView, {
          sector, log: gmLog,
          onLog: entry => { if (entry === '__clear__') return saveCampaign({ gmLog: [] }); saveCampaign({ gmLog: [entry, ...gmLog] }); },
          onUpdateFaction: f => saveEdits(s => ({ ...s, factions: s.factions.map(x => x.id === f.id ? f : x) })),
          onPickPlanet: pickPlanet,
        })
      )
    );
  } else if (currentView === 'world') {
    // Tabbed binder: Timeline | NPCs | Hooks | (GM: Missions | Encounters)
    const tabs = [
      { id: 'timeline', label: 'Timeline', count: sector.timeline.length },
      { id: 'npcs', label: 'NPCs', count: sector.npcs.length },
      { id: 'hooks', label: 'Hooks', count: sector.hooks.length },
      ...(isGM ? [
        { id: 'missions', label: 'Missions', count: missions.length },
        { id: 'encounters', label: 'Encounters', count: encounters.length },
      ] : []),
    ];
    let tabContent = null;
    if (worldTab === 'timeline') {
      tabContent = React.createElement(window.TimelineView, {
        sector,
        onUpdate: e => saveEdits(s => ({ ...s, timeline: s.timeline.map(x => x.id === e.id ? e : x) })),
        onAdd: () => saveEdits(s => ({ ...s, timeline: [{ id: 'evt-' + Math.floor(Math.random() * 99999), year: 3200, text: 'New event…', revealed: false }, ...s.timeline] })),
      });
    } else if (worldTab === 'npcs') {
      tabContent = React.createElement(window.NPCsView, {
        sector,
        onUpdate: n => saveEdits(s => ({ ...s, npcs: s.npcs.map(x => x.id === n.id ? n : x) })),
        onAddNPC: () => {
          saveEdits(s => {
            const SWN = window.SWN;
            const id = 'npc-' + Math.floor(Math.random() * 99999);
            const npc = { id, name: SWN.firstNames[Math.floor(Math.random()*SWN.firstNames.length)] + ' ' + SWN.lastNames[Math.floor(Math.random()*SWN.lastNames.length)], role: SWN.npcRoles[Math.floor(Math.random()*SWN.npcRoles.length)], trait: SWN.npcTraits[Math.floor(Math.random()*SWN.npcTraits.length)], goal: SWN.npcGoals[Math.floor(Math.random()*SWN.npcGoals.length)], hp: 8, notes: '' };
            return { ...s, npcs: [npc, ...s.npcs] };
          });
        },
        onDeleteNPC: id => saveEdits(s => ({ ...s, npcs: s.npcs.filter(n => n.id !== id) })),
        onPickPlanet: pickPlanet,
      });
    } else if (worldTab === 'hooks') {
      tabContent = React.createElement(window.HooksView, {
        sector,
        onUpdate: h => saveEdits(s => ({ ...s, hooks: s.hooks.map(x => x.id === h.id ? h : x) })),
        onAdd: () => saveEdits(s => {
          const rng = window.makeRNG(tweaks.seed + '-newhook-' + Date.now());
          const planets = s.systems.flatMap(x => x.planets);
          const p = rng.pick(planets);
          const SWN = window.SWN;
          return { ...s, hooks: [{ id: 'hook-' + Math.floor(Math.random()*99999), planetId: p.id, planetName: p.name, text: cap(rng.pick(SWN.hookActions)) + ' ' + rng.pick(SWN.hookObjects) + ' on ' + p.name + ', ' + rng.pick(SWN.hookComplications) + '.', status: 'Open' }, ...s.hooks] };
        }),
        onPickPlanet: pickPlanet,
      });
    } else if (worldTab === 'missions') {
      tabContent = React.createElement(window.MissionGeneratorView, {
        sector, missions,
        onSaveMission: m => saveCampaign({ missions: [m, ...missions] }),
        onDeleteMission: id => saveCampaign({ missions: missions.filter(m => m.id !== id) }),
        onPickPlanet: pickPlanet,
      });
    } else if (worldTab === 'encounters') {
      tabContent = React.createElement(window.EncounterGeneratorView, {
        sector, party, encounters,
        onSave: e => saveCampaign({ encounters: [e, ...encounters] }),
        onDelete: id => saveCampaign({ encounters: encounters.filter(e => e.id !== id) }),
        onLoadToCombat: () => setCurrentView('combat'),
      });
    }
    viewEl = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
      // Tab bar
      React.createElement('div', { style: { display: 'flex', gap: 2, borderBottom: '1px solid var(--border-1)', marginBottom: 20, flexShrink: 0 } },
        tabs.map(t => React.createElement('button', {
          key: t.id,
          onClick: () => setWorldTab(t.id),
          style: {
            background: 'none', border: 'none', borderBottom: worldTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
            color: worldTab === t.id ? 'var(--accent)' : 'var(--fg-3)',
            padding: '8px 14px', fontSize: 11, fontFamily: 'var(--font-ui)', letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: 'pointer', fontWeight: worldTab === t.id ? 600 : 400,
          },
        }, t.label + (t.count ? ` (${t.count})` : '')))
      ),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto' } }, tabContent)
    );
  } else if (currentView === 'party') {
    viewEl = React.createElement(window.CharacterSheetsView, {
      party, me, isGM,
      onSetMyName: nm => { try { localStorage.setItem('mp-name', nm); } catch {} setMe(m => ({ ...m, name: nm })); },
      onSave: c => saveCampaign({ party: party.find(p => p.id === c.id) ? party.map(p => p.id === c.id ? c : p) : [...party, c] }),
      onDelete: id => saveCampaign({ party: party.filter(p => p.id !== id) }),
    });
  } else if (currentView === 'combat') {
    viewEl = React.createElement(window.CombatView, null);
  } else if (currentView === 'gm-notes' && isGM) {
    viewEl = React.createElement(GMNotesView, { sector });
  }

  // Breadcrumb label for map mode
  const mapCrumbLabel = mapMode === 'planet' && selPlanet ? selPlanet.planet.name
    : mapMode === 'system' && selSystem ? (selSystem.planets[0]?.name || selSystem.starName) + ' System'
    : sector.sectorName;
  const viewLabels = { map: mapCrumbLabel, factions: 'Factions', world: 'World', party: 'Party', combat: 'Combat', 'gm-notes': 'GM Notes' };

  const TP = window.TweaksPanel;
  const TSec = window.TweakSection;
  const TTog = window.TweakToggle;
  const TRad = window.TweakRadio;
  const TBtn = window.TweakButton;

  return React.createElement('div', { className: 'app', 'data-screen-label': 'app' },
    React.createElement(window.Starfield, { viewKey: currentView + (selectedPlanetId || selectedSysHex || ''), intensity: 1, palette: tweaks.starfield }),

    showIntro && window.IntroScreen && React.createElement(window.IntroScreen, {
      sector, seed: tweaks.seed,
      onEnter: r => r === 'gm' ? enterAsGM() : enterAsPlayer(),
    }),

    // ── SIDEBAR ──
    React.createElement('aside', { className: 'sidebar' },
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'brand', onClick: () => setShowIntro(true), style: { cursor: 'pointer' }, title: 'Replay intro' },
          React.createElement('div', { className: 'brand-mark' },
            React.createElement('svg', { viewBox: '0 0 22 22', width: 22, height: 22 },
              React.createElement('polygon', { points: '11,1 21,7 21,15 11,21 1,15 1,7', fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.5 }),
              React.createElement('circle', { cx: 11, cy: 11, r: 3, fill: 'var(--accent)' })
            )
          ),
          'CRADLE OF EMBERS'
        ),
        React.createElement('div', { className: 'sector-name' }, sector.sectorName),
        React.createElement('div', { className: 'seed' }, 'seed: ' + tweaks.seed)
      ),

      React.createElement('nav', { className: 'nav' },
        NavItem('map',      currentView === 'map',      'Map',      null,                  goToMap),
        NavItem('factions', currentView === 'factions', 'Factions', sector.factions.length, () => setCurrentView('factions')),
        NavItem('world',    currentView === 'world',    'World',    null,                  () => setCurrentView('world')),
        NavItem('party',    currentView === 'party',    'Party',    party.length || null,  () => setCurrentView('party')),
        NavItem('combat',   currentView === 'combat',   'Combat',   null,                  () => setCurrentView('combat')),
        isGM && NavItem('gm-notes', currentView === 'gm-notes', 'GM Notes', null, () => setCurrentView('gm-notes')),
      ),

      // Map sub-nav — only visible when on the map view
      currentView === 'map' && React.createElement('div', { style: { padding: '0 12px 8px', display: 'flex', gap: 4, flexWrap: 'wrap' } },
        ['sector', 'system', 'planet'].map(m => {
          const disabled = (m === 'system' && !selSystem) || (m === 'planet' && !selPlanet);
          const labels = { sector: 'Sector', system: 'System', planet: 'Planet' };
          return React.createElement('button', {
            key: m,
            onClick: disabled ? null : () => setMapMode(m),
            style: {
              fontSize: 10, padding: '3px 8px', letterSpacing: '0.05em', textTransform: 'uppercase',
              background: mapMode === m ? 'var(--accent)' : 'var(--bg-3)',
              color: mapMode === m ? '#1a0d08' : disabled ? 'var(--fg-4)' : 'var(--fg-2)',
              border: '1px solid ' + (mapMode === m ? 'var(--accent)' : 'var(--border-1)'),
              borderRadius: 3, cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: mapMode === m ? 700 : 400,
            },
          }, labels[m]);
        })
      ),

      React.createElement('div', { className: 'sidebar-footer', style: { flexDirection: 'column', gap: 8 } },
        React.createElement('div', { style: { display: 'flex', gap: 6, width: '100%' } },
          React.createElement('button', { onClick: regenerate, style: { flex: 1, fontSize: 11 }, title: 'Generate a new sector' }, '↻ New'),
          isGM && React.createElement('button', {
            onClick: () => {
              if (!confirm('Clear saved sector edits and reload? This resets to fresh generated state.')) return;
              try { localStorage.removeItem('swn-edits-' + tweaks.seed); } catch {}
              window.location.reload();
            },
            style: { flex: 1, fontSize: 11, color: 'var(--fg-3)' },
            title: 'Clear cached sector and regenerate',
          }, '⟳ Reset'),
          React.createElement('button', {
            onClick: () => {
              const data = { seed: tweaks.seed, sector: extractEdits(sector), party, missions, encounters, gmLog, exportedAt: new Date().toISOString(), app: 'Cradle of Embers' };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `cradle-of-embers-${tweaks.seed}.json`; a.click(); URL.revokeObjectURL(url);
            },
            style: { flex: 1, fontSize: 11 },
          }, '↓ Export'),
          React.createElement('button', {
            onClick: () => {
              const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json,.json';
              input.onchange = async e => {
                const file = e.target.files[0]; if (!file) return;
                try {
                  const data = JSON.parse(await file.text());
                  if (data.seed) {
                    if (data.sector) localStorage.setItem('swn-edits-' + data.seed, JSON.stringify(data.sector));
                    if (data.party || data.missions || data.encounters || data.gmLog) localStorage.setItem('swn-campaign-' + data.seed, JSON.stringify({ party: data.party||[], missions: data.missions||[], encounters: data.encounters||[], gmLog: data.gmLog||[] }));
                    setTweak('seed', data.seed);
                  }
                } catch (err) { alert('Could not parse file: ' + err.message); }
              };
              input.click();
            },
            style: { flex: 1, fontSize: 11 },
          }, '↑ Import')
        ),
        React.createElement('div', { style: { display: 'flex', gap: 6, width: '100%' } },
          isGM
            ? [
                React.createElement('button', { key: 'lock', onClick: enterAsPlayer, style: { flex: 1, fontSize: 11, borderColor: 'var(--accent)', color: 'var(--accent)' } }, '🔓 GM · Player view'),
                React.createElement('button', { key: 'chpw', onClick: () => { setGmPw(''); setGmPw2(''); setGmErr(''); setGmModal('change'); }, style: { fontSize: 11, padding: '6px 8px' } }, '⚙'),
              ]
            : React.createElement('button', { onClick: enterAsGM, style: { flex: 1, fontSize: 11 } }, '🔒 Enter GM Mode'),
        ),
        window.MultiplayerPanel && React.createElement(window.MultiplayerPanel, {
          seed: tweaks.seed, campaignState, onRemoteCampaign: applyRemoteCampaign, open: mpOpen, setOpen: setMpOpen,
        })
      )
    ),

    // ── MAIN ──
    React.createElement('main', { className: 'main' },
      React.createElement('div', { className: 'topbar' },
        React.createElement('div', { className: 'crumbs' },
          React.createElement('span', { style: { cursor: 'pointer' }, onClick: () => setCurrentView('map') }, sector.sectorName),
          currentView !== 'map' && React.createElement('span', { className: 'sep' }, '/'),
          currentView !== 'map' && React.createElement('span', { className: 'here' }, viewLabels[currentView]),
          currentView === 'map' && mapMode !== 'sector' && React.createElement('span', { className: 'sep' }, '/'),
          currentView === 'map' && mapMode === 'system' && selSystem && React.createElement('span', { className: 'here' }, (selSystem.planets[0]?.name || selSystem.starName) + ' System'),
          currentView === 'map' && mapMode === 'planet' && selPlanet && [
            React.createElement('span', { key: 'ss', className: 'sep' }, '/'),
            React.createElement('span', { key: 'sy', style: { cursor: 'pointer' }, onClick: () => setMapMode('system') }, (selPlanet.system.planets[0]?.name || selPlanet.system.starName) + ' System'),
            React.createElement('span', { key: 'ps', className: 'sep' }, '/'),
            React.createElement('span', { key: 'pl', className: 'here' }, selPlanet.planet.name),
          ]
        ),
        React.createElement('div', { className: 'actions' },
          React.createElement('input', {
            className: 'search', placeholder: 'Search planets…',
            value: search, onChange: e => setSearch(e.target.value),
            onBlur: () => setTimeout(() => setSearch(''), 200),
          }),
          searchResults && searchResults.length > 0 && React.createElement('div', {
            style: { position: 'absolute', top: 44, right: 16, width: 280, background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 6, zIndex: 100, maxHeight: 400, overflowY: 'auto' },
          },
            searchResults.map(p => React.createElement('div', {
              key: p.id, onMouseDown: () => { pickPlanet(p); setSearch(''); },
              style: { padding: '8px 10px', borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' },
              onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-3)',
              onMouseLeave: e => e.currentTarget.style.background = 'transparent',
            },
              React.createElement('div', { style: { fontWeight: 600, color: 'var(--fg-0)', fontSize: 12 } }, p.name),
              React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--fg-3)' } }, p.biome + ' · ' + p.tags.map(t => t.name).join(', '))
            ))
          )
        )
      ),
      React.createElement('div', { className: 'view' }, viewEl)
    ),

    // Tweaks panel
    TP && React.createElement(TP, { title: 'Tweaks' },
      React.createElement(TSec, { title: 'Sector' },
        React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } },
          React.createElement('input', { value: tweaks.seed, onChange: e => setTweak('seed', e.target.value), style: { fontSize: 12, fontFamily: 'JetBrains Mono' } })
        ),
        React.createElement(TBtn, { onClick: regenerate, label: '↻ Reroll with random seed' })
      ),
      React.createElement(TSec, { title: 'Display' },
        React.createElement(TTog, { label: 'Show labels', value: tweaks.showLabels, onChange: v => setTweak('showLabels', v) }),
        React.createElement(TTog, { label: 'Show grid', value: tweaks.showGrid, onChange: v => setTweak('showGrid', v) }),
        React.createElement(TTog, { label: 'Show routes', value: tweaks.showRoutes, onChange: v => setTweak('showRoutes', v) }),
        React.createElement(TTog, { label: 'Auto-rotate planet', value: tweaks.autoRotatePlanet, onChange: v => setTweak('autoRotatePlanet', v) }),
      ),
      React.createElement(TSec, { title: 'Backdrop' },
        React.createElement(TRad, { label: 'Nebula', value: tweaks.starfield, onChange: v => setTweak('starfield', v),
          options: [{ label: 'Warm', value: 'warm' }, { label: 'Cool', value: 'cool' }, { label: 'Teal', value: 'teal' }] })
      )
    ),

    // GM password modal
    gmModal && React.createElement('div', {
      style: { position: 'fixed', inset: 0, background: 'rgba(10,5,7,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
      onClick: e => e.target === e.currentTarget && closeGmModal(),
    },
      React.createElement('div', { style: { background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 10, padding: 28, width: 320, maxWidth: '92vw', display: 'flex', flexDirection: 'column', gap: 12 } },
        React.createElement('div', { style: { fontFamily: 'var(--font-display-alt)', fontWeight: 600, fontSize: 14, color: 'var(--fg-0)', letterSpacing: '0.08em', textTransform: 'uppercase' } },
          gmModal === 'setup' ? '✶ Set GM Password' : gmModal === 'change' ? '✶ Change GM Password' : '✶ GM Mode'
        ),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.6 } },
          gmModal === 'setup' ? 'No GM password is set. Create one to lock GM views.' :
          gmModal === 'change' ? 'Enter and confirm a new GM password.' :
          'Enter the GM password to access GM tools.'
        ),
        React.createElement('input', {
          type: 'password', placeholder: gmModal === 'unlock' ? 'Password…' : 'New password…',
          value: gmPw, autoFocus: true,
          onChange: e => { setGmPw(e.target.value); setGmErr(''); },
          onKeyDown: e => {
            if (e.key === 'Enter') { if (gmModal === 'unlock') submitGMPassword(); else { const el = document.getElementById('gm-pw2-input'); if (el) el.focus(); } }
            if (e.key === 'Escape') closeGmModal();
          },
          style: { fontSize: 13, padding: '8px 10px', background: 'var(--bg-3)', border: '1px solid var(--border-1)', borderRadius: 4, color: 'var(--fg-0)', outline: 'none', width: '100%' },
        }),
        (gmModal === 'setup' || gmModal === 'change') && React.createElement('input', {
          id: 'gm-pw2-input', type: 'password', placeholder: 'Confirm password…',
          value: gmPw2,
          onChange: e => { setGmPw2(e.target.value); setGmErr(''); },
          onKeyDown: e => { if (e.key === 'Enter') submitGMPassword(); if (e.key === 'Escape') closeGmModal(); },
          style: { fontSize: 13, padding: '8px 10px', background: 'var(--bg-3)', border: '1px solid var(--border-1)', borderRadius: 4, color: 'var(--fg-0)', outline: 'none', width: '100%' },
        }),
        gmErr && React.createElement('div', { style: { fontSize: 11, color: 'var(--danger)', fontWeight: 500 } }, gmErr),
        React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 4 } },
          React.createElement('button', { onClick: closeGmModal, style: { flex: 1, fontSize: 12 } }, 'Cancel'),
          React.createElement('button', {
            onClick: submitGMPassword,
            style: { flex: 2, fontSize: 12, background: 'var(--accent)', color: '#1a0d08', border: 'none', fontWeight: 600, borderRadius: 4 },
          }, gmModal === 'setup' ? 'Set Password' : gmModal === 'change' ? 'Change Password' : 'Unlock GM Mode')
        )
      )
    ),

    window.DiceRoller && React.createElement(window.DiceRoller, { open: diceOpen, setOpen: setDiceOpen })
  );
}

function NavItem(icon, active, label, count, onClick) {
  return React.createElement('div', {
    className: 'nav-item' + (active ? ' active' : ''),
    onClick,
  },
    React.createElement('span', { style: { width: 16, textAlign: 'center', color: active ? 'var(--accent)' : 'var(--fg-2)' } }, NAV_ICONS[icon]),
    React.createElement('span', null, label),
    count != null && React.createElement('span', { className: 'nav-count' }, count)
  );
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function updatePlanet(sector, planetId, patch) {
  return { ...sector, systems: sector.systems.map(s => ({ ...s, planets: s.planets.map(p => p.id === planetId ? { ...p, ...patch } : p) })) };
}

function extractEdits(sector) {
  return {
    planets: sector.systems.flatMap(s => s.planets).map(p => ({ id: p.id, name: p.name, notes: p.notes, textureSeed: p.textureSeed })),
    factions: sector.factions.map(f => ({ id: f.id, hp: f.hp, notes: f.notes })),
    npcs: sector.npcs,
    hooks: sector.hooks,
    timeline: sector.timeline,
  };
}

function mergeEdits(sector, edits) {
  let s = sector;
  if (edits.planets) s = { ...s, systems: s.systems.map(sys => ({ ...sys, planets: sys.planets.map(p => { const e = edits.planets.find(x => x.id === p.id); return e ? { ...p, ...e } : p; }) })) };
  if (edits.factions) s = { ...s, factions: s.factions.map(f => ({ ...f, ...(edits.factions.find(x => x.id === f.id) || {}) })) };
  if (edits.npcs) s = { ...s, npcs: edits.npcs };
  if (edits.hooks) s = { ...s, hooks: edits.hooks };
  if (edits.timeline) s = { ...s, timeline: edits.timeline };
  return s;
}

window.App = App;
