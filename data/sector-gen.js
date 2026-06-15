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

  function makeFaction(rng) {
    const traits = rng.picks(SWN.factionTraits, 2);
    const assets = rng.picks(SWN.factionAssets, rng.int(3, 6));
    const themed = rng.pick(SWN.emberFactionNames);
    return {
      id: 'fac-' + rng.int(10000, 99999),
      name: themed,
      traits,
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

    const factions = [];
    const factionCount = rng.int(4, 7);
    for (let i = 0; i < factionCount; i++) {
      const f = makeFaction(rng.fork('fac-' + i));
      // Assign HQ to a populated planet.
      const populated = systems.flatMap(s => s.planets).filter(p =>
        !['Failed Colony', 'Outpost'].includes(p.population.name)
      );
      if (populated.length) {
        const hq = rng.pick(populated);
        f.hqPlanetId = hq.id;
        f.hqPlanetName = hq.name;
      }
      factions.push(f);
    }

    const npcs = [];
    for (let i = 0; i < 12; i++) {
      const n = makeNPC(rng.fork('npc-' + i));
      const allPlanets = systems.flatMap(s => s.planets);
      if (allPlanets.length) {
        const home = rng.pick(allPlanets);
        n.locationId = home.id;
        n.locationName = home.name;
      }
      npcs.push(n);
    }

    const allPlanets = systems.flatMap(s => s.planets);
    const hooks = [];
    for (let i = 0; i < 8; i++) {
      hooks.push(makeHook(rng.fork('hook-' + i), allPlanets));
    }

    const routes = makeRoutes(rng.fork('routes'), systems);

    // Timeline: 8–12 events spanning the last 50 years.
    const timeline = [];
    const eventCount = rng.int(8, 12);
    const baseYear = 3200;
    for (let i = 0; i < eventCount; i++) {
      timeline.push(makeTimelineEvent(
        rng.fork('evt-' + i),
        baseYear - rng.int(0, 50),
        factions,
        allPlanets
      ));
    }
    timeline.sort((a, b) => b.year - a.year);

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
