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
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 12 } },
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
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(420px, 100%), 1fr))', gap: 14 } },
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
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 12 } },
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
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(420px, 100%), 1fr))', gap: 14 } },
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

// SWN XP thresholds (cumulative) per level.
const XP_TABLE = [0, 0, 3, 6, 12, 18, 27, 39, 54, 72, 93];
function levelFromXP(xp) {
  let lvl = 1;
  for (let i = 2; i < XP_TABLE.length; i++) if (xp >= XP_TABLE[i]) lvl = i;
  if (xp >= 93) lvl = Math.max(10, lvl);
  return lvl;
}
// SWN saves: 16 − level − best mod of the attribute pair. Lower is better; floor of 2.
function computeSaves(level, attrs) {
  const m = k => attrMod(attrs?.[k] ?? 10);
  const clamp = v => Math.max(2, v);
  return {
    physical: clamp(16 - level - Math.max(m('STR'), m('CON'))),
    evasion: clamp(16 - level - Math.max(m('DEX'), m('INT'))),
    mental: clamp(16 - level - Math.max(m('WIS'), m('CHA'))),
  };
}

function rollChar() {
  const r = () => Math.floor(Math.random() * 6) + 1;
  const roll3d6 = () => r() + r() + r();
  const SWN = window.SWN;
  const attrs = { STR: roll3d6(), DEX: roll3d6(), CON: roll3d6(), INT: roll3d6(), WIS: roll3d6(), CHA: roll3d6() };
  const level = 1;
  const cls = CHAR_CLASSES[Math.floor(Math.random() * CHAR_CLASSES.length)];
  const isWarrior = cls.startsWith('Warrior');
  const hp = Math.max(1, r() + Math.max(0, attrMod(attrs.CON)) + (isWarrior ? 2 : 0));
  return {
    id: 'pc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    name: SWN.firstNames[Math.floor(Math.random() * SWN.firstNames.length)] + ' ' + SWN.lastNames[Math.floor(Math.random() * SWN.lastNames.length)],
    class: cls,
    background: CHAR_BACKGROUNDS[Math.floor(Math.random() * CHAR_BACKGROUNDS.length)],
    species: 'Human',
    level, xp: 0, attrs, hp, maxHp: hp,
    bab: isWarrior ? 1 : 0,
    armor: 'None',
    ac: 10 + attrMod(attrs.DEX),
    saves: computeSaves(level, attrs),
    systemStrain: 0,
    skills: [],
    foci: [],
    weapons: [],
    gear: [],
    credits: 200,
    notes: '',
  };
}

// Guided, educational character builder for players new to SWN. Reuses
// attrMod / computeSaves from this module plus window.SWN_CHARGEN (chargen
// reference data) and window.SWN_PSI (psychic disciplines). Modal overlay.
function CharacterBuilder({ me = { id: 'anon', name: '' }, onSetMyName, onCreate, onClose }) {
  const CG = window.SWN_CHARGEN;
  const PSI = window.SWN_PSI;
  const EQ = window.SWN_EQUIP;
  const ATTR_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  const [stepIdx, setStepIdx] = useMGs(0);
  const [playerName, setPlayerName] = useMGs(me.name || '');
  const [name, setName] = useMGs('');
  const [goal, setGoal] = useMGs('');
  const [attrs, setAttrs] = useMGs(() => ({ STR: 14, DEX: 12, CON: 11, INT: 10, WIS: 9, CHA: 7 }));
  const [background, setBackground] = useMGs(null);
  const [cls, setCls] = useMGs(null);
  const [partials, setPartials] = useMGs([]); // for Adventurer
  const [combatChoice, setCombatChoice] = useMGs('Shoot'); // resolves "Any Combat"
  const [customSkills, setCustomSkills] = useMGs(false);
  const [pickedSkills, setPickedSkills] = useMGs([]); // when customizing
  const [focus, setFocus] = useMGs(null);
  const [specialistSkill, setSpecialistSkill] = useMGs('Notice');
  const [disciplines, setDisciplines] = useMGs([]);
  const [pkg, setPkg] = useMGs(null);

  const isWarrior = cls === 'Warrior' || (cls === 'Adventurer' && partials.includes('Warrior'));
  const isExpert = cls === 'Expert' || (cls === 'Adventurer' && partials.includes('Expert'));
  const isPsychic = cls === 'Psychic' || (cls === 'Adventurer' && partials.includes('Psychic'));
  const bg = CG.backgrounds.find(b => b.name === background);

  function rollAttrs() {
    const r = () => Math.floor(Math.random() * 6) + 1;
    const next = {};
    ATTR_KEYS.forEach(k => next[k] = r() + r() + r());
    setAttrs(next);
  }
  function setArray() { setAttrs({ STR: 14, DEX: 12, CON: 11, INT: 10, WIS: 9, CHA: 7 }); }

  // Resolve the final skill list (background quick skills, or custom picks), plus focus skill.
  function resolveSkills() {
    const out = {};
    const add = nm => {
      const real = nm === 'Any Combat' ? combatChoice : nm;
      out[real] = Math.min(1, (out[real] != null ? out[real] : -1) + 1);
    };
    if (bg) {
      add(bg.freeSkill);
      const list = customSkills && pickedSkills.length ? pickedSkills : bg.quickSkills;
      list.forEach(add);
    }
    const f = CG.foci.find(x => x.name === focus);
    if (f && f.grantsSkill) add(f.grantsSkill);
    if (focus === 'Specialist' && specialistSkill) add(specialistSkill);
    return Object.keys(out).map(k => ({ name: k, level: out[k] }));
  }

  // The dynamic step list (psionics only appears for psychics).
  const steps = [
    { id: 'welcome', label: 'Start' },
    { id: 'attrs', label: 'Attributes' },
    { id: 'background', label: 'Background' },
    { id: 'class', label: 'Class' },
    { id: 'skills', label: 'Skills' },
    { id: 'focus', label: 'Focus' },
    ...(isPsychic ? [{ id: 'psi', label: 'Psionics' }] : []),
    { id: 'gear', label: 'Gear' },
    { id: 'review', label: 'Review' },
  ];
  const stepId = (steps[stepIdx] || steps[0]).id;

  const canNext = (
    stepId === 'welcome' ? name.trim().length > 0 :
    stepId === 'background' ? !!background :
    stepId === 'class' ? (!!cls && (cls !== 'Adventurer' || partials.length === 2)) :
    stepId === 'focus' ? !!focus :
    stepId === 'psi' ? disciplines.length > 0 :
    stepId === 'gear' ? !!pkg :
    true
  );

  function finish() {
    const r = () => Math.floor(Math.random() * 6) + 1;
    const dexMod = attrMod(attrs.DEX);
    const hp = Math.max(1, r() + Math.max(0, attrMod(attrs.CON)) + (isWarrior ? 2 : 0));
    const p = CG.packages.find(x => x.name === pkg);
    const baseAc = p ? p.ac : 10;
    const weapons = p ? p.weapons.map(w => ({ name: w.name, dmg: w.dmg, range: w.range || '—', shock: '' })) : [];
    const gearItems = p ? [...(p.items || []), ...(p.weapons.length ? [] : [])] : [];
    const clsLabel = cls === 'Adventurer' ? 'Adventurer (' + partials.join('/') + ')' : cls;
    if (playerName && playerName !== me.name && onSetMyName) onSetMyName(playerName);
    onCreate({
      id: 'pc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      name: name.trim(), class: clsLabel, background, species: 'Human',
      level: 1, xp: 0, attrs, hp, maxHp: hp,
      bab: isWarrior ? 1 : 0,
      armor: p ? p.armorName : 'None', ac: baseAc + dexMod,
      saves: computeSaves(1, attrs),
      systemStrain: 0,
      skills: resolveSkills(),
      foci: focus ? [{ name: focus, level: 1 }] : [],
      disciplines: isPsychic ? disciplines.map(d => ({ name: d, level: 1 })) : [],
      effortCommitted: 0,
      weapons,
      gear: gearItems,
      credits: p ? p.credits : 200,
      notes: goal ? ('Goal: ' + goal) : '',
      ownerId: me.id, ownerName: (playerName || me.name || 'Player'),
    });
  }

  // ── small presentational helpers ──
  const note = txt => React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6, marginBottom: 12 } }, txt);
  const fieldLabel = t => React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 } }, t);
  function card(key, selected, onClick, titleEl, bodyEls, badge) {
    return React.createElement('div', {
      key, onClick,
      className: 'cb-card' + (selected ? ' selected' : ''),
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8 } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: 14, color: selected ? 'var(--accent)' : 'var(--fg-0)' } }, titleEl),
        badge && React.createElement('span', { className: 'tag', style: { fontSize: 10, marginLeft: 'auto' } }, badge)
      ),
      bodyEls
    );
  }
  const skillChip = nm => React.createElement('span', {
    key: nm, className: 'tag', title: (CG.skills[nm] || ''),
    style: { fontSize: 11, marginRight: 6, marginBottom: 6, display: 'inline-block' },
  }, nm === 'Any Combat' ? 'Any Combat (' + combatChoice + ')' : nm);

  // ── step bodies ──
  let body = null;
  if (stepId === 'welcome') {
    body = React.createElement('div', null,
      note("You're about to make an adventurer for the year 3200 — a starfarer chasing glory, riches, or revenge. This wizard walks you through every choice and explains what it means. You can change anything later on the sheet."),
      React.createElement('div', { style: { marginBottom: 14 } }, fieldLabel('Your player name'),
        React.createElement('input', { value: playerName, onChange: e => setPlayerName(e.target.value), placeholder: 'e.g. Alex', style: { width: '100%' } })),
      React.createElement('div', null, fieldLabel('Character name'),
        React.createElement('input', { value: name, onChange: e => setName(e.target.value), placeholder: 'Name your hero', autoFocus: true, style: { width: '100%' } }))
    );
  } else if (stepId === 'attrs') {
    body = React.createElement('div', null,
      note('Six attributes set your raw potential. Assign the standard array (14, 12, 11, 10, 9, 7) however you like, or roll the dice. The “mod” is what you actually add to rolls.'),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 14 } },
        React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: setArray }, 'Standard Array'),
        React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: rollAttrs }, '⚂ Roll 3d6')
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        CG.attributes.map(a => React.createElement('div', { key: a.key, style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('div', { style: { width: 116 } },
            React.createElement('div', { style: { fontWeight: 600, fontSize: 12, color: 'var(--fg-0)' } }, a.name),
            React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', lineHeight: 1.3 } }, a.blurb)
          ),
          React.createElement('input', { type: 'number', value: attrs[a.key], onChange: e => setAttrs({ ...attrs, [a.key]: +e.target.value || 0 }), style: { width: 56, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 600 } }),
          React.createElement('div', { style: { width: 48, fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--fg-2)' } }, 'mod ' + (attrMod(attrs[a.key]) >= 0 ? '+' : '') + attrMod(attrs[a.key]))
        ))
      )
    );
  } else if (stepId === 'background') {
    body = React.createElement('div', null,
      note('Where did your hero come from? Background sets the skills you start with.'),
      React.createElement('div', { className: 'cb-list' },
        CG.backgrounds.map(b => card('bg-' + b.name, background === b.name, () => setBackground(b.name), b.name,
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', margin: '4px 0 6px', lineHeight: 1.5 } }, b.blurb),
            React.createElement('div', null,
              React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 6 } }, "You'll start knowing:"),
              [b.freeSkill, ...b.quickSkills.filter(s => s !== b.freeSkill)].map(skillChip)
            )
          )
        ))
      )
    );
  } else if (stepId === 'class') {
    body = React.createElement('div', null,
      note('Your class is what you’re best at as an adventurer. It doesn’t have to match your background.'),
      React.createElement('div', { className: 'cb-list' },
        CG.classes.map(c => card('cls-' + c.name, cls === c.name, () => { setCls(c.name); if (c.name !== 'Adventurer') setPartials([]); }, c.name,
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', margin: '4px 0 6px', lineHeight: 1.5 } }, c.blurb),
            React.createElement('ul', { style: { margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--fg-3)' } },
              c.perks.map((p, i) => React.createElement('li', { key: i, style: { marginBottom: 2 } }, p)))
          ),
          c.tagline
        ))
      ),
      cls === 'Adventurer' && React.createElement('div', { style: { marginTop: 12 } },
        fieldLabel('Pick exactly two to blend' + (partials.length === 2 ? '' : ' (' + partials.length + '/2)')),
        React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          ['Warrior', 'Expert', 'Psychic'].map(p => React.createElement('button', {
            key: p,
            className: partials.includes(p) ? 'primary' : 'ghost',
            style: { fontSize: 12 },
            onClick: () => setPartials(partials.includes(p) ? partials.filter(x => x !== p) : (partials.length < 2 ? [...partials, p] : partials)),
          }, 'Partial ' + p))
        )
      )
    );
  } else if (stepId === 'skills') {
    body = React.createElement('div', null,
      note('Skills are what your hero can do. The set below is the recommended starting kit for a ' + (background || 'your background') + ' — perfect if you’re unsure.'),
      bg && React.createElement('div', { style: { marginBottom: 12 } },
        React.createElement('div', { style: { marginBottom: 8 } },
          [bg.freeSkill, ...bg.quickSkills.filter(s => s !== bg.freeSkill)].map(skillChip)),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          [bg.freeSkill, ...bg.quickSkills.filter(s => s !== bg.freeSkill)].map(s =>
            React.createElement('div', { key: s, style: { fontSize: 11, color: 'var(--fg-3)' } },
              React.createElement('span', { style: { color: 'var(--fg-1)', fontWeight: 600 } }, (s === 'Any Combat' ? 'Any Combat' : s) + ': '),
              CG.skills[s] || ''))
        )
      ),
      bg && bg.quickSkills.includes('Any Combat') && React.createElement('div', { style: { marginTop: 10 } },
        fieldLabel('Your combat skill'),
        React.createElement('div', { style: { display: 'flex', gap: 6 } },
          ['Shoot', 'Stab', 'Punch'].map(o => React.createElement('button', { key: o, className: combatChoice === o ? 'primary' : 'ghost', style: { fontSize: 12 }, onClick: () => setCombatChoice(o) }, o)))
      ),
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12, color: 'var(--fg-2)', cursor: 'pointer' } },
        React.createElement('input', { type: 'checkbox', checked: customSkills, onChange: e => setCustomSkills(e.target.checked) }),
        'Let me pick my own two skills instead'
      ),
      customSkills && React.createElement('div', { style: { marginTop: 10 } },
        fieldLabel('Pick up to 2 (each at level-0)'),
        React.createElement('div', { className: 'cb-skillgrid' },
          Object.keys(CG.skills).filter(s => s !== 'Any Combat').map(s => {
            const on = pickedSkills.includes(s);
            return React.createElement('button', {
              key: s, title: CG.skills[s],
              className: on ? 'primary' : 'ghost', style: { fontSize: 11 },
              onClick: () => setPickedSkills(on ? pickedSkills.filter(x => x !== s) : (pickedSkills.length < 2 ? [...pickedSkills, s] : pickedSkills)),
            }, s);
          }))
      )
    );
  } else if (stepId === 'focus') {
    const recommend = isWarrior ? 'combat' : (isExpert ? 'noncombat' : null);
    body = React.createElement('div', null,
      note('A focus is your special knack — a talent that sets you apart.' + (recommend ? ' As a ' + (recommend === 'combat' ? 'fighter, a combat focus suits you.' : 'specialist, a non-combat focus suits you.') : '')),
      React.createElement('div', { className: 'cb-list' },
        CG.foci.map(f => card('foc-' + f.name, focus === f.name, () => setFocus(f.name), f.name,
          React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', margin: '4px 0 0', lineHeight: 1.5 } }, f.blurb),
          f.type === recommend ? 'suggested' : (f.type === 'combat' ? 'combat' : 'utility')
        ))
      ),
      focus === 'Specialist' && React.createElement('div', { style: { marginTop: 10 } },
        fieldLabel('Specialist in which skill?'),
        React.createElement('select', { value: specialistSkill, onChange: e => setSpecialistSkill(e.target.value), style: { width: '100%' } },
          Object.keys(CG.skills).filter(s => s !== 'Any Combat').map(s => React.createElement('option', { key: s }, s)))
      )
    );
  } else if (stepId === 'psi') {
    body = React.createElement('div', null,
      note('Psychics train in disciplines. Pick ' + (cls === 'Psychic' ? 'two' : 'one') + ' to start. You can dig into individual techniques later on your sheet.'),
      React.createElement('div', { className: 'cb-list' },
        (PSI ? PSI.disciplines : []).map(d => {
          const on = disciplines.includes(d.name);
          const cap = cls === 'Psychic' ? 2 : 1;
          return card('psi-' + d.name, on, () => setDisciplines(on ? disciplines.filter(x => x !== d.name) : (disciplines.length < cap ? [...disciplines, d.name] : disciplines)), d.name,
            React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', margin: '4px 0 0', lineHeight: 1.5 } }, d.desc));
        })
      )
    );
  } else if (stepId === 'gear') {
    const suggested = CG.packages.filter(p => p.suggestedFor.includes(cls) || (cls === 'Adventurer'));
    const list = suggested.length ? suggested : CG.packages;
    body = React.createElement('div', null,
      note('Pick a starting kit. Each gives you weapons, armor, gear, and some credits. Suggested kits for your class are shown first.'),
      React.createElement('div', { className: 'cb-list' },
        [...list, ...CG.packages.filter(p => !list.includes(p))].map(p => card('pkg-' + p.name, pkg === p.name, () => setPkg(p.name), p.name,
          React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', margin: '4px 0 0', lineHeight: 1.5 } },
            (p.weapons.length ? p.weapons.map(w => w.name + ' (' + w.dmg + ')').join(', ') + ' · ' : '') + p.armorName + ' (AC ' + p.ac + ') · ' + p.credits + ' cr'),
          p.suggestedFor.includes(cls) ? 'suggested' : null
        ))
      )
    );
  } else { // review
    const dexMod = attrMod(attrs.DEX);
    const p = CG.packages.find(x => x.name === pkg);
    const ac = (p ? p.ac : 10) + dexMod;
    const skillNames = resolveSkills().map(s => s.name + (s.level ? '-' + s.level : '')).join(', ');
    const row = (k, v) => React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px solid var(--border-soft)' } },
      React.createElement('span', { style: { color: 'var(--fg-3)' } }, k), React.createElement('span', { style: { color: 'var(--fg-1)', textAlign: 'right' } }, v));
    body = React.createElement('div', null,
      note('Here’s your hero. Give them a goal — every adventurer needs a reason to be out there — then create.'),
      React.createElement('div', { style: { marginBottom: 12 } },
        row('Name', name || '—'),
        row('Class', cls === 'Adventurer' ? 'Adventurer (' + partials.join('/') + ')' : (cls || '—')),
        row('Background', background || '—'),
        row('Attributes', ATTR_KEYS.map(k => k + ' ' + attrs[k]).join('  ')),
        row('AC', '' + ac),
        row('To-hit bonus', isWarrior ? '+1' : '+0'),
        row('Focus', focus || '—'),
        isPsychic ? row('Disciplines', disciplines.join(', ') || '—') : null,
        row('Skills', skillNames || '—'),
        row('Kit', pkg || '—')
      ),
      fieldLabel('Your goal'),
      React.createElement('input', { value: goal, onChange: e => setGoal(e.target.value), placeholder: 'e.g. Become the best pilot in the sector', style: { width: '100%' } })
    );
  }

  return React.createElement('div', {
    style: { position: 'fixed', inset: 0, background: 'rgba(10,5,7,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    onClick: e => e.target === e.currentTarget && onClose(),
  },
    React.createElement('div', { className: 'cb-modal' },
      React.createElement('div', { style: { fontFamily: 'var(--font-display-alt)', fontWeight: 600, fontSize: 15, color: 'var(--fg-0)', letterSpacing: '0.06em', textTransform: 'uppercase' } }, '✦ Create your character'),
      // Step indicator
      React.createElement('div', { style: { display: 'flex', gap: 5, marginTop: 12 } },
        steps.map((s, i) => React.createElement('div', { key: s.id, style: { flex: 1, textAlign: 'center' } },
          React.createElement('div', { style: { height: 3, borderRadius: 2, background: i <= stepIdx ? 'var(--accent)' : 'var(--border-1)' } }),
          React.createElement('div', { style: { fontSize: 8.5, marginTop: 4, color: i === stepIdx ? 'var(--accent)' : 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.03em' } }, s.label)
        ))
      ),
      React.createElement('div', { className: 'cb-body' }, body),
      React.createElement('div', { style: { display: 'flex', gap: 8, paddingTop: 4 } },
        React.createElement('button', { style: { fontSize: 12 }, onClick: onClose }, 'Cancel'),
        stepIdx > 0 && React.createElement('button', { style: { fontSize: 12 }, onClick: () => setStepIdx(stepIdx - 1) }, '← Back'),
        React.createElement('div', { style: { flex: 1 } }),
        stepId !== 'review'
          ? React.createElement('button', { className: 'primary', style: { fontSize: 12, opacity: canNext ? 1 : 0.5, cursor: canNext ? 'pointer' : 'not-allowed' }, onClick: () => canNext && setStepIdx(stepIdx + 1) }, 'Next →')
          : React.createElement('button', { className: 'primary', style: { fontSize: 12 }, onClick: finish }, '✦ Create character')
      )
    )
  );
}

function CharacterSheetsView({ party = [], me = { id: 'anon', name: '' }, isGM = false, onSetMyName, onSave, onDelete }) {
  const myFirst = party.find(c => c.ownerId === me.id);
  const [selId, setSelId] = useMGs(myFirst?.id || party[0]?.id || null);
  const [builderOpen, setBuilderOpen] = useMGs(false);
  const sel = party.find(c => c.id === selId);
  // Players may edit only their own character; the GM may edit everyone's.
  const canEdit = c => !!c && (isGM || c.ownerId === me.id);
  const ro = sel ? !canEdit(sel) : false;

  function update(patch) {
    if (!sel || ro) return;
    onSave({ ...sel, ...patch });
  }
  function claim() {
    if (!sel) return;
    const c = { ...sel, ownerId: me.id, ownerName: me.name || 'Player' };
    onSave(c);
  }
  function onBuilderCreate(c) {
    onSave(c);
    setSelId(c.id);
    setBuilderOpen(false);
  }
  const mine = party.filter(c => c.ownerId === me.id);
  const others = party.filter(c => c.ownerId !== me.id);
  function rosterItem(p) {
    const ownerMeta = p.ownerId === me.id ? 'you' : (p.ownerName || (p.ownerId ? 'player' : 'unclaimed'));
    return React.createElement('div', { key: p.id, className: 'list-item' + (p.id === sel?.id ? ' active' : ''), onClick: () => setSelId(p.id) },
      React.createElement('div', { className: 'title' }, p.name),
      React.createElement('div', { className: 'meta' }, p.class + ' · L' + p.level + ' · HP ' + p.hp + '/' + p.maxHp + ' · ' + ownerMeta)
    );
  }
  function groupLabel(t) {
    return React.createElement('div', { key: 'gl-' + t, style: { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase', margin: '12px 0 6px' } }, t);
  }
  function updateAttr(key, value) {
    const newAttrs = { ...sel.attrs, [key]: +value || 0 };
    update({ attrs: newAttrs });
  }
  function addBlank() {
    const c = rollChar();
    onSave(c);
    setSelId(c.id);
  }
  const EQ = window.SWN_EQUIP;
  const TT = window.Tooltip;
  const bestMeleeMod = sel ? Math.max(attrMod(sel.attrs?.STR ?? 10), attrMod(sel.attrs?.DEX ?? 10)) : 0;
  const dexMod = sel ? attrMod(sel.attrs?.DEX ?? 10) : 0;
  function weaponHit(w) {
    const isMelee = EQ.meleeWeapons.some(m => m.name === w.name);
    const mod = isMelee ? bestMeleeMod : dexMod;
    return (sel.bab || 0) + mod;
  }
  function addWeapon(name) {
    if (!name) return;
    const w = [...EQ.rangedWeapons, ...EQ.meleeWeapons, ...EQ.heavyWeapons].find(x => x.name === name);
    if (w) update({ weapons: [...(sel.weapons || []), { name: w.name, dmg: w.dmg, range: w.range || '—', shock: w.shock || '' }] });
  }
  function setArmor(name) {
    const a = EQ.armor.find(x => x.name === name);
    if (!a) return;
    const baseAc = typeof a.ac === 'number' ? a.ac : parseInt(a.ac, 10);
    update({ armor: name, ac: baseAc + dexMod });
  }
  function addFocus(name) {
    if (!name || (sel.foci || []).some(f => f.name === name)) return;
    update({ foci: [...(sel.foci || []), { name, level: 1 }] });
  }
  function recomputeSaves() {
    update({ saves: computeSaves(sel.level, sel.attrs) });
  }

  return React.createElement('div', { className: 'split-pane', style: { display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', overflow: 'hidden' } },
    // Roster
    React.createElement('div', { style: { borderRight: '1px solid var(--border-soft)', overflowY: 'auto', padding: 16, background: 'rgba(10,5,7,0.6)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 6, flexWrap: 'wrap' } },
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase' } }, party.length + ' PCs'),
        React.createElement('div', { style: { display: 'flex', gap: 6 } },
          React.createElement('button', { className: 'primary', style: { fontSize: 11 }, onClick: () => setBuilderOpen(true), title: 'Guided character creation' }, '+ Create' + (isGM ? ' PC' : ' my character')),
          isGM && React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, onClick: addBlank, title: 'Roll a random PC' }, '⚂')
        )
      ),
      // Player view groups MY CHARACTER then OTHERS; GM sees one flat list.
      isGM
        ? React.createElement('div', { className: 'list' }, party.map(rosterItem))
        : React.createElement('div', null,
            groupLabel('My character'),
            mine.length
              ? React.createElement('div', { className: 'list' }, mine.map(rosterItem))
              : React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-3)', padding: '4px 0 8px' } }, 'None yet — click “Create my character”.'),
            others.length ? groupLabel('Others (read-only)') : null,
            others.length ? React.createElement('div', { className: 'list' }, others.map(rosterItem)) : null
          )
    ),
    // Sheet
    sel ? React.createElement('div', { style: { overflowY: 'auto', padding: 28 } },
      // Read-only banner for characters you don't own (players only; GM can edit all).
      ro && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 16, background: 'rgba(255,148,87,0.08)', border: '1px solid var(--border-1)', borderRadius: 8 } },
        React.createElement('span', { style: { fontSize: 12, color: 'var(--fg-2)' } },
          sel.ownerId ? ('🔒 Read-only — ' + (sel.ownerName || 'another player') + '’s character') : '🔒 Read-only — unclaimed character'),
        !sel.ownerId && React.createElement('button', { className: 'primary', style: { marginLeft: 'auto', fontSize: 12 }, onClick: claim }, 'Claim as mine')
      ),
      React.createElement('div', { style: ro ? { pointerEvents: 'none', opacity: 0.9 } : null },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 8, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 180 } },
          React.createElement('input', { value: sel.name, onChange: e => update({ name: e.target.value }), style: { fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, background: 'transparent', border: 'none', color: 'var(--fg-0)', padding: 0, width: '100%' } }),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' } },
            React.createElement('select', { value: sel.class, onChange: e => update({ class: e.target.value }), style: { width: 'auto', padding: '2px 6px', fontSize: 12 } },
              CHAR_CLASSES.map(c => React.createElement('option', { key: c }, c))),
            React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '·'),
            React.createElement('select', { value: sel.background, onChange: e => update({ background: e.target.value }), style: { width: 'auto', padding: '2px 6px', fontSize: 12 } },
              CHAR_BACKGROUNDS.map(c => React.createElement('option', { key: c }, c))),
            React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '· Level'),
            React.createElement('input', { type: 'number', value: sel.level, onChange: e => update({ level: +e.target.value || 1 }), style: { width: 50, padding: '2px 6px', fontSize: 12 } }),
            React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '· XP'),
            React.createElement('input', { type: 'number', value: sel.xp ?? 0, onChange: e => { const xp = +e.target.value || 0; update({ xp, level: levelFromXP(xp) }); }, style: { width: 60, padding: '2px 6px', fontSize: 12 }, title: 'Editing XP auto-sets level' })
          )
        ),
        React.createElement('button', { className: 'danger', onClick: () => { onDelete(sel.id); setSelId(party.filter(p => p.id !== sel.id)[0]?.id); } }, 'Delete PC')
      ),

      // Attributes
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Attributes'),
        React.createElement('div', { className: 'panel-body' },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(76px, 1fr))', gap: 10 } },
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
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 12 } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'HP'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                React.createElement('input', { type: 'number', value: sel.hp, onChange: e => update({ hp: +e.target.value || 0 }), style: { width: 52 } }),
                React.createElement('span', { style: { color: 'var(--fg-3)' } }, '/'),
                React.createElement('input', { type: 'number', value: sel.maxHp, onChange: e => update({ maxHp: +e.target.value || 0 }), style: { width: 52 } })
              )
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Armor Class'), React.createElement('div', { style: { marginTop: 4 } }, 'Armor base + Dexterity modifier. Foes roll d20 + AB ≥ your AC to hit.')) }, 'AC') : 'AC'),
              React.createElement('input', { type: 'number', value: sel.ac, onChange: e => update({ ac: +e.target.value || 10 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Base Attack Bonus'), React.createElement('div', { style: { marginTop: 4 } }, 'Warrior = +level. Partial-warrior = +1 at L1 & L5. Other = +(level÷2). Added to all attack rolls.')) }, 'BAB') : 'BAB'),
              React.createElement('input', { type: 'number', value: sel.bab ?? 0, onChange: e => update({ bab: +e.target.value || 0 }) })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'System Strain'), React.createElement('div', { style: { marginTop: 4 } }, 'Accumulated bodily stress from cyberware, drugs, and effort. Maximum equals Constitution score.')) }, 'Strain') : 'Strain'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                React.createElement('input', { type: 'number', value: sel.systemStrain ?? 0, onChange: e => update({ systemStrain: +e.target.value || 0 }), style: { width: 46 } }),
                React.createElement('span', { style: { color: 'var(--fg-3)', fontSize: 12 } }, '/ ' + (sel.attrs?.CON ?? 10))
              )
            )
          ),
          // Armor + credits
          React.createElement('div', { style: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'Armor'),
              React.createElement('select', { value: sel.armor || 'None', onChange: e => setArmor(e.target.value) },
                EQ.armor.map(a => React.createElement('option', { key: a.name, value: a.name }, a.name + ' (AC ' + a.ac + ')')))
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'Credits'),
              React.createElement('input', { type: 'number', value: sel.credits, onChange: e => update({ credits: +e.target.value || 0 }) })
            )
          ),
          // Saves
          React.createElement('div', { style: { marginTop: 12 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Saving Throws'), React.createElement('div', { style: { marginTop: 4 } }, '16 − level − best relevant attribute modifier. Roll d20 ≥ target to succeed. Lower is better.')) }, 'Saves') : 'Saves'),
              React.createElement('button', { className: 'ghost', style: { fontSize: 10, padding: '2px 6px' }, onClick: recomputeSaves }, '↻ Auto')
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 } },
              ['physical', 'evasion', 'mental'].map(s => React.createElement('div', { key: s },
                React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'capitalize' } }, s),
                React.createElement('div', { style: { display: 'flex', gap: 4 } },
                  React.createElement('input', { type: 'number', value: sel.saves?.[s] ?? 15, onChange: e => update({ saves: { ...sel.saves, [s]: +e.target.value || 15 } }) }),
                  React.createElement('button', { className: 'ghost', style: { fontSize: 11, padding: '0 8px', whiteSpace: 'nowrap' }, title: 'Roll d20 vs ' + s + ' save (success ≥ target)', onClick: () => window.rollDice && window.rollDice('1d20', sel.name + ' · ' + s + ' save (vs ' + (sel.saves?.[s] ?? 15) + ')') }, '⚂')
                )
              ))
            )
          ),
          // Quick rolls
          React.createElement('div', { style: { marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } }, 'Quick'),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, title: 'Initiative: 1d8 + Dex mod', onClick: () => window.rollDice && window.rollDice('1d8', sel.name + ' · initiative', dexMod) }, '⚂ Initiative'),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, title: 'Skill check: 2d6 + attribute mod + skill level', onClick: () => window.rollDice && window.rollDice('2d6', sel.name + ' · skill check', 0) }, '⚂ Skill 2d6'),
            React.createElement('button', { className: 'ghost', style: { fontSize: 11 }, title: 'Hit Dice (heal/level): roll your hit die', onClick: () => window.rollDice && window.rollDice('1d6', sel.name + ' · hit die', Math.max(0, attrMod(sel.attrs?.CON ?? 10))) }, '⚂ Hit Die')
          )
        )
      ),

      // Weapons
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Weapons',
          React.createElement('select', { value: '', onChange: e => { addWeapon(e.target.value); e.target.value = ''; }, style: { marginLeft: 'auto', width: 'auto', fontSize: 11, padding: '2px 6px' } },
            React.createElement('option', { value: '' }, '+ Add weapon…'),
            React.createElement('optgroup', { label: 'Ranged' }, EQ.rangedWeapons.map(w => React.createElement('option', { key: w.name, value: w.name }, w.name))),
            React.createElement('optgroup', { label: 'Melee' }, EQ.meleeWeapons.map(w => React.createElement('option', { key: w.name, value: w.name }, w.name))),
            React.createElement('optgroup', { label: 'Heavy' }, EQ.heavyWeapons.map(w => React.createElement('option', { key: w.name, value: w.name }, w.name)))
          )
        ),
        React.createElement('div', { className: 'panel-body' },
          (sel.weapons || []).length === 0
            ? React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 12 } }, 'No weapons. Add one from the menu above.')
            : (sel.weapons || []).map((w, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < sel.weapons.length - 1 ? '1px solid var(--border-soft)' : 'none' } },
              React.createElement('span', { style: { flex: 1, fontSize: 13, color: 'var(--fg-0)' } }, w.name),
              React.createElement('button', { className: 'tag', style: { fontSize: 11, cursor: 'pointer', border: '1px solid var(--border-1)' }, title: 'Roll attack (d20 + hit)', onClick: () => window.rollDice && window.rollDice('1d20', sel.name + ' · ' + w.name + ' attack', weaponHit(w)) }, 'hit +' + weaponHit(w)),
              React.createElement('button', { style: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-1)', background: 'var(--bg-1)', border: '1px solid var(--border-soft)', borderRadius: 4, padding: '2px 7px', cursor: 'pointer' }, title: 'Roll damage', onClick: () => window.rollDice && window.rollDice(String(w.dmg).replace('*', '').replace('#', ''), sel.name + ' · ' + w.name + ' damage') }, '⚂ ' + w.dmg),
              w.range && w.range !== '—' && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' } }, w.range + 'm'),
              React.createElement('button', { className: 'ghost danger', style: { fontSize: 11, padding: '2px 6px' }, onClick: () => update({ weapons: sel.weapons.filter((_, j) => j !== i) }) }, '×')
            ))
        )
      ),

      // Foci
      React.createElement('div', { className: 'panel', style: { marginBottom: 14 } },
        React.createElement('div', { className: 'panel-title' }, 'Foci',
          React.createElement('select', { value: '', onChange: e => { addFocus(e.target.value); e.target.value = ''; }, style: { marginLeft: 'auto', width: 'auto', fontSize: 11, padding: '2px 6px' } },
            React.createElement('option', { value: '' }, '+ Add focus…'),
            EQ.foci.map(f => React.createElement('option', { key: f.name, value: f.name }, f.name))
          )
        ),
        React.createElement('div', { className: 'panel-body' },
          (sel.foci || []).length === 0
            ? React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 12 } }, 'No foci yet. SWN PCs start with one or two.')
            : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
              (sel.foci || []).map((f, i) => {
                const def = EQ.foci.find(x => x.name === f.name) || {};
                return React.createElement('div', { key: i, style: { padding: 8, background: 'var(--bg-1)', border: '1px solid var(--border-soft)', borderRadius: 6 } },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                    React.createElement('span', { style: { fontWeight: 600, fontSize: 13, color: 'var(--fg-0)' } }, f.name),
                    def.skill && def.skill !== '—' && React.createElement('span', { className: 'tag', style: { fontSize: 10 } }, '+' + def.skill),
                    React.createElement('span', { style: { marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' } },
                      React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)' } }, 'Lvl'),
                      React.createElement('select', { value: f.level, onChange: e => update({ foci: sel.foci.map((x, j) => j === i ? { ...x, level: +e.target.value } : x) }), style: { width: 'auto', padding: '1px 4px', fontSize: 11 } },
                        React.createElement('option', { value: 1 }, '1'), React.createElement('option', { value: 2 }, '2')),
                      React.createElement('button', { className: 'ghost danger', style: { fontSize: 11, padding: '2px 6px' }, onClick: () => update({ foci: sel.foci.filter((_, j) => j !== i) }) }, '×')
                    )
                  ),
                  React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', marginTop: 4 } }, f.level >= 2 && def.l2 ? def.l2 : def.l1)
                );
              })
            )
        )
      ),

      // Psionics — only for psychic classes
      /Psychic/.test(sel.class || '') && (() => {
        const PSI = window.SWN_PSI;
        const discs = sel.disciplines || [];
        const wisCon = Math.max(attrMod(sel.attrs?.WIS ?? 10), attrMod(sel.attrs?.CON ?? 10));
        const highestLvl = discs.reduce((mx, d) => Math.max(mx, d.level || 1), 0);
        const maxEffort = 1 + highestLvl + wisCon;
        const committed = sel.effortCommitted || 0;
        function addDisc(name) {
          if (!name || discs.some(d => d.name === name)) return;
          update({ disciplines: [...discs, { name, level: 1 }] });
        }
        return React.createElement('div', { className: 'panel', style: { marginBottom: 14, border: '1px solid rgba(192,132,252,0.3)' } },
          React.createElement('div', { className: 'panel-title', style: { color: 'var(--accent-2)' } }, 'Psionics',
            React.createElement('select', { value: '', onChange: e => { addDisc(e.target.value); e.target.value = ''; }, style: { marginLeft: 'auto', width: 'auto', fontSize: 11, padding: '2px 6px' } },
              React.createElement('option', { value: '' }, '+ Discipline…'),
              PSI.disciplines.map(d => React.createElement('option', { key: d.name, value: d.name }, d.name))
            )
          ),
          React.createElement('div', { className: 'panel-body' },
            // Effort tracker
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: 10, background: 'rgba(192,132,252,0.06)', borderRadius: 6 } },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' } },
                  TT ? React.createElement(TT, { content: React.createElement('div', null, React.createElement('strong', null, 'Effort'), React.createElement('div', { style: { marginTop: 4 } }, 'Max Effort = 1 + highest psychic skill level + best of WIS or CON modifier. Commit Effort to fuel techniques; reclaim it when they end.')) }, 'Effort') : 'Effort'),
                React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--accent-2)' } }, (maxEffort - committed) + ' / ' + maxEffort)
              ),
              React.createElement('div', { style: { display: 'flex', gap: 4, marginLeft: 'auto' } },
                React.createElement('button', { className: 'ghost', style: { fontSize: 12 }, title: 'Commit 1 Effort', onClick: () => update({ effortCommitted: Math.min(maxEffort, committed + 1) }) }, 'Commit'),
                React.createElement('button', { className: 'ghost', style: { fontSize: 12 }, title: 'Reclaim 1 Effort', onClick: () => update({ effortCommitted: Math.max(0, committed - 1) }) }, 'Reclaim')
              )
            ),
            discs.length === 0
              ? React.createElement('div', { style: { color: 'var(--fg-3)', fontSize: 12 } }, 'No disciplines. Add one from the menu above.')
              : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
                discs.map((d, i) => {
                  const def = PSI.disciplines.find(x => x.name === d.name) || {};
                  return React.createElement('div', { key: i, style: { padding: 10, background: 'var(--bg-1)', border: '1px solid var(--border-soft)', borderRadius: 6 } },
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                      React.createElement('span', { style: { fontWeight: 600, fontSize: 13, color: 'var(--accent-2)' } }, d.name),
                      React.createElement('span', { className: 'tag', style: { fontSize: 10 } }, 'core: ' + def.core),
                      React.createElement('span', { style: { marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' } },
                        React.createElement('span', { style: { fontSize: 10, color: 'var(--fg-3)' } }, 'Lvl'),
                        React.createElement('select', { value: d.level, onChange: e => update({ disciplines: discs.map((x, j) => j === i ? { ...x, level: +e.target.value } : x) }), style: { width: 'auto', padding: '1px 4px', fontSize: 11 } },
                          [0, 1, 2, 3, 4].map(n => React.createElement('option', { key: n, value: n }, n))),
                        React.createElement('button', { className: 'ghost danger', style: { fontSize: 11, padding: '2px 6px' }, onClick: () => update({ disciplines: discs.filter((_, j) => j !== i) }) }, '×')
                      )
                    ),
                    React.createElement('div', { style: { fontSize: 12, color: 'var(--fg-2)', marginTop: 4 } }, def.desc),
                    React.createElement('details', { style: { marginTop: 6 } },
                      React.createElement('summary', { style: { cursor: 'pointer', fontSize: 11, color: 'var(--fg-3)' } }, 'Techniques'),
                      React.createElement('ul', { style: { margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--fg-1)' } },
                        (def.techniques || []).map((t, ti) => React.createElement('li', { key: ti, style: { marginBottom: 3 } }, t))
                      )
                    )
                  );
                })
              )
          )
        );
      })(),

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
      ) // end read-only wrapper
    ) : React.createElement('div', { className: 'empty' },
      React.createElement('div', null, isGM ? 'No PCs yet.' : 'You don’t have a character yet.'),
      React.createElement('button', { className: 'primary', style: { marginTop: 10 }, onClick: () => setBuilderOpen(true) }, '✦ Create ' + (isGM ? 'a Character' : 'my character'))
    ),
    // Guided character builder modal
    builderOpen && React.createElement(CharacterBuilder, { me, onSetMyName, onCreate: onBuilderCreate, onClose: () => setBuilderOpen(false) })
  );
}

window.MissionGeneratorView = MissionGeneratorView;
window.EncounterGeneratorView = EncounterGeneratorView;
window.CharacterSheetsView = CharacterSheetsView;
