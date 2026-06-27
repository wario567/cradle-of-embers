// Character-creation reference data for the guided builder.
// Mechanical facts (free/quick skills, package contents, stat math) follow the
// Stars Without Number Revised free edition; all descriptive blurbs are written
// in plain, first-timer language. Exposed as window.SWN_CHARGEN.

window.SWN_CHARGEN = {
  // The six attributes and what they actually do in play.
  attributes: [
    { key: 'STR', name: 'Strength', blurb: 'Muscle. Melee attacks, hauling gear, brute force.' },
    { key: 'DEX', name: 'Dexterity', blurb: 'Speed and reflexes. Dodging, aim, and who acts first in a fight.' },
    { key: 'CON', name: 'Constitution', blurb: 'Toughness. Hit points, shrugging off poison, going without rest.' },
    { key: 'INT', name: 'Intelligence', blurb: 'Reasoning and training. Tech skills, hacking, book learning.' },
    { key: 'WIS', name: 'Wisdom', blurb: 'Awareness and judgment. Noticing things and reading situations.' },
    { key: 'CHA', name: 'Charisma', blurb: 'Presence. Charm, command, and being taken seriously.' },
  ],

  // Standard point array — assign these six numbers to the six attributes.
  array: [14, 12, 11, 10, 9, 7],

  // Attribute -> modifier (the number you actually add to rolls).
  attrMod(score) {
    if (score <= 3) return -2;
    if (score <= 7) return -1;
    if (score <= 13) return 0;
    if (score <= 17) return 1;
    return 2;
  },

  // The four classes, framed for someone who's never played.
  classes: [
    {
      name: 'Warrior',
      tagline: 'Good in a fight',
      blurb: 'The professional soldier, mercenary, bounty hunter, or hardened survivor — built to win fights and walk away. Warriors hit more reliably, soak more punishment, and shrug off blows that would drop anyone else. When a battle turns, their training tips the odds in their favor.',
      perks: ['+1 to hit from the start', '+2 max HP every level', 'Once per scene: negate a hit on you, or turn one of your misses into a hit', 'A free combat focus'],
    },
    {
      name: 'Expert',
      tagline: 'The skills specialist',
      blurb: 'Pilots, physicians, hackers, smooth talkers, fixers — the specialist who makes the rest of the crew possible. Experts are unmatched outside of combat, wringing extra mileage from every skill and salvaging a botched roll when failure isn’t an option. They also learn faster than anyone else.',
      perks: ['Once per scene: reroll a failed skill check', 'A free non-combat focus', 'A bonus skill point every level'],
    },
    {
      name: 'Psychic',
      tagline: 'Rare psionic powers',
      blurb: 'A rare few — perhaps one in tens of thousands — are born able to touch the metadimensional substrate and bend it to their will. Through disciplined training they wield telepathy, telekinesis, precognition, biopsionics and more, spending Effort to fuel their techniques. That power comes at a cost: overreach invites system strain.',
      perks: ['Two psychic skills (disciplines)', 'An Effort pool that fuels powers', 'Level-0 abilities from your disciplines'],
    },
    {
      name: 'Adventurer',
      tagline: 'A custom mix',
      blurb: 'Some heroes refuse to fit a single mold. The Adventurer blends two “partial” classes — Warrior, Expert, or Psychic — trading peak mastery for flexibility. Build a gunslinging face, a psychic pilot, or any hybrid your concept calls for.',
      perks: ['Choose two of: Partial Warrior, Partial Expert, Partial Psychic', 'Partial Warrior: +1 to hit & a combat focus', 'Partial Expert: a non-combat focus', 'Partial Psychic: one psychic skill'],
    },
  ],

  // Plain one-liners for every skill, so a new player knows what they're getting.
  skills: {
    'Administer': 'Run organizations, paperwork, bureaucracy, and law.',
    'Connect': 'Know the right people and get them to help you.',
    'Exert': 'Physical feats — run, jump, climb, swim, throw.',
    'Fix': 'Build and repair gear, from blades to fusion reactors.',
    'Heal': 'Medicine — stabilize the dying, cure disease, treat minds.',
    'Know': 'Academic and scientific facts and analysis.',
    'Lead': 'Make people follow you, even against their better judgment.',
    'Notice': 'Spot ambushes, search, and read people.',
    'Perform': 'Sing, act, dance, orate — move a crowd.',
    'Pilot': 'Fly ships, drive vehicles, ride beasts.',
    'Program': 'Operate, hack, and decrypt computers and comms.',
    'Punch': 'Fight unarmed.',
    'Shoot': 'Ranged combat — pistols, rifles, ship guns.',
    'Sneak': 'Stealth, disguise, infiltration, sleight of hand.',
    'Stab': 'Melee combat with weapons.',
    'Survive': 'Food, water, shelter, and staying alive in the wild.',
    'Talk': 'Persuade, charm, or lie face to face.',
    'Trade': 'Buy, sell, and read the market.',
    'Work': 'A trade or day-job craft you grew up doing.',
    'Any Combat': 'A combat skill of your choice — Shoot, Stab, or Punch.',
  },

  // 20 official backgrounds (d20 order). freeSkill is granted automatically;
  // quickSkills are the rulebook's recommended starting set (includes the free skill).
  backgrounds: [
    { name: 'Barbarian', blurb: 'Your hero hails from a savage, low-tech world — one wrecked by war, stripped of vital resources, or settled by deliberate Luddites. They came up amid hardship and violence, far from the comforts of star-flight.', freeSkill: 'Survive', quickSkills: ['Survive', 'Notice', 'Any Combat'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Mental","Exert","Any Skill"], learning: ["Any Combat","Connect","Exert","Lead","Notice","Punch","Sneak","Survive"] },
    { name: 'Clergy', blurb: 'A devoted servant of one of the countless faiths spread across the sectors — an ordinary priest or priestess, a cloistered monastic, or a martial warrior-monk. Their creed shapes how they move through the galaxy.', freeSkill: 'Talk', quickSkills: ['Talk', 'Perform', 'Know'], growth: ["+1 Any Stat","+2 Mental","+2 Physical","+2 Mental","Connect","Any Skill"], learning: ["Administer","Connect","Know","Lead","Notice","Perform","Talk","Talk"] },
    { name: 'Courtesan', blurb: 'Your hero made their living through offered companionship — anything from a streetwalker scraping by to an elite companion whose conversation and grace command high fees among the wealthy.', freeSkill: 'Perform', quickSkills: ['Perform', 'Notice', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Physical","Connect","Any Skill"], learning: ["Any Combat","Connect","Exert","Notice","Perform","Survive","Talk","Trade"] },
    { name: 'Criminal', blurb: 'A thief, grifter, smuggler, or something worse — equally at home picking pockets or working a syndicate. The underworld is where they learned their trade.', freeSkill: 'Sneak', quickSkills: ['Sneak', 'Connect', 'Talk'], growth: ["+1 Any Stat","+2 Mental","+2 Physical","+2 Mental","Connect","Any Skill"], learning: ["Administer","Any Combat","Connect","Notice","Program","Sneak","Talk","Trade"] },
    { name: 'Dilettante', blurb: 'Born to wealth and idleness, your hero dabbled in a little of everything without ever needing to master any of it. Money and the right connections opened every door.', freeSkill: 'Connect', quickSkills: ['Connect', 'Know', 'Talk'], growth: ["+1 Any Stat","+1 Any Stat","+1 Any Stat","+1 Any Stat","Connect","Any Skill"], learning: ["Any Skill","Any Skill","Connect","Know","Perform","Pilot","Talk","Trade"] },
    { name: 'Entertainer', blurb: 'A singer, actor, dancer, or showman who lives by raw talent and a paying crowd. The road and the stage taught them exactly how people work.', freeSkill: 'Perform', quickSkills: ['Perform', 'Talk', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Physical","Connect","Any Skill"], learning: ["Any Combat","Connect","Exert","Notice","Perform","Perform","Sneak","Talk"] },
    { name: 'Merchant', blurb: 'A trader, peddler, or far-flung dealer who can size up the worth of any good — or any person. Profit is found wherever cargo changes hands.', freeSkill: 'Trade', quickSkills: ['Trade', 'Talk', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Any Combat","Connect","Fix","Know","Notice","Trade","Talk"] },
    { name: 'Noble', blurb: 'Born to rank, or shrewd enough to earn its privileges — your hero moves easily in circles of power and is accustomed to being obeyed.', freeSkill: 'Lead', quickSkills: ['Lead', 'Connect', 'Administer'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Any Combat","Connect","Know","Lead","Notice","Pilot","Talk"] },
    { name: 'Official', blurb: 'A bureaucrat, administrator, or agent who knows how institutions actually function behind the official story. Procedure and paperwork are weapons in their hands.', freeSkill: 'Administer', quickSkills: ['Administer', 'Talk', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Any Skill","Connect","Know","Lead","Notice","Talk","Trade"] },
    { name: 'Peasant', blurb: 'A laborer who works the land or the line, whether with primitive tools or high-tech rigs. Endurance and quiet resilience come naturally to them.', freeSkill: 'Exert', quickSkills: ['Exert', 'Sneak', 'Survive'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Physical","Exert","Any Skill"], learning: ["Connect","Exert","Fix","Notice","Sneak","Survive","Trade","Work"] },
    { name: 'Physician', blurb: 'A trained healer of body and sometimes mind, schooled in medicine on a world that still had it to teach. Wherever there is injury or disease, they are needed.', freeSkill: 'Heal', quickSkills: ['Heal', 'Know', 'Notice'], growth: ["+1 Any Stat","+2 Physical","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Connect","Fix","Heal","Know","Notice","Talk","Trade"] },
    { name: 'Pilot', blurb: 'Born to the controls — starships, shuttles, ground vehicles, even living mounts. Little that moves can refuse to obey their hands.', freeSkill: 'Pilot', quickSkills: ['Pilot', 'Fix', 'Shoot'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Mental","Connect","Any Skill"], learning: ["Connect","Exert","Fix","Notice","Pilot","Pilot","Shoot","Trade"] },
    { name: 'Politician', blurb: 'A maneuverer of people and power, skilled at persuasion, alliance, and quiet control. Leadership is the goal; influence is the method.', freeSkill: 'Talk', quickSkills: ['Talk', 'Lead', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Connect","Connect","Lead","Notice","Perform","Talk","Talk"] },
    { name: 'Scholar', blurb: 'A scientist or academic with a sharp, trained mind and a deep well of knowledge. Curiosity — or ambition — eventually pulled them out among the stars.', freeSkill: 'Know', quickSkills: ['Know', 'Connect', 'Administer'], growth: ["+1 Any Stat","+2 Mental","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Connect","Fix","Know","Notice","Perform","Program","Talk"] },
    { name: 'Soldier', blurb: 'A trained warfighter, whether enlisted conscript or career mercenary. Discipline, drill, and the hard realities of combat are second nature.', freeSkill: 'Any Combat', quickSkills: ['Any Combat', 'Exert', 'Survive'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Physical","Exert","Any Skill"], learning: ["Administer","Any Combat","Exert","Fix","Lead","Notice","Sneak","Survive"] },
    { name: 'Spacer', blurb: 'Raised in the deep-space habs, stations, and ships where hard vacuum is always one hull away. The void is home in a way planet-dwellers never quite understand.', freeSkill: 'Fix', quickSkills: ['Fix', 'Pilot', 'Program'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Mental","Exert","Any Skill"], learning: ["Administer","Connect","Exert","Fix","Know","Pilot","Program","Talk"] },
    { name: 'Technician', blurb: 'An engineer, artisan, or builder who keeps machines running and broken things whole. If it can be repaired, they are the one to do it.', freeSkill: 'Fix', quickSkills: ['Fix', 'Exert', 'Notice'], growth: ["+1 Any Stat","+2 Physical","+2 Mental","+2 Mental","Connect","Any Skill"], learning: ["Administer","Connect","Exert","Fix","Fix","Know","Notice","Pilot"] },
    { name: 'Thug', blurb: 'A brute and strong-arm who solves problems with muscle and menace. Intimidation is a tool they have never been shy to use.', freeSkill: 'Any Combat', quickSkills: ['Any Combat', 'Talk', 'Connect'], growth: ["+1 Any Stat","+2 Mental","+2 Physical","+2 Physical","Connect","Any Skill"], learning: ["Any Combat","Connect","Exert","Notice","Sneak","Stab or Shoot","Survive","Talk"] },
    { name: 'Vagabond', blurb: 'A drifter with no fixed home and an instinct for surviving anywhere. They get by on wits, nerve, and whatever the next world happens to offer.', freeSkill: 'Survive', quickSkills: ['Survive', 'Sneak', 'Notice'], growth: ["+1 Any Stat","+2 Physical","+2 Physical","+2 Mental","Exert","Any Skill"], learning: ["Any Combat","Connect","Notice","Perform","Pilot","Sneak","Survive","Work"] },
    { name: 'Worker', blurb: 'A steady tradesperson or laborer with an honest craft and the calluses to prove it. Reliable work was always the point.', freeSkill: 'Work', quickSkills: ['Work', 'Connect', 'Exert'], growth: ["+1 Any Stat","+1 Any Stat","+1 Any Stat","+1 Any Stat","Exert","Any Skill"], learning: ["Administer","Any Skill","Connect","Exert","Fix","Pilot","Program","Work"] },
  ],

  // A curated, beginner-friendly slice of the focus list. type drives which
  // class gets it "for free"; grantsSkill is applied on creation.
  foci: [
    { name: 'Sniper', type: 'combat', grantsSkill: 'Shoot', blurb: 'A patient marksman. You hit harder and farther with aimed shots.' },
    { name: 'Gunslinger', type: 'combat', grantsSkill: 'Shoot', blurb: 'Lightning on the draw. Quicker and deadlier with pistols.' },
    { name: 'Die Hard', type: 'combat', grantsSkill: '', blurb: 'Stupidly hard to kill. +2 max HP per level and you keep going when others drop.' },
    { name: 'Armsman', type: 'combat', grantsSkill: 'Stab', blurb: 'A blade master. Add your skill to melee damage and ready a weapon in a blink.' },
    { name: 'Unarmed Combatant', type: 'combat', grantsSkill: 'Punch', blurb: 'Dangerous with bare hands — your fists hit like weapons.' },
    { name: 'Alert', type: 'combat', grantsSkill: 'Notice', blurb: "Never caught off guard. You can't be surprised and you act fast." },
    { name: 'Healer', type: 'noncombat', grantsSkill: 'Heal', blurb: 'A gifted medic. You save lives others would lose.' },
    { name: 'Specialist', type: 'noncombat', grantsSkill: '', blurb: 'Exceptional at one chosen skill — reliably better than anyone around.' },
    { name: 'Diplomat', type: 'noncombat', grantsSkill: 'Talk', blurb: 'Smooth and persuasive. You can defuse fights and win people over.' },
    { name: 'Star Captain', type: 'noncombat', grantsSkill: 'Pilot', blurb: 'Born for the bridge. Better at flying ships and leading a crew.' },
  ],

  // Starting equipment packages (pick one instead of buying gear). ac is the
  // armor's base; final AC = ac + Dexterity modifier.
  packages: [
    { name: 'Gunslinger', suggestedFor: ['Warrior', 'Adventurer'], weapons: [{ name: 'Laser Pistol', dmg: '1d6', range: '30' }, { name: 'Monoblade Knife', dmg: '1d6', range: '—' }], armorName: 'Armored Undersuit', ac: 13, items: ['8 type A cells', 'Backpack', 'Compad'], credits: 100 },
    { name: 'Soldier', suggestedFor: ['Warrior', 'Adventurer'], weapons: [{ name: 'Combat Rifle', dmg: '1d12', range: '100' }, { name: 'Knife', dmg: '1d4', range: '—' }], armorName: 'Woven Body Armor', ac: 15, items: ['80 rounds ammo', 'Backpack', 'Compad'], credits: 100 },
    { name: 'Scout', suggestedFor: ['Expert', 'Warrior', 'Adventurer'], weapons: [{ name: 'Laser Rifle', dmg: '1d10', range: '200' }, { name: 'Knife', dmg: '1d4', range: '—' }], armorName: 'Armored Vacc Suit', ac: 13, items: ['8 type A cells', 'Survey scanner', 'Survival kit', 'Binoculars'], credits: 25 },
    { name: 'Medic', suggestedFor: ['Expert', 'Psychic'], weapons: [{ name: 'Laser Pistol', dmg: '1d6', range: '30' }], armorName: 'Secure Clothing', ac: 13, items: ['Medkit', '4 Lazarus patches', '2 doses of Lift', 'Bioscanner', 'Compad'], credits: 25 },
    { name: 'Civilian', suggestedFor: ['Expert', 'Psychic', 'Adventurer'], weapons: [], armorName: 'Secure Clothing', ac: 13, items: ['Compad'], credits: 700 },
    { name: 'Technician', suggestedFor: ['Expert'], weapons: [{ name: 'Laser Pistol', dmg: '1d6', range: '30' }, { name: 'Monoblade Knife', dmg: '1d6', range: '—' }], armorName: 'Armored Undersuit', ac: 13, items: ['Postech toolkit', 'Metatool', '6 spare parts', 'Dataslab'], credits: 200 },
    { name: 'Barbarian', suggestedFor: ['Warrior'], weapons: [{ name: 'Spear', dmg: '1d6+1', range: '—' }, { name: 'Knife', dmg: '1d4', range: '—' }], armorName: 'Primitive Hide Armor', ac: 13, items: ['Primitive shield (+1 AC)', '7 days rations', '20m rope', 'Backpack'], credits: 500 },
    { name: 'Blade', suggestedFor: ['Warrior', 'Adventurer'], weapons: [{ name: 'Monoblade Sword', dmg: '1d8+1', range: '—' }, { name: 'Thermal Knife', dmg: '1d6', range: '—' }], armorName: 'Woven Body Armor', ac: 15, items: ['Secure Clothing', 'Lazarus patch', 'Compad'], credits: 50 },
    { name: 'Thief', suggestedFor: ['Expert', 'Adventurer'], weapons: [{ name: 'Laser Pistol', dmg: '1d6', range: '30' }, { name: 'Monoblade Knife', dmg: '1d6', range: '—' }], armorName: 'Armored Undersuit', ac: 13, items: ['Climbing harness', 'Low-light goggles', 'Metatool', 'Backpack'], credits: 25 },
    { name: 'Hacker', suggestedFor: ['Expert', 'Psychic'], weapons: [{ name: 'Laser Pistol', dmg: '1d6', range: '30' }], armorName: 'Secure Clothing', ac: 13, items: ['Postech toolkit', 'Metatool', '3 spare parts', '2 line shunts', 'Dataslab'], credits: 25 },
  ],
};
