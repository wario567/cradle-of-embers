// Main app — sidebar nav, view router, sector state.

const { useState: useASt, useEffect: useAEf, useMemo: useAMem, useRef: useAR } = React;

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str + '\0swn-gm'));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const NAV_ICONS = {
  sector: '⬡',
  system: '◎',
  planet: '◉',
  factions: '⚔',
  npcs: '☥',
  hooks: '✦',
  timeline: '⌛',
  routes: '⇄',
  combat: '⊞',
  gmturn: '✶',
  missions: '⛯',
  encounters: '⚔',
  party: '☉',
};

// Tweak defaults — host rewrites the JSON block on edit.
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
  // Read ?seed=... from URL for invite-link support; fall back to defaults.
  const urlSeed = (() => {
    try { return new URLSearchParams(location.search).get('seed') || null; } catch { return null; }
  })();
  const initialTweaks = urlSeed ? { ...TWEAK_DEFAULTS, seed: urlSeed } : TWEAK_DEFAULTS;
  const [tweaks, setTweak] = tweakHook(initialTweaks);

  const [sector, setSector] = useASt(() => window.generateSector(tweaks.seed));
  const [currentView, setCurrentView] = useASt('sector');
  const [selectedSysHex, setSelectedSysHex] = useASt(null);
  const [selectedPlanetId, setSelectedPlanetId] = useASt(null);
  const [search, setSearch] = useASt('');

  // Campaign state — persisted per seed
  const [party, setParty] = useASt([]);
  const [missions, setMissions] = useASt([]);
  const [encounters, setEncounters] = useASt([]);
  const [gmLog, setGmLog] = useASt([]);

  // Multiplayer panel toggle
  const [mpOpen, setMpOpen] = useASt(false);

  // Dice roller toggle — always-available floating tool.
  const [diceOpen, setDiceOpen] = useASt(false);

  // Role + intro. role: 'player' | 'gm' | null. Intro shows until a role is chosen.
  const [role, setRole] = useASt(() => {
    try { return localStorage.getItem('coe-role'); } catch { return null; }
  });
  const [showIntro, setShowIntro] = useASt(() => {
    try { return !localStorage.getItem('coe-role'); } catch { return true; }
  });

  // GM mode
  const [isGM, setIsGM] = useASt(() => {
    try { return localStorage.getItem('coe-role') === 'gm'; } catch { return false; }
  });
  const [gmModal, setGmModal] = useASt(null); // null | 'unlock' | 'setup' | 'change'
  const [gmPw, setGmPw] = useASt('');
  const [gmPw2, setGmPw2] = useASt('');
  const [gmErr, setGmErr] = useASt('');
  const gmPendingView = useAR(null);
  // When set, a successful GM auth dismisses the intro (vs. navigating to a view).
  const gmAuthDismissesIntro = useAR(false);

  function enterAsPlayer() {
    setRole('player');
    try { localStorage.setItem('coe-role', 'player'); } catch {}
    setIsGM(false);
    setShowIntro(false);
  }
  function enterAsGM() {
    gmAuthDismissesIntro.current = true;
    openGMModal();
  }
  function commitGMRole() {
    setRole('gm');
    try { localStorage.setItem('coe-role', 'gm'); } catch {}
    setIsGM(true);
  }

  // Re-generate when seed changes
  useAEf(() => {
    setSector(window.generateSector(tweaks.seed));
    setSelectedSysHex(null);
    setSelectedPlanetId(null);
  }, [tweaks.seed]);

  // Persist edits to sector locally per seed.
  const storageKey = 'swn-edits-' + tweaks.seed;
  const campaignKey = 'swn-campaign-' + tweaks.seed;
  useAEf(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSector(s => mergeEdits(s, JSON.parse(raw)));
    } catch {}
    try {
      const raw = localStorage.getItem(campaignKey);
      if (raw) {
        const camp = JSON.parse(raw);
        setParty(camp.party || []);
        setMissions(camp.missions || []);
        setEncounters(camp.encounters || []);
        setGmLog(camp.gmLog || []);
      } else {
        setParty([]); setMissions([]); setEncounters([]); setGmLog([]);
      }
    } catch {}
  }, [storageKey, campaignKey]);

  // Redirect off GM views when GM mode is locked
  useAEf(() => {
    if (!isGM && ['gmturn', 'missions', 'encounters'].includes(currentView)) setCurrentView('sector');
  }, [isGM]);

  // --- GM mode functions ---
  function openGMModal() {
    const stored = localStorage.getItem('swn-gm-hash');
    setGmModal(stored ? 'unlock' : 'setup');
  }
  function closeGmModal() {
    setGmModal(null); setGmPw(''); setGmPw2(''); setGmErr('');
    gmAuthDismissesIntro.current = false;
  }
  // Shared success path for setup/unlock: become GM, then either dismiss the
  // intro (if auth was triggered from the splash) or navigate to a pending view.
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
      localStorage.setItem(GM_KEY, await sha256(gmPw));
      onGMAuthSuccess();
    } else if (gmModal === 'unlock') {
      if (!gmPw) return setGmErr('Enter password.');
      if (await sha256(gmPw) === stored) {
        onGMAuthSuccess();
      } else {
        setGmErr('Incorrect password.');
      }
    } else if (gmModal === 'change') {
      if (!gmPw) return setGmErr('Enter new password.');
      if (gmPw !== gmPw2) return setGmErr('Passwords do not match.');
      localStorage.setItem(GM_KEY, await sha256(gmPw));
      closeGmModal();
    }
  }
  function tryGMView(view) {
    if (isGM) { setCurrentView(view); return; }
    gmPendingView.current = view;
    openGMModal();
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

  // Bundle current campaign state for multiplayer sync.
  const campaignState = useAMem(() => ({
    sectorEdits: extractEdits(sector),
    party, missions, encounters, gmLog,
  }), [sector, party, missions, encounters, gmLog]);

  function applyRemoteCampaign(data) {
    if (!data) return;
    if (data.sectorEdits) {
      setSector(prev => mergeEdits(prev, data.sectorEdits));
      try { localStorage.setItem(storageKey, JSON.stringify(data.sectorEdits)); } catch {}
    }
    if (data.party) setParty(data.party);
    if (data.missions) setMissions(data.missions);
    if (data.encounters) setEncounters(data.encounters);
    if (data.gmLog) setGmLog(data.gmLog);
    try {
      localStorage.setItem(campaignKey, JSON.stringify({
        party: data.party || party, missions: data.missions || missions,
        encounters: data.encounters || encounters, gmLog: data.gmLog || gmLog,
      }));
    } catch {}
  }

  const allPlanets = useAMem(() => sector.systems.flatMap(s => s.planets.map(p => ({ p, s: sector.systems.find(ss => ss.planets.includes(p)) }))), [sector]);
  const selSystem = sector.systems.find(s => s.hexId === selectedSysHex) || null;
  const selPlanet = (() => {
    if (!selectedPlanetId) return null;
    for (const s of sector.systems) {
      const p = s.planets.find(p => p.id === selectedPlanetId);
      if (p) return { planet: p, system: s };
    }
    return null;
  })();

  function pickPlanet(planet) {
    const sys = sector.systems.find(s => s.planets.some(p => p.id === planet.id));
    setSelectedSysHex(sys.hexId);
    setSelectedPlanetId(planet.id);
    setCurrentView('planet');
  }
  function pickSystem(hex) {
    setSelectedSysHex(hex);
    setCurrentView('system');
  }

  function regenerate() {
    const newSeed = Math.random().toString(36).slice(2, 10);
    setTweak('seed', newSeed);
  }

  // Filtered search results
  const searchResults = useAMem(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const planets = allPlanets.filter(({ p }) =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.name.toLowerCase().includes(q)) ||
      p.biome.includes(q)
    ).slice(0, 10);
    return planets;
  }, [search, allPlanets]);

  const crumbs = (() => {
    const labels = { gmturn: 'GM Turn', missions: 'Mission Forge', encounters: 'Encounter Forge', party: 'Party', combat: 'Combat Map', npcs: 'NPCs', hooks: 'Hooks', timeline: 'Timeline', routes: 'Trade Routes', factions: 'Factions' };
    const c = [{ label: sector.sectorName, view: 'sector' }];
    if (currentView === 'system' && selSystem) c.push({ label: (selSystem.planets[0]?.name || selSystem.starName) + ' System', view: 'system' });
    else if (currentView === 'planet' && selPlanet) {
      c.push({ label: (selPlanet.system.planets[0]?.name || selPlanet.system.starName) + ' System', view: 'system' });
      c.push({ label: selPlanet.planet.name, view: 'planet' });
    } else if (currentView !== 'sector') c.push({ label: labels[currentView] || capitalize(currentView), view: currentView });
    return c;
  })();

  // Main view
  let viewEl = null;
  if (currentView === 'sector') {
    viewEl = React.createElement(window.SectorMap, {
      sector, selectedHex: selectedSysHex,
      onSelect: pickSystem,
      showLabels: tweaks.showLabels, showGrid: tweaks.showGrid, showRoutes: tweaks.showRoutes,
    });
  } else if (currentView === 'system' && selSystem) {
    viewEl = React.createElement(window.SystemView, { system: selSystem, onPickPlanet: pickPlanet });
  } else if (currentView === 'planet' && selPlanet) {
    viewEl = React.createElement(window.PlanetView, {
      system: selPlanet.system,
      planet: selPlanet.planet,
      autoRotate: tweaks.autoRotatePlanet,
      onUpdate: patch => saveEdits(s => updatePlanet(s, selPlanet.planet.id, patch)),
      onSelectPlanet: pickPlanet,
      onRerollTexture: () => saveEdits(s => updatePlanet(s, selPlanet.planet.id, { textureSeed: Math.floor(Math.random() * 100000) })),
    });
  } else if (currentView === 'factions') {
    viewEl = React.createElement(window.FactionsView, {
      sector,
      onUpdate: f => saveEdits(s => ({ ...s, factions: s.factions.map(x => x.id === f.id ? f : x) })),
      onPickPlanet: pickPlanet,
    });
  } else if (currentView === 'npcs') {
    viewEl = React.createElement(window.NPCsView, {
      sector,
      onUpdate: n => saveEdits(s => ({ ...s, npcs: s.npcs.map(x => x.id === n.id ? n : x) })),
      onAddNPC: () => {
        let created;
        saveEdits(s => {
          const SWN = window.SWN;
          const id = 'npc-' + Math.floor(Math.random() * 99999);
          created = { id, name: SWN.firstNames[Math.floor(Math.random() * SWN.firstNames.length)] + ' ' + SWN.lastNames[Math.floor(Math.random() * SWN.lastNames.length)], role: SWN.npcRoles[Math.floor(Math.random() * SWN.npcRoles.length)], trait: SWN.npcTraits[Math.floor(Math.random() * SWN.npcTraits.length)], goal: SWN.npcGoals[Math.floor(Math.random() * SWN.npcGoals.length)], hp: 8, notes: '' };
          return { ...s, npcs: [created, ...s.npcs] };
        });
        return created;
      },
      onDeleteNPC: id => saveEdits(s => ({ ...s, npcs: s.npcs.filter(n => n.id !== id) })),
      onPickPlanet: pickPlanet,
    });
  } else if (currentView === 'hooks') {
    viewEl = React.createElement(window.HooksView, {
      sector,
      onUpdate: h => saveEdits(s => ({ ...s, hooks: s.hooks.map(x => x.id === h.id ? h : x) })),
      onAdd: () => saveEdits(s => {
        const rng = window.makeRNG(tweaks.seed + '-newhook-' + Date.now());
        const planets = s.systems.flatMap(x => x.planets);
        const p = rng.pick(planets);
        const SWN = window.SWN;
        const hook = {
          id: 'hook-' + Math.floor(Math.random() * 99999),
          planetId: p.id, planetName: p.name,
          text: cap(rng.pick(SWN.hookActions)) + ' ' + rng.pick(SWN.hookObjects) + ' on ' + p.name + ', ' + rng.pick(SWN.hookComplications) + '.',
          status: 'Open',
        };
        return { ...s, hooks: [hook, ...s.hooks] };
      }),
      onPickPlanet: pickPlanet,
    });
  } else if (currentView === 'timeline') {
    viewEl = React.createElement(window.TimelineView, {
      sector,
      onUpdate: e => saveEdits(s => ({ ...s, timeline: s.timeline.map(x => x.id === e.id ? e : x) })),
      onAdd: () => saveEdits(s => ({ ...s, timeline: [{ id: 'evt-' + Math.floor(Math.random() * 99999), year: 3200, text: 'New event…' }, ...s.timeline] })),
    });
  } else if (currentView === 'routes') {
    viewEl = React.createElement(window.RoutesView, { sector, onPickPlanet: pickPlanet });
  } else if (currentView === 'combat') {
    viewEl = React.createElement(window.CombatView, null);
  } else if (currentView === 'gmturn') {
    viewEl = React.createElement(window.GMTurnView, {
      sector,
      log: gmLog,
      onLog: entry => {
        if (entry === '__clear__') return saveCampaign({ gmLog: [] });
        saveCampaign({ gmLog: [entry, ...gmLog] });
      },
      onUpdateFaction: f => saveEdits(s => ({ ...s, factions: s.factions.map(x => x.id === f.id ? f : x) })),
      onPickPlanet: pickPlanet,
    });
  } else if (currentView === 'missions') {
    viewEl = React.createElement(window.MissionGeneratorView, {
      sector, missions,
      onSaveMission: m => saveCampaign({ missions: [m, ...missions] }),
      onDeleteMission: id => saveCampaign({ missions: missions.filter(m => m.id !== id) }),
      onPickPlanet: pickPlanet,
    });
  } else if (currentView === 'encounters') {
    viewEl = React.createElement(window.EncounterGeneratorView, {
      sector, party, encounters,
      onSave: e => saveCampaign({ encounters: [e, ...encounters] }),
      onDelete: id => saveCampaign({ encounters: encounters.filter(e => e.id !== id) }),
      onLoadToCombat: enc => { setCurrentView('combat'); /* future: actually load tokens */ alert('Combat map will get an encounter-import feature soon. For now, copy enemy stats manually.'); },
    });
  } else if (currentView === 'party') {
    viewEl = React.createElement(window.CharacterSheetsView, {
      party,
      onSave: c => saveCampaign({ party: party.find(p => p.id === c.id) ? party.map(p => p.id === c.id ? c : p) : [...party, c] }),
      onDelete: id => saveCampaign({ party: party.filter(p => p.id !== id) }),
    });
  } else if (currentView === 'system' || currentView === 'planet') {
    viewEl = React.createElement('div', { className: 'empty' }, 'Select a system on the map.');
  }

  // Tweaks panel (right side)
  const TP = window.TweaksPanel;
  const TSec = window.TweakSection;
  const TTog = window.TweakToggle;
  const TRad = window.TweakRadio;
  const TBtn = window.TweakButton;

  return React.createElement('div', { className: 'app', 'data-screen-label': 'app' },
    React.createElement(window.Starfield, { viewKey: currentView + (selectedPlanetId || selectedSysHex || ''), intensity: 1, palette: tweaks.starfield }),
    // Intro / role gate — entry point for both players and GM.
    showIntro && window.IntroScreen && React.createElement(window.IntroScreen, {
      sector, seed: tweaks.seed,
      onEnter: r => r === 'gm' ? enterAsGM() : enterAsPlayer(),
    }),
    // Sidebar
    React.createElement('aside', { className: 'sidebar' },
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'brand', onClick: () => setShowIntro(true), style: { cursor: 'pointer' }, title: 'Replay intro' },
          React.createElement('div', { className: 'brand-mark' },
            React.createElement('svg', { viewBox: '0 0 22 22', width: 22, height: 22 },
              React.createElement('polygon', { points: '11,1 21,7 21,15 11,21 1,15 1,7', fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.5 }),
              React.createElement('circle', { cx: 11, cy: 11, r: 3, fill: 'var(--accent)' })
            )
          ),
          'SWN CAMPAIGN'
        ),
        React.createElement('div', { className: 'sector-name' }, sector.sectorName),
        React.createElement('div', { className: 'seed' }, 'seed: ' + tweaks.seed)
      ),
      React.createElement('nav', { className: 'nav' },
        React.createElement('div', { className: 'nav-section' },
          React.createElement('div', { className: 'nav-label' }, 'CARTOGRAPHY'),
          NavItem('sector', currentView === 'sector', 'Sector Map', sector.systems.length, () => setCurrentView('sector')),
          NavItem('system', currentView === 'system', 'System View', null, () => selSystem ? setCurrentView('system') : null, !selSystem),
          NavItem('planet', currentView === 'planet', 'Planet View', null, () => selPlanet ? setCurrentView('planet') : null, !selPlanet),
          NavItem('routes', currentView === 'routes', 'Trade Routes', sector.routes.length, () => setCurrentView('routes')),
        ),
        React.createElement('div', { className: 'nav-section' },
          React.createElement('div', { className: 'nav-label' }, 'CAMPAIGN'),
          NavItem('factions', currentView === 'factions', 'Factions', sector.factions.length, () => setCurrentView('factions')),
          NavItem('npcs', currentView === 'npcs', 'NPCs', sector.npcs.length, () => setCurrentView('npcs')),
          NavItem('hooks', currentView === 'hooks', 'Hooks', sector.hooks.length, () => setCurrentView('hooks')),
          NavItem('timeline', currentView === 'timeline', 'Timeline', sector.timeline.length, () => setCurrentView('timeline')),
        ),
        // GM Tools — only rendered for the GM. Players never see this section.
        isGM && React.createElement('div', { className: 'nav-section' },
          React.createElement('div', { className: 'nav-label', style: { display: 'flex', alignItems: 'center' } },
            'GM TOOLS',
            React.createElement('span', { style: { marginLeft: 'auto', opacity: 0.55, fontSize: 10, letterSpacing: 0 } }, '🔓')
          ),
          NavItem('gmturn', currentView === 'gmturn', 'GM Turn', gmLog.length || null, () => tryGMView('gmturn')),
          NavItem('missions', currentView === 'missions', 'Mission Forge', missions.length || null, () => tryGMView('missions')),
          NavItem('encounters', currentView === 'encounters', 'Encounter Forge', encounters.length || null, () => tryGMView('encounters')),
        ),
        React.createElement('div', { className: 'nav-section' },
          React.createElement('div', { className: 'nav-label' }, 'PLAY'),
          NavItem('party', currentView === 'party', 'Party', party.length || null, () => setCurrentView('party')),
          NavItem('combat', currentView === 'combat', 'Combat Map', null, () => setCurrentView('combat')),
        )
      ),
      React.createElement('div', { className: 'sidebar-footer', style: { flexDirection: 'column', gap: 8 } },
        React.createElement('div', { style: { display: 'flex', gap: 6, width: '100%' } },
          React.createElement('button', { onClick: regenerate, style: { flex: 1, fontSize: 11 }, title: 'Generate a new sector with a random seed' }, '↻ New'),
          React.createElement('button', {
            onClick: () => {
              const data = {
                seed: tweaks.seed,
                sector: extractEdits(sector),
                party, missions, encounters, gmLog,
                exportedAt: new Date().toISOString(),
                app: 'SWN Campaign — Cradle of Embers',
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `cradle-of-embers-${tweaks.seed}.json`;
              a.click();
              URL.revokeObjectURL(url);
            },
            title: 'Download this campaign as a JSON file',
            style: { flex: 1, fontSize: 11 },
          }, '↓ Export'),
          React.createElement('button', {
            onClick: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json,.json';
              input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const text = await file.text();
                try {
                  const data = JSON.parse(text);
                  if (data.seed) {
                    if (data.sector) localStorage.setItem('swn-edits-' + data.seed, JSON.stringify(data.sector));
                    if (data.party || data.missions || data.encounters || data.gmLog) {
                      localStorage.setItem('swn-campaign-' + data.seed, JSON.stringify({
                        party: data.party || [], missions: data.missions || [],
                        encounters: data.encounters || [], gmLog: data.gmLog || [],
                      }));
                    }
                    setTweak('seed', data.seed);
                    alert('Imported campaign for seed: ' + data.seed);
                  } else { alert('Not a valid campaign export.'); }
                } catch (err) { alert('Could not parse file: ' + err.message); }
              };
              input.click();
            },
            title: 'Import a campaign JSON file',
            style: { flex: 1, fontSize: 11 },
          }, '↑ Import')
        ),
        // Role control — GM sees a switch-to-player + change-password; players see an unlock.
        React.createElement('div', { style: { display: 'flex', gap: 6, width: '100%' } },
          isGM
            ? [
                React.createElement('button', {
                  key: 'lock',
                  onClick: enterAsPlayer,
                  style: { flex: 1, fontSize: 11, borderColor: 'var(--accent)', color: 'var(--accent)' },
                  title: 'Switch to player view (keeps your GM password)',
                }, '🔓 GM · switch to Player'),
                React.createElement('button', {
                  key: 'chpw',
                  onClick: () => { setGmPw(''); setGmPw2(''); setGmErr(''); setGmModal('change'); },
                  style: { fontSize: 11, padding: '6px 8px' },
                  title: 'Change GM password',
                }, '⚙'),
              ]
            : React.createElement('button', {
                onClick: enterAsGM,
                style: { flex: 1, fontSize: 11 },
                title: 'Enter GM mode (password required)',
              }, '🔒 Enter GM Mode'),
        ),
        // Multiplayer (compact button or opens overlay)
        window.MultiplayerPanel && React.createElement(window.MultiplayerPanel, {
          seed: tweaks.seed,
          campaignState,
          onRemoteCampaign: applyRemoteCampaign,
          open: mpOpen,
          setOpen: setMpOpen,
        })
      )
    ),
    // Main
    React.createElement('main', { className: 'main' },
      React.createElement('div', { className: 'topbar' },
        React.createElement('div', { className: 'crumbs' },
          ...crumbs.flatMap((c, i) => {
            const arr = [];
            if (i > 0) arr.push(React.createElement('span', { key: 's' + i, className: 'sep' }, '/'));
            arr.push(React.createElement('span', {
              key: 'c' + i,
              className: i === crumbs.length - 1 ? 'here' : '',
              style: { cursor: 'pointer' },
              onClick: () => setCurrentView(c.view),
            }, c.label));
            return arr;
          })
        ),
        React.createElement('div', { className: 'actions' },
          React.createElement('input', {
            className: 'search',
            placeholder: 'Search planets, tags, biomes…',
            value: search,
            onChange: e => setSearch(e.target.value),
            onBlur: () => setTimeout(() => setSearch(''), 200),
          }),
          searchResults && searchResults.length > 0 && React.createElement('div', { style: { position: 'absolute', top: 44, right: 16, width: 280, background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 6, zIndex: 100, maxHeight: 400, overflowY: 'auto' } },
            searchResults.map(({ p, s }) => React.createElement('div', {
              key: p.id,
              onMouseDown: () => { pickPlanet(p); setSearch(''); },
              style: { padding: '8px 10px', borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' },
              onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-3)',
              onMouseLeave: e => e.currentTarget.style.background = 'transparent',
            },
              React.createElement('div', { style: { fontWeight: 600, color: 'var(--fg-0)', fontSize: 12 } }, p.name),
              React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--fg-3)' } }, s.hexId + ' · ' + p.biome + ' · ' + p.tags.map(t => t.name).join(', '))
            ))
          )
        )
      ),
      React.createElement('div', { className: 'view' }, viewEl)
    ),

    // Tweaks
    TP && React.createElement(TP, { title: 'Tweaks' },
      React.createElement(TSec, { title: 'Sector' },
        React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } },
          React.createElement('input', {
            value: tweaks.seed,
            onChange: e => setTweak('seed', e.target.value),
            style: { fontSize: 12, fontFamily: 'JetBrains Mono' },
          })
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

    // Multiplayer panel renders from within sidebar footer above.

    // GM password modal
    gmModal && React.createElement('div', {
      style: { position: 'fixed', inset: 0, background: 'rgba(10,5,7,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
      onClick: e => e.target === e.currentTarget && closeGmModal(),
    },
      React.createElement('div', { style: { background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 10, padding: 28, width: 320, display: 'flex', flexDirection: 'column', gap: 12 } },
        React.createElement('div', { style: { fontFamily: 'var(--font-display-alt)', fontWeight: 600, fontSize: 14, color: 'var(--fg-0)', letterSpacing: '0.08em', textTransform: 'uppercase' } },
          gmModal === 'setup' ? '✶ Set GM Password' : gmModal === 'change' ? '✶ Change GM Password' : '✶ GM Mode'
        ),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.6 } },
          gmModal === 'setup' ? 'No GM password is set yet. Create one to lock GM-only views from players.' :
          gmModal === 'change' ? 'Enter and confirm a new GM password.' :
          'Enter the GM password to access GM Turn, Mission Forge, and Encounter Forge.'
        ),
        React.createElement('input', {
          type: 'password',
          placeholder: gmModal === 'unlock' ? 'Password…' : 'New password…',
          value: gmPw,
          autoFocus: true,
          onChange: e => { setGmPw(e.target.value); setGmErr(''); },
          onKeyDown: e => {
            if (e.key === 'Enter') {
              if (gmModal === 'unlock') submitGMPassword();
              else { const el = document.getElementById('gm-pw2-input'); if (el) el.focus(); }
            }
            if (e.key === 'Escape') closeGmModal();
          },
          style: { fontSize: 13, padding: '8px 10px', background: 'var(--bg-3)', border: '1px solid var(--border-1)', borderRadius: 4, color: 'var(--fg-0)', outline: 'none', width: '100%' },
        }),
        (gmModal === 'setup' || gmModal === 'change') && React.createElement('input', {
          id: 'gm-pw2-input',
          type: 'password',
          placeholder: 'Confirm password…',
          value: gmPw2,
          onChange: e => { setGmPw2(e.target.value); setGmErr(''); },
          onKeyDown: e => {
            if (e.key === 'Enter') submitGMPassword();
            if (e.key === 'Escape') closeGmModal();
          },
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

    // Dice roller — always-available floating tool for players and GM.
    window.DiceRoller && React.createElement(window.DiceRoller, { open: diceOpen, setOpen: setDiceOpen })
  );
}

function NavItem(icon, active, label, count, onClick, disabled) {
  return React.createElement('div', {
    className: 'nav-item' + (active ? ' active' : ''),
    onClick: disabled ? null : onClick,
    style: disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {},
  },
    React.createElement('span', { style: { width: 16, textAlign: 'center', color: active ? 'var(--accent)' : 'var(--fg-2)' } }, NAV_ICONS[icon]),
    React.createElement('span', null, label),
    count != null && React.createElement('span', { className: 'nav-count' }, count)
  );
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function cap(s) { return capitalize(s); }

// Deep edit utilities
function updatePlanet(sector, planetId, patch) {
  return {
    ...sector,
    systems: sector.systems.map(s => ({
      ...s,
      planets: s.planets.map(p => p.id === planetId ? { ...p, ...patch } : p),
    })),
  };
}

// Extract user edits (only fields user changes) — for localStorage persistence.
function extractEdits(sector) {
  return {
    planets: sector.systems.flatMap(s => s.planets).map(p => ({
      id: p.id, name: p.name, notes: p.notes, textureSeed: p.textureSeed,
    })),
    factions: sector.factions.map(f => ({ id: f.id, hp: f.hp, notes: f.notes })),
    npcs: sector.npcs,
    hooks: sector.hooks,
    timeline: sector.timeline,
  };
}
function mergeEdits(sector, edits) {
  let s = sector;
  if (edits.planets) {
    s = {
      ...s,
      systems: s.systems.map(sys => ({
        ...sys,
        planets: sys.planets.map(p => {
          const e = edits.planets.find(x => x.id === p.id);
          return e ? { ...p, ...e } : p;
        }),
      })),
    };
  }
  if (edits.factions) s = { ...s, factions: s.factions.map(f => ({ ...f, ...(edits.factions.find(x => x.id === f.id) || {}) })) };
  if (edits.npcs) s = { ...s, npcs: edits.npcs };
  if (edits.hooks) s = { ...s, hooks: edits.hooks };
  if (edits.timeline) s = { ...s, timeline: edits.timeline };
  return s;
}

window.App = App;
