// Procedural sector generator for Stars Without Number.
// Generates a hex sector with stars, planets, factions, NPCs, and adventure hooks.

(function () {
  const SWN = window.SWN;
  const makeRNG = window.makeRNG;

  // Standard SWN sector: 8 columns × 10 rows hex grid.
  const SECTOR_COLS = 8;
  const SECTOR_ROWS = 10;

  function planetName(rng) {
    const { prefix, middle, suffix } = SWN.planetSyllables;
    let name = rng.pick(prefix);
    if (rng.chance(0.4)) name += rng.pick(middle);
    name += rng.pick(suffix);
    if (rng.chance(0.15)) name += ' ' + ['Prime', 'Secundus', 'Tertius', 'Quartus', 'Major', 'Minor', 'IX', 'VII', 'XII'][rng.int(0, 8)];
    return name;
  }

  function npcName(rng) {
    return rng.pick(SWN.firstNames) + ' ' + rng.pick(SWN.lastNames);
  }

  function rollOnTable(rng, table) {
    return rng.pick(table);
  }

  function makePlanet(rng, hexId, isPrimary = false) {
    const atmosphere = rollOnTable(rng, SWN.atmosphere);
    const temperature = rollOnTable(rng, SWN.temperature);
    const biosphere = rollOnTable(rng, SWN.biosphere);
    const population = rollOnTable(rng, SWN.population);
    const techLevel = rollOnTable(rng, SWN.techLevel);
    const tags = rng.picks(SWN.tags, 2);

    // Derive surface/biome category for procedural texture.
    let biome = 'rocky';
    if (atmosphere.habitable && biosphere.name.includes('Miscible')) biome = 'temperate';
    else if (temperature.name === 'Frozen') biome = 'ice';
    else if (temperature.name === 'Burning') biome = 'molten';
    else if (atmosphere.name.includes('Corrosive') || atmosphere.name.includes('Toxic')) biome = 'toxic';
    else if (biosphere.name.includes('Engineered') || biosphere.name.includes('Hybrid')) biome = 'engineered';
    if (tags.some(t => t.name === 'Desert World')) biome = 'desert';
    if (tags.some(t => t.name === 'Oceanic World')) biome = 'ocean';
    if (tags.some(t => t.name === 'Radioactive World')) biome = 'toxic';

    const radius = rng.int(45, 85) / 10; // 4.5–8.5 (display radius)
    const axialTilt = rng.int(0, 45);
    const dayLength = +(rng.float() * 60 + 8).toFixed(1); // hours
    const yearLength = rng.int(80, 2400); // local days
    const gravity = +(rng.float() * 1.6 + 0.3).toFixed(2); // 0.3–1.9 g

    return {
      id: hexId + '-' + rng.int(1000, 9999),
      name: planetName(rng),
      hexId,
      isPrimary,
      atmosphere,
      temperature,
      biosphere,
      population,
      techLevel,
      tags,
      biome,
      radius,
      axialTilt,
      dayLength,
      yearLength,
      gravity,
      moons: makeMoons(rng, biome),
      // Procedural texture seed (passed to canvas generator).
      textureSeed: rng.int(1, 100000),
      ringSystem: rng.chance(0.12),
      // GM notes (player-editable in app).
      notes: '',
    };
  }

  function makeMoons(rng, biome) {
    const count = rng.weighted([[0, 40], [1, 35], [2, 18], [3, 5], [4, 2]]);
    const moons = [];
    for (let i = 0; i < count; i++) {
      moons.push({
        name: 'Moon ' + String.fromCharCode(65 + i),
        radius: +(rng.float() * 1.5 + 0.4).toFixed(2),
        distance: 2.5 + i * 1.2 + rng.float() * 0.5,
        biome: rng.pick(['rocky', 'ice', 'desert', 'rocky']),
        textureSeed: rng.int(1, 100000),
      });
    }
    return moons;
  }

  function makeStarSystem(rng, hexId) {
    const starClass = rng.weighted(SWN.starWeights);
    const starType = SWN.starTypes.find(s => s.class === starClass);
    const planetCount = rng.weighted([[1, 25], [2, 30], [3, 25], [4, 12], [5, 6], [6, 2]]);
    const planets = [];
    for (let i = 0; i < planetCount; i++) {
      const p = makePlanet(rng.fork('planet-' + i), hexId, i === 0);
      // First planet is the "primary" — usually the populated one
      planets.push(p);
    }
    const starName = rng.pick(SWN.planetSyllables.prefix) + rng.pick(SWN.planetSyllables.suffix);
    return {
      hexId,
      starName,
      starType,
      planets,
    };
  }

  function hexAxial(col, row) {
    // Offset coords to pixel position (pointy-top hex).
    // Returns { x, y } in unit-hex coordinates.
    const x = col * 1.5;
    const y = row * Math.sqrt(3) + (col % 2 ? Math.sqrt(3) / 2 : 0);
    return { x, y };
  }

  function hexDistance(a, b) {
    // Convert offset to cube, then compute.
    const toCube = (col, row) => {
      const x = col;
      const z = row - (col - (col & 1)) / 2;
      const y = -x - z;
      return { x, y, z };
    };
    const ac = toCube(a.col, a.row);
    const bc = toCube(b.col, b.row);
    return (Math.abs(ac.x - bc.x) + Math.abs(ac.y - bc.y) + Math.abs(ac.z - bc.z)) / 2;
  }

  // Canonical lore factions — always present, stats reflect their description.
  // SWN tag pairs drawn from the official faction tag list.
  const LORE_FACTIONS = [
    {
      id: 'fac-river-below',
      name: 'The River Below',
      tags: ['Fanatical', 'Mercenary Group'],
      hp: 10, maxHp: 10,
      cunning: 5, force: 2, wealth: 2,
      goal: 'Destroy a rival faction outright',
      assets: [
        { name: 'Smuggler Ring', cost: 3, hp: 2 },
        { name: 'Spynet', cost: 3, hp: 2 },
        { name: 'Mercenary Squad', cost: 2, hp: 2 },
      ],
      notes: 'Anti-establishment punk gang. High cunning, low profile. Leaders are called Saints.',
      loreId: 'river_below',
    },
    {
      id: 'fac-pale-substrate',
      name: 'The Pale Substrate',
      tags: ['Plutocratic', 'Planetary Government'],
      hp: 20, maxHp: 20,
      cunning: 6, force: 4, wealth: 5,
      goal: 'Discover a long-buried secret',
      assets: [
        { name: 'Spynet', cost: 3, hp: 2 },
        { name: 'Cyber-ninjas', cost: 4, hp: 4 },
        { name: 'Banking Concern', cost: 5, hp: 3 },
        { name: 'Postech Industries', cost: 4, hp: 4 },
      ],
      notes: 'AI-governed technocracy. PALE holds Cognitive Leases on all citizens. Maximum cunning.',
      loreId: 'pale_substrate',
    },
    {
      id: 'fac-progenitor-combine',
      name: 'Progenitor Combine',
      tags: ['Plutocratic', 'Mercenary Group'],
      hp: 18, maxHp: 18,
      cunning: 3, force: 2, wealth: 6,
      goal: 'Consolidate control of a single world',
      assets: [
        { name: 'Postech Industries', cost: 4, hp: 4 },
        { name: 'Banking Concern', cost: 5, hp: 3 },
        { name: 'Pretech Manufactory', cost: 6, hp: 4 },
      ],
      notes: 'Biotech clone cartel. Maximum wealth. Management are long-lived clone lineages.',
      loreId: 'progenitor_combine',
    },
    {
      id: 'fac-hollow-covenant',
      name: 'The Hollow Covenant',
      tags: ['Fanatical', 'Warlike'],
      hp: 14, maxHp: 14,
      cunning: 3, force: 5, wealth: 3,
      goal: 'Restore an ancient regime',
      assets: [
        { name: 'Mercenary Squad', cost: 2, hp: 2 },
        { name: 'Frigate Squadron', cost: 4, hp: 4 },
        { name: 'Religious Brotherhood', cost: 2, hp: 3 },
      ],
      notes: 'Survivors of a collapsed civilization. Internally split: Remembrance vs Becoming factions.',
      loreId: 'hollow_covenant',
    },
    {
      id: 'fac-aureole-synod',
      name: 'The Aureole Synod',
      tags: ['Theocratic', 'Secret Masters'],
      hp: 14, maxHp: 14,
      cunning: 5, force: 2, wealth: 4,
      goal: 'Maintain current status and maximise intelligence gathered',
      assets: [
        { name: 'Informational Sucker', cost: 3, hp: 2 },
        { name: 'Spynet', cost: 3, hp: 2 },
        { name: 'Religious Brotherhood', cost: 2, hp: 3 },
        { name: 'Demagogue', cost: 2, hp: 2 },
      ],
      notes: 'Pan-sector religious order secretly governed by an unbraked AI (AURIS). The congregation does not know. Confessional Archive gives leverage across all factions.',
      loreId: 'aureole_synod',
    },
    {
      id: 'fac-the-succession',
      name: 'The Succession',
      tags: ['Planetary Government', 'Imperialists'],
      hp: 18, maxHp: 18,
      cunning: 2, force: 5, wealth: 4,
      goal: 'Restore a former interstellar government',
      assets: [
        { name: 'Pretech Manufactory', cost: 6, hp: 4 },
        { name: 'Frigate Squadron', cost: 4, hp: 4 },
        { name: 'Colonial Garrison', cost: 4, hp: 3 },
        { name: 'Postech Industries', cost: 4, hp: 4 },
      ],
      notes: 'Mandate continuity government. Best technology in the sector. Legally considers clones property and PALE contracts invalid.',
      loreId: 'the_succession',
    },
    {
      id: 'fac-the-penumbra',
      name: 'The Penumbra',
      tags: ['Deep Rooted', 'Fanatical'],
      hp: 10, maxHp: 10,
      cunning: 5, force: 3, wealth: 2,
      goal: 'Expose a terrible secret to widespread knowledge',
      assets: [
        { name: 'Informational Sucker', cost: 3, hp: 2 },
        { name: 'Spynet', cost: 3, hp: 2 },
        { name: 'Saboteurs', cost: 2, hp: 2 },
      ],
      notes: 'Post-Scream investigative network. Holds the sector\'s most dangerous secrets. Senior members develop "pattern sickness."',
      loreId: 'the_penumbra',
    },
    {
      id: 'fac-argent-compact',
      name: 'The Argent Compact',
      tags: ['Peaceful', 'Deep Rooted'],
      hp: 12, maxHp: 12,
      cunning: 4, force: 1, wealth: 3,
      goal: 'Maintain the current status quo and peace',
      assets: [
        { name: 'Informational Sucker', cost: 3, hp: 2 },
        { name: 'Broker', cost: 2, hp: 2 },
        { name: 'Logistics Comet', cost: 3, hp: 3 },
      ],
      notes: 'Oldest library and sanctuary network in the sector. Neutral ground. Has Sub-Rosa archive of sector\'s most dangerous documents.',
      loreId: 'argent_compact',
    },
    {
      id: 'fac-driftborn',
      name: 'The Driftborn',
      tags: ['Mercenary Group', 'Exchange Consulate'],
      hp: 10, maxHp: 10,
      cunning: 3, force: 2, wealth: 4,
      goal: 'Maintain the freedom of trade and movement',
      assets: [
        { name: 'Smuggler Ring', cost: 3, hp: 2 },
        { name: 'Mercenary Squad', cost: 2, hp: 2 },
        { name: 'Free Merchant Fleet', cost: 3, hp: 3 },
        { name: 'Broker', cost: 2, hp: 2 },
      ],
      notes: 'Free trader and route-runner network. Sector\'s circulatory system. The Duskline (Session 1 escape ship) is Driftborn-affiliated.',
      loreId: 'driftborn',
    },
  ];

  // Canonical timeline events from Session 0 faction turns.
  // Year 3249 = campaign start year. Events are pre-session history.
  // revealed: false = GM-only until disclosed in play.
  const LORE_TIMELINE = [
    // Turn 1 — 6 months before Session 1 (~month 1 of 3249)
    { id: 'lt-01', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'PALE deploys a covert underwater survey team to Thessavar under commercial cover. Survey begins mapping pre-human ruins below the thermocline.' },
    { id: 'lt-02', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'The Aureole Synod opens a chapel in Kaeldrift (Thessavar). Brother Cass assigned as warden. Confessional records begin accumulating.' },
    { id: 'lt-03', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'River Below\'s Thessavar intelligence cell is destroyed when PALE detects their network intrusion. Operative Dosi disappears. Saint Maret burns the safe house and goes to ground.' },
    { id: 'lt-04', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'Penumbra Archivist Lenne arrives in Kaeldrift under cover as a marine biology doctoral student to investigate the underwater ruins.' },
    { id: 'lt-05', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'The Hollow Covenant deploys three frigates to Thessavar system as "honor escort" for Arbiter Senn\'s Concordance delegation.' },
    { id: 'lt-06', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'Progenitor Combine announces the Kael-8 line. Kael-7 series listed as legacy stock. One unit remains active in field deployment.' },
    { id: 'lt-07', year: 3200, month: 1, label: 'Turn 1 — 6 months out', revealed: false,
      text: 'The Succession files a notice of administrative observation over Thessavar and establishes a legal monitoring station in-system. The city council does not respond.' },

    // Turn 2 — 3 months before Session 1 (~month 4 of 3249)
    { id: 'lt-08', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'PALE burns Penumbra Archivist Lenne\'s cover and steals her research notes on the underwater ruins. She takes refuge in the Argent Compact sanctuary in Kaeldrift.' },
    { id: 'lt-09', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'The Aureole Synod learns through an unwitting Concordance official that Arbiter Senn plans to sign a treaty granting the Hollow Covenant excavation rights to the Thessavar ruins.' },
    { id: 'lt-10', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'Saint Maret accepts a contract to assassinate Arbiter Senn. She has no Wealth, no safe houses, no network. She begins scouting the Concordance alone.' },
    { id: 'lt-11', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'Progenitor Combine legal pressure shuts down the River Below\'s Grade 0 clone liberation pipeline. One junior Saint is arrested.' },
    { id: 'lt-12', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'Marshal Tran (Hollow Covenant, Remembrance faction) destroys a Succession observation post in an adjacent system without authorization. The Radiance is spreading through the Remembrance leadership.' },
    { id: 'lt-13', year: 3200, month: 4, label: 'Turn 2 — 3 months out', revealed: false,
      text: 'Two Succession frigates arrive at Thessavar system flying Mandate-era registry codes. Three Covenant frigates are already in orbit. Neither side fires.' },

    // Turn 3 — 2 weeks before Session 1 (~month 7 of 3249)
    { id: 'lt-14', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'PALE\'s survey team discovers the Thessavar ruins are an active transmission array of unknown origin — running continuously for at least four thousand years. The discovery is immediately classified.' },
    { id: 'lt-15', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'The Aureole Synod delays the Arbiter Senn excavation treaty signing by four days through procedural interference. The signing is rescheduled to the Concordance swan processional.' },
    { id: 'lt-16', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'River Below Saint Maret liquidates all remaining assets and arrives in Kaeldrift four days before the Concordance. She works the Still Gardens as groundskeeping staff for three days.' },
    { id: 'lt-17', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'The Penumbra loses its last Thessavar cell to a PALE trap. Archivist Lenne, alone in the Argent sanctuary, reconstructs her research from memory and writes: "The signal is not coming from the ruins. The ruins are the signal."' },
    { id: 'lt-18', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'Requisition Agent Tarek (Progenitor Combine) delivers a sealed message to Kael-7 and goes below the Kaeldrift platform to meet an unknown contact. He does not return.' },
    { id: 'lt-19', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'The Hollow Covenant\'s frigates are outmaneuvered by Succession Captain Solis and pulled back to orbit. Marshal Tran withdraws, humiliated. The Covenant\'s military position at Thessavar is neutralized the day before the Concordance.' },
    { id: 'lt-20', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'The Succession files a legal challenge to the excavation treaty on Mandate jurisdictional grounds. Arbiter Senn schedules the signing for the Concordance processional — publicly, to make it harder to stop.' },
    { id: 'lt-21', year: 3200, month: 7, label: 'Turn 3 — 2 weeks out', revealed: false,
      text: 'The Concordance begins. Every major faction has at least one asset in Kaeldrift or in Thessavar orbit. Nobody knows everyone else is here.' },

    // Session 1 (month 7) — public events, revealed
    { id: 'lt-s1a', year: 3200, month: 7, label: 'Session 1', revealed: true,
      text: 'THE STILL GARDENS DISASTER: the island estate collapses into the sea during the Concordance closing ceremony. Arbiter Senn and an estimated forty others are killed. Cause undetermined. Kaeldrift declares an exclusion zone.' },

    // Turn 4 — between Sessions 1 and 2 (month 8). Public news revealed:true; secrets false.
    { id: 'lt-22', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'PALE wins the Thessavar reconstruction contract — free counseling and substrate scans for the displaced.' },
    { id: 'lt-23', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: false,
      text: 'Under relief cover, PALE establishes a monitoring perimeter around the ruins exclusion zone.' },
    { id: 'lt-24', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: false,
      text: 'The Aureole Synod detects an anomalous repeating signal it cannot decode. AURIS is disturbed for the first time in 300 years.' },
    { id: 'lt-25', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: false,
      text: 'The Penumbra intercepts PALE survey data confirming the ruins are a transmission array — and prepares to publish.' },
    { id: 'lt-26', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'The Argent Compact\'s Kaeldrift sanctuary becomes the refugee center for the Concordance displaced.' },
    { id: 'lt-27', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'Driftborn freight rates triple on Thessavar routes; Fleet-Elder Brask caps relief cargo rates.' },
    { id: 'lt-28', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'Progenitor Combine files probate claims on the late Arbiter Senn\'s estate. Recovery agents dispatched to execute outstanding writs on manufactured assets.' },
    { id: 'lt-29', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'The Hollow Covenant recalls diplomats sector-wide. Covenant naval patrols increase.' },
    { id: 'lt-30', year: 3200, month: 8, label: 'Turn 4 — aftermath', revealed: true,
      text: 'The Succession\'s emergency jurisdiction claim over the Thessavar disaster zone is publicly rebuffed. Its frigates remain in-system.' },
  ];

  // Campaign NPCs — the people who actually appeared or matter right now.
  const LORE_NPCS = [
    { id: 'npc-veronika', name: 'Veronika "The Saint"', role: 'Bartender, Kaeldrift / secret head of the River Below', trait: 'Takes charge like gravity; guilt under the charm', goal: 'Hold her movement together; protect the two strangers she saved', hp: 8, maxHp: 8, notes: 'Rescued the PCs. West has fallen in under her authority. PCs don\'t know her faction.', locationName: 'The Duskline (with the party)' },
    { id: 'npc-coyle', name: 'Marn Coyle', role: 'Contract broker / fixer (pawn-and-assay front)', trait: 'Professionally bland; scrupulously neutral; afraid of one particular client', goal: 'Keep the books balanced and his name out of everything', hp: 4, maxHp: 4, notes: 'Enkh\'s broker. Will decline the 15k: "Cause of death doesn\'t match the commissioned work."', locationName: 'Belum Freeport' },
    { id: 'npc-darius', name: 'Darius Epps', role: 'Enkh\'s oldest friend; laborer', trait: 'Heavy drinker, loyal, misses the old Enkh', goal: 'Get Enkh out of PALE\'s ledger alive', hp: 6, maxHp: 6, notes: 'Still on Thessavar. Regular at Veronika\'s bar. Knew Div.', locationName: 'Kaeldrift, Thessavar' },
    { id: 'npc-ost', name: 'Ost (K7G2-87488-OST)', role: 'Kael-7 Grade 2 — West\'s surviving unit-mate', trait: 'Steady; chose the mission over survival', goal: 'Find Tarek', hp: 10, maxHp: 10, notes: 'On Thessavar, hunting Tarek. Subject to the same Combine repossession writ as West. Fate open.', locationName: 'Thessavar (last known)' },
    { id: 'npc-tarek', name: 'Requisition Agent Tarek', role: 'Progenitor Combine field agent (missing)', trait: 'Warm in a practiced-but-real way', goal: 'Unknown — left a warning and vanished', hp: 6, maxHp: 6, notes: 'Went below the Kaeldrift platform and did not return. Left West the locket + letter. Fate deliberately undecided.', locationName: 'Unknown' },
    { id: 'npc-vesper', name: 'Elder Vesper', role: 'Hollow Covenant — Becoming faction leader', trait: 'Warm, direct; joy as an act of defiance', goal: 'Become something the old world never had the courage to be', hp: 8, maxHp: 8, notes: 'Tarek\'s note says trust her. West\'s nominal chain of command. Not yet on screen.', locationName: 'Covenant territory' },
    { id: 'npc-tran', name: 'Marshal Onyx Tran', role: 'Hollow Covenant — Remembrance military commander', trait: 'Stoic veteran; Radiance-infected, increasingly reckless', goal: 'Restore the old empire at any cost; seize the relic', hp: 14, maxHp: 14, notes: 'Consolidating military power post-Senn. Has people looking for the Kael-7 survivors.', locationName: 'Covenant fleet' },
    { id: 'npc-calder', name: 'Captain Mira Calder', role: 'Driftborn captain of the Duskline', trait: 'Pragmatic; asks no questions she doesn\'t want answers to', goal: 'Run a clean ship in a dirty month', hp: 6, maxHp: 6, notes: 'Chartered by Veronika. First mate is a River Below informant (she knows; doesn\'t care).', locationName: 'The Duskline' },
    { id: 'npc-halex', name: 'Sister Halex', role: 'Hollow Covenant envoy (Becoming), Belum Freeport', trait: 'Direct, tired, no games', goal: 'Get Emmerin\'s dispatch to Elder Vesper', hp: 6, maxHp: 6, notes: 'Offers the Silent Courier mission. Legitimate Covenant authority — West\'s architecture notices.', locationName: 'Belum Freeport' },
  ];

  // Campaign hooks — the live threads, replacing procedural filler.
  const LORE_HOOKS = [
    { id: 'hook-payment', planetName: 'Belum Freeport', text: 'Enkh believes his contract is fulfilled — Senn is dead. All he has to do is contact Marn Coyle and collect 15,000 credits. What could go wrong?', status: 'Open' },
    { id: 'hook-locket', planetName: 'With West', text: 'The locket rides unsplit and untouched in West\'s pocket, warm at odd hours. Tarek\'s letter says: do not divide it. Do not trust it.', status: 'Open' },
    { id: 'hook-repo', planetName: 'Belum Freeport', text: 'A Progenitor Combine recovery team with a repossession writ has traced the Duskline\'s manifest. They are 2-4 days behind the party.', status: 'Open' },
    { id: 'hook-ost', planetName: 'Thessavar', text: 'Ost stayed behind to find Tarek. The urchin\'s note said: "Found Tarek. Leave now. Not safe." It was written in West\'s own handwriting.', status: 'Open' },
    { id: 'hook-veronika', planetName: 'The Duskline', text: 'Veronika is lying about knowing Tarek, something is weighing on her, and she is taking the party somewhere she calls "not safe."', status: 'Open' },
    { id: 'hook-vesper', planetName: 'Covenant territory', text: 'Tarek\'s letter: "Becoming has to know before Remembrance does. Trust Elder Vesper." Nobody has acted on it yet.', status: 'Open' },
  ];

  function makeFaction(rng) {
    const tags = rng.picks(SWN.factionTraits, 2);
    const assets = rng.picks(SWN.factionAssets, rng.int(3, 6));
    const themed = rng.pick(SWN.emberFactionNames);
    return {
      id: 'fac-' + rng.int(10000, 99999),
      name: themed,
      tags,
      hp: rng.int(8, 24),
      maxHp: 24,
      cunning: rng.int(1, 6),
      force: rng.int(1, 6),
      wealth: rng.int(1, 6),
      goal: rng.pick(SWN.factionGoals),
      assets,
      notes: '',
    };
  }

  // Veth — Player 1's origin world. Quiet agricultural margin world, hex A02.
  function makeVeth() {
    return {
      id: 'veth-prime',
      name: 'Veth',
      hexId: 'A02',
      isPrimary: true,
      atmosphere: { name: 'Breathable Mix', desc: 'Normal human-breathable atmosphere.', habitable: true },
      temperature: { name: 'Temperate', desc: 'Earth-like climate ranges.' },
      biosphere: { name: 'Human-Miscible', desc: 'Biosphere can support human metabolism.' },
      population: { name: 'Settled', range: 'A few million', desc: 'A stable, lightly populated world.' },
      techLevel: { tl: 'TL4', desc: 'Postech — interstellar baseline.' },
      tags: [
        { name: 'Agricultural World', desc: 'Farming and light manufacturing. Feeds nearby systems and stays out of faction politics.' },
        { name: 'PALE-Adjacent', desc: 'PALE wellness monitors arrived within the last fifteen years. The sector is changing around Veth the way weather changes around a rock.' },
      ],
      biome: 'temperate',
      radius: 5.9,
      axialTilt: 14,
      dayLength: 24.8,
      yearLength: 412,
      gravity: 0.91,
      moons: [{ name: 'Veth Minor', radius: 0.4, distance: 2.8, biome: 'rocky', textureSeed: 33821 }],
      textureSeed: 55102,
      ringSystem: false,
      notes: 'Player 1\'s origin world. He left in his twenties. His parents are long dead. Nobody there remembers who he was.',
    };
  }

  // Karrath — orbital industrial platform above a resource-extraction moon, hex F07.
  function makeKarrath() {
    return {
      id: 'karrath-platform',
      name: 'Karrath',
      hexId: 'F07',
      isPrimary: true,
      atmosphere: { name: 'Airless', desc: 'No breathable atmosphere. The platform is pressurized internally.', habitable: false },
      temperature: { name: 'Variable', desc: 'Extreme day/night swing. Platform maintains internal climate control.' },
      biosphere: { name: 'None', desc: 'No native biosphere.' },
      population: { name: 'Outpost', range: 'Thousands', desc: 'Industrial workforce. Rotational contracts. High turnover.' },
      techLevel: { tl: 'TL4', desc: 'Postech — interstellar baseline.' },
      tags: [
        { name: 'Orbital Industrial', desc: 'Primary habitation is an orbital platform above the extraction moon. The surface is automated.' },
        { name: 'PALE Wellness Contract', desc: 'PALE has held reconstruction contracts with platform operators for twenty years. The work kills people regularly enough that the market is reliable.' },
      ],
      biome: 'rocky',
      radius: 3.1,
      axialTilt: 2,
      dayLength: 18.4,
      yearLength: 280,
      gravity: 0.61,
      moons: [],
      textureSeed: 71445,
      ringSystem: false,
      notes: 'Site of Player 1\'s accident. Two jumps from Thessavar. PALE reconstructed him here from a three-week-old scan. The people he lost were not reconstructed.',
    };
  }

  // Synthesis Prime — Progenitor Combine's founding world, hex H03.
  function makeSynthesisPrime() {
    return {
      id: 'synthesis-prime',
      name: 'Synthesis Prime',
      hexId: 'H03',
      isPrimary: true,
      atmosphere: { name: 'Breathable Mix', desc: 'Human-breathable above the surface. Below Level 3, all environments are controlled and sealed.', habitable: true },
      temperature: { name: 'Temperate', desc: 'Climate-controlled throughout habitation zones.' },
      biosphere: { name: 'Engineered', desc: 'All surface biosphere is managed by the Combine. Nothing grows here that was not designed to.' },
      population: { name: 'Millions', range: 'Tens of millions', desc: 'Workforce, management clone lineages, and active clone population.' },
      techLevel: { tl: 'TL4+', desc: 'Postech with restricted pretech biotech. The Yards operates at the edge of what is permitted.' },
      tags: [
        { name: 'Cloning Facility', desc: 'The Progenitor Combine\'s founding world, built around the original cloning vaults. Player 2\'s homeworld.' },
        { name: 'Sealed Vaults', desc: 'Below Level 7, old Grade 0 lineages that proved non-viable were sealed rather than destroyed. Nobody goes below Level 7 anymore.' },
        { name: 'Corporate Controlled', desc: 'The Combine owns everything. There is no civilian government.' },
      ],
      biome: 'engineered',
      radius: 6.4,
      axialTilt: 4,
      dayLength: 22.1,
      yearLength: 445,
      gravity: 1.08,
      moons: [
        { name: 'Vault Moon', radius: 0.5, distance: 1.9, biome: 'rocky', textureSeed: 29301 },
      ],
      textureSeed: 93847,
      ringSystem: false,
      notes: 'Player 2\'s homeworld. Conditioning halls on Level 4. Sealed vaults below Level 7 are not as empty as advertised.',
    };
  }

  // Thessavar — fixed oceanic world, always placed at hex D05.
  function makeThessavar(rng) {
    return {
      id: 'thessavar-prime',
      name: 'Thessavar',
      hexId: 'D05',
      isPrimary: true,
      atmosphere: { name: 'Breathable Mix', desc: 'Normal human-breathable atmosphere.', habitable: true },
      temperature: { name: 'Temperate', desc: 'Earth-like climate ranges.' },
      biosphere: { name: 'Human-Miscible', desc: 'Biosphere can support human metabolism.' },
      population: { name: 'Settled', range: 'Tens of millions', desc: 'A stable, well-populated world.' },
      techLevel: { tl: 'TL4', desc: 'Postech — interstellar baseline. Limited spike drives.' },
      tags: [
        { name: 'Oceanic World', desc: 'Mostly or entirely covered in water.' },
        { name: 'Alien Ruins', desc: 'Remnants of a precursor civilization scattered across the world — here, beneath the ocean.' },
        { name: 'Seagoing Cities', desc: 'Population lives on floating or submerged platform cities.' },
        { name: 'Sealed Menace', desc: 'Something is locked in the ruins below the thermocline.' },
      ],
      biome: 'ocean',
      radius: 6.2,
      axialTilt: 11,
      dayLength: 27.4,
      yearLength: 390,
      gravity: 0.94,
      moons: [{ name: 'Moon A', radius: 0.6, distance: 2.5, biome: 'rocky', textureSeed: 41271 }],
      textureSeed: 88234,
      ringSystem: false,
      notes: 'Session 1 location. The Still Gardens is a private island estate south of the platform city Kaeldrift. Alien ruins below 400m — nobody goes past 600m voluntarily.',
    };
  }

  function makeNPC(rng) {
    // 3d6 attribute rolls.
    const attrs = {
      STR: rng.roll(3, 6), DEX: rng.roll(3, 6), CON: rng.roll(3, 6),
      INT: rng.roll(3, 6), WIS: rng.roll(3, 6), CHA: rng.roll(3, 6),
    };
    const level = rng.int(1, 6);
    const hp = rng.roll(level, 6) + Math.max(0, attrMod(attrs.CON)) * level;
    return {
      id: 'npc-' + rng.int(10000, 99999),
      name: npcName(rng),
      role: rng.pick(SWN.npcRoles),
      trait: rng.pick(SWN.npcTraits),
      goal: rng.pick(SWN.npcGoals),
      level,
      attrs,
      ac: 10 + rng.int(0, 6),
      ab: rng.int(0, 6) + Math.max(0, attrMod(attrs.DEX)),
      hp, maxHp: hp,
      skills: rng.picks(SWN.npcSkills, rng.int(2, 4)).map(s => ({ name: s, level: rng.int(0, 2) })),
      gear: rng.picks(SWN.npcGear, rng.int(1, 3)),
      morale: rng.int(6, 10),
      saves: {
        physical: 15 - Math.floor((Math.max(attrs.STR, attrs.CON) - 10) / 2) - level,
        evasion: 15 - Math.floor((Math.max(attrs.DEX, attrs.INT) - 10) / 2) - level,
        mental: 15 - Math.floor((Math.max(attrs.WIS, attrs.CHA) - 10) / 2) - level,
      },
      notes: '',
    };
  }

  function attrMod(a) {
    if (a <= 3) return -2;
    if (a <= 7) return -1;
    if (a <= 13) return 0;
    if (a <= 17) return 1;
    return 2;
  }

  function makeHook(rng, planets) {
    const p = rng.pick(planets);
    return {
      id: 'hook-' + rng.int(10000, 99999),
      planetId: p.id,
      planetName: p.name,
      text: capitalize(rng.pick(SWN.hookActions)) + ' '
        + rng.pick(SWN.hookObjects) + ' on '
        + p.name + ', ' + rng.pick(SWN.hookComplications) + '.',
      status: rng.pick(['Open', 'Open', 'Open', 'In Progress', 'Resolved']),
    };
  }

  function makeTimelineEvent(rng, year, factions, planets) {
    const templates = [
      () => `${rng.pick(factions).name} launches a covert operation against ${rng.pick(factions).name}.`,
      () => `A pretech relic surfaces on ${rng.pick(planets).name}, drawing salvors and scholars.`,
      () => `Trade tariffs collapse between ${rng.pick(planets).name} and ${rng.pick(planets).name}.`,
      () => `A Perimeter Agency cutter docks at ${rng.pick(planets).name} without explanation.`,
      () => `${rng.pick(planets).name} signs a defense pact with ${rng.pick(factions).name}.`,
      () => `An unbraked AI is rumored loose somewhere in the sector.`,
      () => `${rng.pick(factions).name} suffers a humiliating asset loss in ${rng.pick(planets).name} system.`,
      () => `A new spike drive route opens between distant systems.`,
    ];
    return {
      id: 'evt-' + rng.int(10000, 99999),
      year,
      text: rng.pick(templates)(),
    };
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Trade routes: connect populated worlds with hex-distance edges.
  function makeRoutes(rng, systems) {
    // Only consider one entry per SYSTEM (not per planet), and only systems whose primary world is populated.
    const populated = [];
    systems.forEach(s => {
      const hasPop = s.planets.some(p => !['Failed Colony', 'Outpost', 'Alien Inhabitants'].includes(p.population.name));
      if (hasPop) populated.push(s);
    });
    const routes = [];
    populated.forEach((sysA, i) => {
      const others = populated
        .filter((_, j) => j !== i)
        .map(sysB => ({ sysB, d: hexDistance(
          { col: sysA.col, row: sysA.row },
          { col: sysB.col, row: sysB.row }
        ) }))
        .filter(x => x.d > 0 && x.d <= 4)
        .sort((x, y) => x.d - y.d)
        .slice(0, rng.chance(0.5) ? 2 : 1);
      others.forEach(({ sysB, d }) => {
        const id = [sysA.hexId, sysB.hexId].sort().join('-');
        if (!routes.find(r => r.id === id)) {
          routes.push({
            id, fromHex: sysA.hexId, toHex: sysB.hexId, distance: d,
            traffic: rng.pick(['Light', 'Steady', 'Steady', 'Heavy']),
          });
        }
      });
    });
    return routes;
  }

  function generateSector(seed) {
    const rng = makeRNG(seed);
    const systems = [];
    // ~30% chance of system in each hex; SWN standard is ~25 worlds across 8x10.
    for (let col = 0; col < SECTOR_COLS; col++) {
      for (let row = 0; row < SECTOR_ROWS; row++) {
        if (rng.chance(0.32)) {
          const hexId = String.fromCharCode(65 + col) + String(row + 1).padStart(2, '0');
          const sys = makeStarSystem(rng.fork(hexId), hexId);
          sys.col = col;
          sys.row = row;
          systems.push(sys);
        }
      }
    }

    // Inject fixed narrative worlds.
    function injectFixedWorld(planet, col, row, starName, starClass) {
      const existing = systems.find(s => s.hexId === planet.hexId);
      if (existing) {
        existing.planets = [planet, ...existing.planets.filter(p => !p.isPrimary)];
      } else {
        systems.push({
          hexId: planet.hexId, col, row,
          starName,
          starType: SWN.starTypes.find(s => s.class === starClass) || SWN.starTypes[0],
          planets: [planet],
        });
      }
    }

    // Thessavar — session 1 world, D05.
    const thessavarSystem = systems.find(s => s.hexId === 'D05');
    if (thessavarSystem) {
      thessavarSystem.planets = [makeThessavar(rng.fork('thessavar')), ...thessavarSystem.planets.filter(p => !p.isPrimary)];
    } else {
      systems.push({ hexId: 'D05', col: 3, row: 4, starName: 'Thessis', starType: SWN.starTypes.find(s => s.class === 'G'), planets: [makeThessavar(rng.fork('thessavar'))] });
    }

    // Veth — Player 1 origin world, outer margin, A02.
    injectFixedWorld(makeVeth(), 0, 1, 'Vethis', 'K');

    // Karrath — Player 1 accident site, two jumps from Thessavar, F07.
    injectFixedWorld(makeKarrath(), 5, 6, 'Karrathis', 'M');

    // Synthesis Prime — Progenitor Combine HQ, Player 2 homeworld, H03.
    injectFixedWorld(makeSynthesisPrime(), 7, 2, 'Synthesis Star', 'G');

    const allPlanets = systems.flatMap(s => s.planets);

    // Always include all 9 lore factions, assign HQs to pinned or random planets.
    const factions = LORE_FACTIONS.map(f => ({ ...f }));
    const thessavar = allPlanets.find(p => p.id === 'thessavar-prime');
    const synthesisPrime = allPlanets.find(p => p.id === 'synthesis-prime');
    const populated = allPlanets.filter(p => !['Failed Colony', 'Outpost', 'Airless'].includes(p.population.name));

    // Pin specific faction HQs to narrative worlds.
    const covenant = factions.find(f => f.id === 'fac-hollow-covenant');
    if (covenant && thessavar) { covenant.hqPlanetId = thessavar.id; covenant.hqPlanetName = thessavar.name; }

    const combine = factions.find(f => f.id === 'fac-progenitor-combine');
    if (combine && synthesisPrime) { combine.hqPlanetId = synthesisPrime.id; combine.hqPlanetName = synthesisPrime.name; }

    // All other lore factions get random populated HQs.
    factions.filter(f => !['fac-hollow-covenant', 'fac-progenitor-combine'].includes(f.id)).forEach((f, i) => {
      const hq = populated.length ? rng.pick(populated) : null;
      if (hq) { f.hqPlanetId = hq.id; f.hqPlanetName = hq.name; }
    });

    // 9 canonical factions only — no random additions.

    // Campaign NPCs first (canonical cast), then a few procedural background faces.
    const npcs = LORE_NPCS.map(n => ({ ...n }));
    for (let i = 0; i < 4; i++) {
      const n = makeNPC(rng.fork('npc-' + i));
      if (allPlanets.length) {
        const home = rng.pick(allPlanets);
        n.locationId = home.id;
        n.locationName = home.name;
      }
      npcs.push(n);
    }

    // Campaign hooks only — the live threads. (Procedural filler removed;
    // add new hooks in LORE_HOOKS or via the app.)
    const hooks = LORE_HOOKS.map(h => ({ ...h }));

    const routes = makeRoutes(rng.fork('routes'), systems);

    // Timeline: canonical campaign events only. (Procedural historical filler
    // removed — it didn't align with campaign canon. Deep-history events can be
    // re-enabled by bumping eventCount above 0.)
    const timeline = [];
    const eventCount = 0;
    const baseYear = 3200;
    for (let i = 0; i < eventCount; i++) {
      timeline.push(makeTimelineEvent(
        rng.fork('evt-' + i),
        baseYear - rng.int(1, 49),
        factions,
        allPlanets
      ));
    }
    // Inject lore timeline events (Session 0 faction turns).
    LORE_TIMELINE.forEach(e => timeline.push({ ...e }));
    timeline.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return (b.month || 0) - (a.month || 0);
    });

    return {
      seed,
      cols: SECTOR_COLS,
      rows: SECTOR_ROWS,
      systems,
      factions,
      npcs,
      hooks,
      routes,
      timeline,
      sectorName: 'Cradle of Embers',
      sectorLore: 'An ancient stellar nursery — a vast ember-lit nebula where new worlds still coalesce from glowing dust. The Mandate seeded life here in the Last Bloom; what survived the Scream now claws back toward starflight amid the cradle\'s slow-cooling fire.',
    };
  }

  window.generateSector = generateSector;
  window.hexDistance = hexDistance;
  window.hexAxial = hexAxial;
})();
