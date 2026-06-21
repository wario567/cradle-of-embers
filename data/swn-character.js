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
      blurb: 'Hardened combatants who survive the violence that kills lesser adventurers. If you want to be the one who wins the firefight, pick this.',
      perks: ['+1 to hit from the start', '+2 max HP every level', 'Once per scene: negate a hit on you, or turn one of your misses into a hit', 'A free combat focus'],
    },
    {
      name: 'Expert',
      tagline: 'The skills specialist',
      blurb: 'Pilots, doctors, hackers, talkers, faces. The best at non-combat skills and clutch when it counts.',
      perks: ['Once per scene: reroll a failed skill check', 'A free non-combat focus', 'A bonus skill point every level'],
    },
    {
      name: 'Psychic',
      tagline: 'Rare psionic powers',
      blurb: 'One in tens of thousands. Channels strange mental energy for telepathy, telekinesis, precognition and more. Powerful but demanding.',
      perks: ['Two psychic skills (disciplines)', 'An Effort pool that fuels powers', 'Level-0 abilities from your disciplines'],
    },
    {
      name: 'Adventurer',
      tagline: 'A custom mix',
      blurb: "Doesn't fit one mold? Blend two of the above. Pick two “partial” talents to mix fighting, skills, and/or psionics.",
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
    { name: 'Barbarian', blurb: 'Raised on a savage, low-tech world of hardship and violence.', freeSkill: 'Survive', quickSkills: ['Survive', 'Notice', 'Any Combat'] },
    { name: 'Clergy', blurb: 'A consecrated priest, monastic, or warrior-monk of a faith.', freeSkill: 'Talk', quickSkills: ['Talk', 'Perform', 'Know'] },
    { name: 'Courtesan', blurb: 'Trades on charm and pleasurable, influential company.', freeSkill: 'Perform', quickSkills: ['Perform', 'Notice', 'Connect'] },
    { name: 'Criminal', blurb: 'Thief, grifter, smuggler, or worse — at home in the underworld.', freeSkill: 'Sneak', quickSkills: ['Sneak', 'Connect', 'Talk'] },
    { name: 'Dilettante', blurb: 'Born to money and leisure, dabbling in everything.', freeSkill: 'Connect', quickSkills: ['Connect', 'Know', 'Talk'] },
    { name: 'Entertainer', blurb: 'A performer who lives by talent and a crowd.', freeSkill: 'Perform', quickSkills: ['Perform', 'Talk', 'Connect'] },
    { name: 'Merchant', blurb: 'A peddler or far-trader who knows the value of things.', freeSkill: 'Trade', quickSkills: ['Trade', 'Talk', 'Connect'] },
    { name: 'Noble', blurb: 'Born to rank, or earned the social capital of one.', freeSkill: 'Lead', quickSkills: ['Lead', 'Connect', 'Administer'] },
    { name: 'Official', blurb: 'A functionary who knows how institutions really work.', freeSkill: 'Administer', quickSkills: ['Administer', 'Talk', 'Connect'] },
    { name: 'Peasant', blurb: 'A laborer of the land, primitive or high-tech.', freeSkill: 'Exert', quickSkills: ['Exert', 'Sneak', 'Survive'] },
    { name: 'Physician', blurb: 'A trained healer of body and mind.', freeSkill: 'Heal', quickSkills: ['Heal', 'Know', 'Notice'] },
    { name: 'Pilot', blurb: 'Flies starships, shuttles, vehicles — or rides beasts.', freeSkill: 'Pilot', quickSkills: ['Pilot', 'Fix', 'Shoot'] },
    { name: 'Politician', blurb: 'Aspires to leadership, persuasion, and control.', freeSkill: 'Talk', quickSkills: ['Talk', 'Lead', 'Connect'] },
    { name: 'Scholar', blurb: 'A scientist or academic with a keen mind.', freeSkill: 'Know', quickSkills: ['Know', 'Connect', 'Administer'] },
    { name: 'Soldier', blurb: 'A mercenary or conscript trained for war.', freeSkill: 'Any Combat', quickSkills: ['Any Combat', 'Exert', 'Survive'] },
    { name: 'Spacer', blurb: 'Grew up in the deep-space habs and ships.', freeSkill: 'Fix', quickSkills: ['Fix', 'Pilot', 'Program'] },
    { name: 'Technician', blurb: 'An engineer, artisan, or builder who fixes things.', freeSkill: 'Fix', quickSkills: ['Fix', 'Exert', 'Notice'] },
    { name: 'Thug', blurb: 'A ruffian and strong-arm, comfortable with intimidation.', freeSkill: 'Any Combat', quickSkills: ['Any Combat', 'Talk', 'Connect'] },
    { name: 'Vagabond', blurb: 'A wanderer with no home and a knack for getting by.', freeSkill: 'Survive', quickSkills: ['Survive', 'Sneak', 'Notice'] },
    { name: 'Worker', blurb: 'A cube drone or day laborer with a steady trade.', freeSkill: 'Work', quickSkills: ['Work', 'Connect', 'Exert'] },
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
