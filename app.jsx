// Main app — sidebar nav, view router, sector state.

const { useState: useASt, useEffect: useAEf, useMemo: useAMem, useRef: useAR } = React;

// ── GM NOTES VIEW ────────────────────────────────────────────────────────────
function GMNotesView({ sector }) {
  const lore = window.GM_LORE;
  const [tab, setGMTab] = useASt('sector');
  const [expandedFaction, setExpandedFaction] = useASt(null);
  const [expandedTurn, setExpandedTurn] = useASt(null);

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
  const pcsTab = React.createElement('div', null,
    (lore.playerCharacters || []).map(pc => card([
      React.createElement('h4', { style: { margin: '0 0 6px', color: 'var(--fg-0)' } }, pc.playerName),
      label('Concept'), prose(pc.characterConcept),
      label('GM Notes'), prose(pc.gmNotes),
      pc.moralChallenges && pc.moralChallenges.length && React.createElement('div', { style: { marginTop: 8 } },
        label('Moral Challenges'),
        React.createElement('ul', { style: { margin: '4px 0 0', paddingLeft: 18 } }, pc.moralChallenges.map((c, i) => bullet(c))),
      ),
    ]))
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
    React.createElement('div', { style: { marginBottom: 6 } }, label('Session Beats')),
    (s1.beats || []).map(b => card([
      React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 } },
        React.createElement('span', { style: { fontWeight: 700, fontSize: 13, color: 'var(--accent)' } }, 'Beat ' + b.beat),
        React.createElement('span', { style: { fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, b.title),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--fg-4)' } }, b.type),
      ),
      b.gmNotes && prose(b.gmNotes),
    ])),
  ) : null;

  const tabs = ['sector', 'factions', 'turns', 'pcs', 'session1'];
  const tabLabels = { sector: 'Sector', factions: 'Factions', turns: 'S0 Turns', pcs: 'PCs', session1: 'Session 1' };

  return React.createElement('div', { style: { padding: '20px 24px', maxWidth: 860, margin: '0 auto' } },
    React.createElement('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 18 } },
      tabs.map(t => React.createElement('button', { key: t, onClick: () => setGMTab(t), style: tabStyle(tab === t) }, tabLabels[t]))
    ),
    tab === 'sector'   && sectorTab,
    tab === 'factions' && factionsTab,
    tab === 'turns'    && turnsTab,
    tab === 'pcs'      && pcsTab,
    tab === 'session1' && session1Tab,
  );
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str + '\0swn-gm'));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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

  function openGMModal() { const stored = localStorage.getItem('swn-gm-hash'); setGmModal(stored ? 'unlock' : 'setup'); }
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
    if (gmModal === 'setup') {
      if (!gmPw) return setGmErr('Enter a password.');
      if (gmPw !== gmPw2) return setGmErr('Passwords do not match.');
      localStorage.setItem(GM_KEY, await sha256(gmPw)); onGMAuthSuccess();
    } else if (gmModal === 'unlock') {
      if (!gmPw) return setGmErr('Enter password.');
      if (await sha256(gmPw) === stored) { onGMAuthSuccess(); } else { setGmErr('Incorrect password.'); }
    } else if (gmModal === 'change') {
      if (!gmPw) return setGmErr('Enter new password.');
      if (gmPw !== gmPw2) return setGmErr('Passwords do not match.');
      localStorage.setItem(GM_KEY, await sha256(gmPw)); closeGmModal();
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
