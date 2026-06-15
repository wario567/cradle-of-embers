// AI Mission Generator + Encounter Generator + Character Sheets.

const { useState: useMGs, useMemo: useMGm } = React;

// ─── MISSION GENERATOR ───────────────────────────────────────────────────────
function MissionGeneratorView({ sector, missions = [], onSaveMission, onDeleteMission, onPickPlanet }) {
  const [prompt, setPrompt] = useMGs('');
  const [tone, setTone] = useMGs('Investigation');
  const [length, setLength] = useMGs('One-shot');
  const [tying, setTying] = useMGs('Any faction');
  const [thinking, setThinking] = useMGs(false);
  const [draft, setDraft] = useMGs(null);

  async function generate() {
    setThinking(true);
    setDraft(null);
    const factionsList = sector.factions.map(f => `${f.name} (${f.traits.join('/')}, goal: ${f.goal})`).join('\n');
    const planetsList = sector.systems.flatMap(s => s.planets).slice(0, 14).map(p => `${p.name} (${p.biome}, tags: ${p.tags.map(t=>t.name).join(', ')})`).join('\n');
    const hooksList = sector.hooks.filter(h => h.status !== 'Resolved').slice(0, 6).map(h => `- ${h.planetName}: ${h.text}`).join('\n');
    const tyingPick = tying === 'Any faction' ? '(pick the most thematically appropriate)' : tying;

    const aiPrompt = `You are a Stars Without Number GM generating a mission for the Cradle of Embers sector — an ancient ember-lit nebula, a stellar nursery where worlds still coalesce from glowing dust amid Mandate ruins.

GM's seed idea: ${prompt || '(open-ended; pick something fresh)'}
Tone: ${tone}
Length: ${length}
Tie to faction: ${tyingPick}

SECTOR FACTIONS:
${factionsList}

SAMPLE PLANETS:
${planetsList}

ACTIVE HOOKS (avoid repeating these):
${hooksList || '(none)'}

Generate a complete mission. Return JSON shaped exactly:
{
  "title": "punchy mission title (max 6 words)",
  "tagline": "one-sentence pitch",
  "location": "specific planet from the list above (just the planet name)",
  "patron": "who sends or finds the PCs (name + 1-line motivation)",
  "objective": "what the PCs must accomplish",
  "complications": ["3 to 4 things that go wrong or escalate"],
  "factionAngle": "which sector faction is secretly behind / opposed / affected, and how",
  "twist": "a mid-mission reveal that recontextualizes things",
  "stakes": "what happens if PCs succeed vs. fail",
  "rewards": "credits, info, contacts, or relics gained"
}`;

    const result = await window.askClaudeJSON(aiPrompt, null);
    setDraft(result);
    setThinking(false);
  }

  function save() {
    if (!draft) return;
    const planet = sector.systems.flatMap(s => s.planets).find(p => p.name === draft.location);
    onSaveMission({
      id: 'mis-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      ...draft,
      planetId: planet?.id,
      status: 'Drafted',
      created: Date.now(),
    });
    setDraft(null);
    setPrompt('');
  }

  return React.createElement('div', { style: { padding: 28, height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { marginBottom: 18 } },
      React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: 'var(--fg-0)' } }, 'Mission Forge'),
      React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } }, 'Type a seed; the Oracle weaves it into a full mission anchored to sector factions & worlds.')
    ),

    // Input panel
    React.createElement('div', { className: 'panel', style: { marginBottom: 18, maxWidth: 900 } },
      React.createElement('div', { className: 'panel-body' },
        React.createElement('textarea', {
          value: prompt,
          onChange: e => setPrompt(e.target.value),
          placeholder: 'e.g. "the players find a Mandate-era cold-sleep pod in a Coalsong cargo manifest" — or leave blank to roll fresh.',
          rows: 3,
          style: { marginBottom: 12, fontSize: 14 },
        }),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 } },
          React.createElement('label', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'Tone',
            React.createElement('select', { value: tone, onChange: e => setTone(e.target.value), style: { marginTop: 4 } },
              ['Investigation', 'Heist', 'Combat', 'Diplomacy', 'Horror', 'Exploration', 'Rescue', 'Sabotage'].map(t => React.createElement('option', { key: t }, t))
            )
          ),
          React.createElement('label', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'Length',
            React.createElement('select', { value: length, onChange: e => setLength(e.target.value), style: { marginTop: 4 } },
              ['One-shot', 'Two-session arc', 'Long arc (4+ sessions)'].map(t => React.createElement('option', { key: t }, t))
            )
          ),
          React.createElement('label', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'Faction tie',
            React.createElement('select', { value: tying, onChange: e => setTying(e.target.value), style: { marginTop: 4 } },
              React.createElement('option', null, 'Any faction'),
              sector.factions.map(f => React.createElement('option', { key: f.id }, f.name))
            )
          )
        ),
        React.createElement('button', { className: 'primary', disabled: thinking, onClick: generate, style: { fontSize: 13 } },
          thinking ? '⌛ The Oracle is weaving…' : '✦ Generate Mission')
      )
    ),

    // Draft preview
    draft && React.createElement('div', { className: 'panel', style: { marginBottom: 18, maxWidth: 900, border: '1px solid rgba(255,148,87,0.35)', boxShadow: '0 0 24px rgba(255,148,87,0.1)' } },
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--accent)' } }, draft.title || 'Untitled Mission'),
        React.createElement('div', { style: { fontSize: 14, color: 'var(--fg-1)', fontStyle: 'italic', marginTop: 4, marginBottom: 12 } }, draft.tagline),
        React.createElement(MissionBody, { mission: draft, sector, onPickPlanet }),
        React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 14 } },
          React.createElement('button', { className: 'primary', onClick: save }, '✚ Save Mission'),
          React.createElement('button', { onClick: () => setDraft(null) }, 'Discard'),
          React.createElement('button', { onClick: generate, disabled: thinking }, '↻ Reroll')
        )
      )
    ),

    // Saved missions
    missions.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8 } }, missions.length + ' SAVED MISSIONS'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 14 } },
        missions.map(m => React.createElement('div', { key: m.id, className: 'panel' },
          React.createElement('div', { className: 'panel-title' },
            React.createElement('span', null, m.title),
            React.createElement('button', { className: 'ghost danger', style: { marginLeft: 'auto', fontSize: 11 }, onClick: () => onDeleteMission(m.id) }, '×')
          ),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('div', { style: { fontSize: 12.5, fontStyle: 'italic', color: 'var(--fg-2)', marginBottom: 10 } }, m.tagline),
            React.createElement(MissionBody, { mission: m, sector, onPickPlanet })
          )
        ))
      )
    )
  );
}

function MissionBody({ mission, sector, onPickPlanet }) {
  function clickPlanet() {
    const p = sector.systems.flatMap(s => s.planets).find(p => p.name === mission.location);
    if (p) onPickPlanet(p);
  }
  return React.createElement('div', null,
    React.createElement('div', { className: 'kv', style: { marginBottom: 8 } },
      React.createElement('div', { className: 'k' }, 'Location'),
      React.createElement('div', { className: 'v' }, React.createElement('span', { style: { color: 'var(--accent)', cursor: 'pointer' }, onClick: clickPlanet }, mission.location)),
      React.createElement('div', { className: 'k' }, 'Patron'),
      React.createElement('div', { className: 'v' }, mission.patron),
      React.createElement('div', { className: 'k' }, 'Objective'),
      React.createElement('div', { className: 'v' }, mission.objective),
      React.createElement('div', { className: 'k' }, 'Faction'),
      React.createElement('div', { className: 'v' }, mission.factionAngle),
      React.createElement('div', { className: 'k' }, 'Twist'),
      React.createElement('div', { className: 'v', style: { color: 'var(--accent-2)' } }, mission.twist),
      React.createElement('div', { className: 'k' }, 'Stakes'),
      React.createElement('div', { className: 'v' }, mission.stakes),
      React.createElement('div', { className: 'k' }, 'Reward'),
      React.createElement('div', { className: 'v' }, mission.rewards)
    ),
    mission.complications?.length > 0 && React.createElement('div', { style: { marginTop: 6 } },
      React.createElement('div', { style: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 4 } }, 'Complications'),
      React.createElement('ul', { style: { margin: 0, paddingLeft: 20, fontSize: 12.5, color: 'var(--fg-1)' } },
        mission.complications.map((c, i) => React.createElement('li', { key: i, style: { marginBottom: 3 } }, c))
      )
    )
  );
}

// ─── ENCOUNTER GENERATOR ─────────────────────────────────────────────────────
const BIOME_ENEMY_HINTS = {
  rocky: ['rad-hounded raiders', 'sand-pirates', 'badlands cult', 'mining bots gone rogue'],
  temperate: ['regional militia', 'urban gang', 'corporate enforcers', 'religious zealots'],
  ice: ['rimewalker raiders', 'frostfauna pack', 'cryostasis cult', 'abandoned automatons'],
  molten: ['heat-suited cultists', 'lava-spawn beasts', 'salvager warband', 'fire-cult assassins'],
  toxic: ['masked smugglers', 'mutant fauna', 'pretech revenants', 'chem-cult priests'],
  engineered: ['hivemind drones', 'rogue gardener constructs', 'feral spliced creatures'],
  desert: ['sand-cult raiders', 'beast-tamers', 'nomad warband', 'water-pirates'],
  ocean: ['surface pirates', 'deep-sect cultists', 'aquatic megafauna', 'pirate submersibles'],
};

function EncounterGeneratorView({ sector, party, encounters = [], onSave, onDelete, onLoadToCombat }) {
  const [planetId, setPlanetId] = useMGs(() => sector.systems.flatMap(s => s.planets)[0]?.id);
  const [difficulty, setDifficulty] = useMGs('Standard');
  const [theme, setTheme] = useMGs('');
  const [thinking, setThinking] = useMGs(false);
  const [draft, setDraft] = useMGs(null);

  const planet = sector.systems.flatMap(s => s.planets).find(p => p.id === planetId);

  async function generate() {
    if (!planet) return;
    setThinking(true);
    setDraft(null);

    const partyLevel = party.length > 0 ? Math.round(party.reduce((s, p) => s + (p.level || 1), 0) / party.length) : 1;
    const partySize = party.length || 4;
    const hints = (BIOME_ENEMY_HINTS[planet.biome] || []).join(', ');

    const aiPrompt = `You are a Stars Without Number GM building a tactical combat encounter.

LOCATION: ${planet.name} (${planet.biome} biome, atmosphere: ${planet.atmosphere.name}, temp: ${planet.temperature.name}, TL: ${planet.techLevel.tl}, tags: ${planet.tags.map(t => t.name).join(', ')})
PARTY: ${partySize} PCs, average level ${partyLevel}
DIFFICULTY: ${difficulty}  (Easy = chip damage; Standard = real risk; Tough = expect resource burn; Deadly = lethal)
${theme ? 'GM theme: ' + theme : ''}
Local enemy flavor hints: ${hints}

Build the encounter. Return JSON shaped exactly:
{
  "title": "concise encounter name",
  "setup": "1-2 sentence description of the scene as PCs arrive",
  "enemies": [
    { "name": "creature/NPC type", "count": 3, "hp": 8, "ac": 14, "ab": 1, "damage": "1d8 mag pistol",
      "morale": 8, "skills": "Shoot+1, Sneak+0", "tactic": "1-line of how they fight" }
  ],
  "terrain": "key terrain features that matter (cover, hazards, choke points)",
  "twist": "an optional environmental or narrative twist that can complicate the fight",
  "scaling": "1-line on how to scale up/down for harder/easier"
}`;

    const result = await window.askClaudeJSON(aiPrompt, null);
    setDraft(result);
    setThinking(false);
  }

  function save() {
    if (!draft) return;
    onSave({
      id: 'enc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      ...draft,
      planetId,
      planetName: planet?.name,
      difficulty,
      created: Date.now(),
    });
    setDraft(null);
  }

  return React.createElement('div', { style: { padding: 28, height: '100%', overflowY: 'auto' } },
    React.createElement('div', { style: { marginBottom: 18 } },
      React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: 'var(--fg-0)' } }, 'Encounter Forge'),
      React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } }, 'Tactical combats balanced against the active party — pick a planet, set difficulty, ask the Oracle.')
    ),

    // Input
    React.createElement('div', { className: 'panel', style: { marginBottom: 18, maxWidth: 900 } },
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 } },
          React.createElement('label', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'Planet',
            React.createElement('select', { value: planetId, onChange: e => setPlanetId(e.target.value), style: { marginTop: 4 } },
              sector.systems.flatMap(s => s.planets).map(p => React.createElement('option', { key: p.id, value: p.id }, p.name + ' (' + p.biome + ')'))
            )
          ),
          React.createElement('label', { style: { fontSize: 11, color: 'var(--fg-3)' } }, 'Difficulty',
            React.createElement('select', { value: difficulty, onChange: e => setDifficulty(e.target.value), style: { marginTop: 4 } },
              ['Easy', 'Standard', 'Tough', 'Deadly'].map(t => React.createElement('option', { key: t }, t))
            )
          )
        ),
        React.createElement('input', {
          value: theme,
          onChange: e => setTheme(e.target.value),
          placeholder: 'Optional theme — e.g., "ambush in a derelict orbital", "cult ritual interrupted"',
          style: { marginBottom: 12 },
        }),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)' } },
            'Party: ' + (party.length || 0) + ' PCs · avg level ' + (party.length ? Math.round(party.reduce((s,p) => s+(p.level||1), 0)/party.length) : '—')
          ),
          React.createElement('button', { className: 'primary', disabled: thinking, onClick: generate }, thinking ? '⌛ Weaving fight…' : '✦ Generate Encounter')
        )
      )
    ),

    // Draft
    draft && React.createElement(EncounterCard, { encounter: draft, draft: true, onSave: save, onDiscard: () => setDraft(null), onReroll: generate, onLoadToCombat }),

    // Saved
    encounters.length > 0 && React.createElement('div', { style: { marginTop: 12 } },
      React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8 } }, encounters.length + ' SAVED ENCOUNTERS'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 14 } },
        encounters.map(e => React.createElement(EncounterCard, { key: e.id, encounter: e, onDelete: () => onDelete(e.id), onLoadToCombat }))
      )
    )
  );
}

function EncounterCard({ encounter, draft, onSave, onDiscard, onReroll, onDelete, onLoadToCombat }) {
  return React.createElement('div', { className: 'panel', style: { border: draft ? '1px solid rgba(255,148,87,0.35)' : null, boxShadow: draft ? '0 0 24px rgba(255,148,87,0.1)' : null } },
    React.createElement('div', { className: 'panel-title' },
      React.createElement('span', null, encounter.title),
      !draft && React.createElement('span', { className: 'tag', style: { marginLeft: 8, fontSize: 10 } }, encounter.difficulty),
      !draft && React.createElement('button', { className: 'ghost danger', style: { marginLeft: 'auto', fontSize: 11 }, onClick: onDelete }, '×')
    ),
    React.createElement('div', { className: 'panel-body' },
      React.createElement('div', { style: { fontSize: 13, fontStyle: 'italic', color: 'var(--fg-1)', marginBottom: 10 } }, encounter.setup),
      // Enemies table
      encounter.enemies?.length > 0 && React.createElement('div', { style: { marginBottom: 10 } },
        React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 } }, 'Enemies'),
        encounter.enemies.map((e, i) => React.createElement('div', { key: i, style: { padding: 8, background: 'var(--bg-1)', border: '1px solid var(--border-soft)', borderRadius: 6, marginBottom: 4 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 } },
            React.createElement('span', { style: { fontWeight: 600, fontSize: 13 } }, '×' + (e.count || 1) + '  ' + e.name),
            React.createElement('span', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-3)' } }, 'HP ' + e.hp + ' · AC ' + e.ac + ' · AB +' + e.ab)
          ),
          React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--fg-2)' } }, e.damage + '  ·  ' + (e.skills || '')),
          e.tactic && React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-1)', marginTop: 3, fontStyle: 'italic' } }, '“' + e.tactic + '”')
        ))
      ),
      React.createElement('div', { className: 'kv' },
        React.createElement('div', { className: 'k' }, 'Terrain'),
        React.createElement('div', { className: 'v' }, encounter.terrain),
        encounter.twist && [
          React.createElement('div', { key: 'tk', className: 'k' }, 'Twist'),
          React.createElement('div', { key: 'tv', className: 'v', style: { color: 'var(--accent-2)' } }, encounter.twist),
        ],
        encounter.scaling && [
          React.createElement('div', { key: 'sk', className: 'k' }, 'Scaling'),
          React.createElement('div', { key: 'sv', className: 'v' }, encounter.scaling),
        ]
      ),
      React.createElement('div', { style: { display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' } },
        draft && React.createElement('button', { className: 'primary', onClick: onSave }, '✚ Save'),
        draft && React.createElement('button', { onClick: onDiscard }, 'Discard'),
        draft && React.createElement('button', { onClick: onReroll }, '↻ Reroll'),
        !draft && onLoadToCombat && React.createElement('button', { onClick: () => onLoadToCombat(encounter) }, '⊞ Load to Combat Map')
      )
    )
  );
}

// ─── PARTY / CHARACTER SHEETS ────────────────────────────────────────────────
const CHAR_CLASSES = ['Warrior', 'Expert', 'Psychic', 'Adventurer (Warrior/Expert)', 'Adventurer (Warrior/Psychic)', 'Adventurer (Expert/Psychic)'];
const CHAR_BACKGROUNDS = ['Spacer', 'Soldier', 'Noble', 'Scholar', 'Criminal', 'Worker', 'Wanderer', 'Pretech Cultist', 'Frontier Doctor', 'Cyber-doc', 'Bounty Hunter', 'Smuggler'];

function attrMod(a) {
  if (a <= 3) return -2;
  if (a <= 7) return -1;
  if (a <= 13) return 0;
  if (a <= 17) return 1;
  return 2;
}

function rollChar() {
  const r = () => Math.floor(Math.random() * 6) + 1;
  const roll3d6 = () => r() + r() + r();
  const SWN = window.SWN;
  const attrs = { STR: roll3d6(), DEX: roll3d6(), CON: roll3d6(), INT: roll3d6(), WIS: roll3d6(), CHA: roll3d6() };
  const level = 1;
  const hp = Math.max(1, 6 + Math.max(0, attrMod(attrs.CON)));
  return {
    id: 'pc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    name: SWN.firstNames[Math.floor(Math.random() * SWN.firstNames.length)] + ' ' + SWN.lastNames[Math.floor(Math.random() * SWN.lastNames.length)],
    class: CHAR_CLASSES[Math.floor(Math.random() * CHAR_CLASSES.length)],
    background: CHAR_BACKGROUNDS[Math.floor(Math.random() * CHAR_BACKGROUNDS.length)],
    level, attrs, hp, maxHp: hp,
    ac: 12,
    ab: 0,
    saves: { physical: 15, evasion: 14, mental: 14 },
    skills: [],
    gear: [],
    credits: 200,
    notes: '',
  };
}

function CharacterSheetsView({ party = [], onSave, onDelete, onAddBlank }) {
  const [selId, setSelId] = useMGs(party[0]?.id || null);
  const sel = party.find(c => c.id === selId);

  function update(patch) {
    if (!sel) return;
    onSave({ ...sel, ...patch });
  }
  function updateAttr(key, value) {
    update({ attrs: { ...sel.attrs, [key]: +value || 0 } });
  }
  function addBlank() {
    const c = rollChar();
    onSave(c);
    setSelId(c.id);
  }

  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', overflow: 'hidden' } },
    // Roster
    React.createElement('div', { style: { borderRight: '1px solid var(--border-soft)', overflowY: 'auto', padding: 16, background: 'rgba(10,5,7,0.6)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase' } }, party.length + ' PCs'),
        React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: addBlank }, '+ ROLL PC')
      ),
      React.createElement('div', { className: 'list' },
        party.map(p => React.createElement('div', { key: p.id, className: 'list-item' + (p.id === sel?.id ? ' active' : ''), onClick: () => setSelId(p.id) },
          React.createElement('div', { className: 'title' }, p.name),
          React.createElement('div', { className: 'meta' }, p.class + ' · L' + p.level + ' · HP ' + p.hp + '/' + p.maxHp)
        ))
      )
    ),
    // Sheet
    sel ? React.createElement('div', { style: { overflowY: 'auto', padding: 28 } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 } },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('input', { value: sel.name, onChange: e => update({ name: e.target.value }), style: { fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, background: 'transparent', border: 'none', color: 'var(--fg-0)', padding: 0 } }),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' } },
            React.createElement('select', { value: sel.class, onChange: e => update({ class: e.target.value }), style: { width: 'auto', padding: '2px 6px', fontSize: 12 } },
              CHAR_CLASSES.map(c => React.createElement('option', { key: c }, c))),
            React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '·'),
            React.createElement('select', { value: sel.background, onChange: e => update({ background: e.target.value }), style: { width: 'auto', padding: '2px 6px', fontSize: 12 } },
              CHAR_BACKGROUNDS.map(c => React.createElement('option', { key: c }, c))),
            React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '· Level'),
            React.createElement('input', { type: 'number', value: sel.level, onChange: e => update({ level: +e.target.value || 1 }), style: { width: 60, padding: '2px 6px', fontSize: 12 } })
          )
        ),
        React.createElement('button', { className: 'danger', onClick: () => { onDelete(sel.id); setSelId(party.filter(p => p.id !== sel.id)[0]?.id); } }, 'Delete PC')
      ),

      // Attributes
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Attributes'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 } },
            ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(k => React.createElement('div', { key: k, style: { textAlign: 'center' } },
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, k),
              React.createElement('input', { type: 'number', value: sel.attrs?.[k] ?? 10, onChange: e => updateAttr(k, e.target.value),
                style: { textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 600, padding: '4px 0', background: 'var(--bg-1)' } }),
              React.createElement('div', { style: { fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--fg-3)' } }, 'mod ' + (attrMod(sel.attrs?.[k] ?? 10) >= 0 ? '+' : '') + attrMod(sel.attrs?.[k] ?? 10))
            ))
          ),
          React.createElement('div', { style: { marginTop: 12, display: 'flex', gap: 8 } },
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => {
              const r = () => Math.floor(Math.random() * 6) + 1;
              const rolls = {};
              ['STR','DEX','CON','INT','WIS','CHA'].forEach(k => rolls[k] = r() + r() + r());
              update({ attrs: rolls });
            } }, '⚂ Reroll all (3d6)'),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: () => update({ attrs: { STR:14,DEX:13,CON:12,INT:12,WIS:10,CHA:10 } }) }, 'Standard Array')
          )
        )
      ),

      // Combat stats
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Combat'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'HP'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                React.createElement('input', { type: 'number', value: sel.hp, onChange: e => update({ hp: +e.target.value || 0 }), style: { width: 60 } }),
                React.createElement('span', { style: { color: 'var(--fg-3)' } }, '/'),
                React.createElement('input', { type: 'number', value: sel.maxHp, onChange: e => update({ maxHp: +e.target.value || 0 }), style: { width: 60 } })
              )
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'AC'),
              React.createElement('input', { type: 'number', value: sel.ac, onChange: e => update({ ac: +e.target.value || 10 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'AB'),
              React.createElement('input', { type: 'number', value: sel.ab, onChange: e => update({ ab: +e.target.value || 0 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'Credits'),
              React.createElement('input', { type: 'number', value: sel.credits, onChange: e => update({ credits: +e.target.value || 0 }) })
            )
          ),
          React.createElement('div', { style: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 } },
            ['physical', 'evasion', 'mental'].map(s => React.createElement('div', { key: s },
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'Save · ' + s),
              React.createElement('input', { type: 'number', value: sel.saves?.[s] ?? 15, onChange: e => update({ saves: { ...sel.saves, [s]: +e.target.value || 15 } }) })
            ))
          )
        )
      ),
      // Gear & Notes
      React.createElement('div', { className: 'grid-2' },
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Gear & Skills'),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('textarea', { value: (sel.gear || []).join('\n'), onChange: e => update({ gear: e.target.value.split('\n') }), rows: 6, placeholder: 'One item per line…' })
          )
        ),
        React.createElement('div', { className: 'panel' },
          React.createElement('div', { className: 'panel-title' }, 'Backstory & Notes'),
          React.createElement('div', { className: 'panel-body' },
            React.createElement('textarea', { value: sel.notes || '', onChange: e => update({ notes: e.target.value }), rows: 6, placeholder: 'Hooks, relationships, secrets…' })
          )
        )
      )
    ) : React.createElement('div', { className: 'empty' },
      React.createElement('div', null, 'No PCs yet.'),
      React.createElement('button', { className: 'primary', style: { marginTop: 10 }, onClick: addBlank }, '⚂ Roll a Character')
    )
  );
}

window.MissionGeneratorView = MissionGeneratorView;
window.EncounterGeneratorView = EncounterGeneratorView;
window.CharacterSheetsView = CharacterSheetsView;
