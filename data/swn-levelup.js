// SWN Revised level-up rules engine. Pure logic, no UI. Exposed as window.SWN_LEVELUP.
// Mechanical facts follow the Stars Without Number Revised free edition (character
// advancement, p.56-57). All math is derived; no rulebook prose is reproduced here.
(function () {
  // Cumulative XP needed to REACH a given level (index = level). 11+ adds 24 each.
  const XP_TABLE = [0, 0, 3, 6, 12, 18, 27, 39, 54, 72, 93];
  function xpForLevel(l) {
    if (l <= 1) return 0;
    if (l <= 10) return XP_TABLE[l];
    return 93 + (l - 10) * 24;
  }
  function levelFromXP(xp) {
    let lvl = 1;
    for (let l = 2; l <= 10; l++) if (xp >= XP_TABLE[l]) lvl = l;
    if (xp >= 93) lvl = Math.max(10, 10 + Math.floor((xp - 93) / 24));
    return lvl;
  }

  function attrMod(a) {
    if (a <= 3) return -2;
    if (a <= 7) return -1;
    if (a <= 13) return 0;
    if (a <= 17) return 1;
    return 2;
  }

  // Parse a stored class string into its mechanical flags.
  // Accepts "Warrior" | "Expert" | "Psychic" | "Adventurer (Warrior/Expert)" etc.
  function classKind(classStr) {
    const s = String(classStr || '');
    const isAdv = /adventurer/i.test(s);
    const parts = isAdv ? (s.match(/\(([^)]+)\)/)?.[1] || '').split('/').map(x => x.trim()) : [];
    return {
      adventurer: isAdv,
      warrior: s === 'Warrior',
      expert: s === 'Expert',
      psychic: s === 'Psychic',
      partialWarrior: isAdv && parts.some(p => /warrior/i.test(p)),
      partialExpert: isAdv && parts.some(p => /expert/i.test(p)),
      partialPsychic: isAdv && parts.some(p => /psychic/i.test(p)),
    };
  }

  // Base attack bonus by class + level (RAW: half level; Warriors full level;
  // Partial Warriors gain a cumulative +1 at levels 1 and 5).
  function babFor(classStr, level) {
    const k = classKind(classStr);
    if (k.warrior) return level;
    if (k.partialWarrior) return Math.floor(level / 2) + 1 + (level >= 5 ? 1 : 0);
    return Math.floor(level / 2);
  }

  // Warriors / Partial Warriors get +2 HP per level on top of the dice.
  function warriorHpBonusPerLevel(classStr) {
    const k = classKind(classStr);
    return (k.warrior || k.partialWarrior) ? 2 : 0;
  }

  // Roll new max HP for reaching `newLevel`: newLevel d6, each +CON mod (a die can't
  // drop below 1), plus 2/level for warriors. Keep it only if higher than current max;
  // otherwise max just rises by 1 (RAW).
  function rollHP(classStr, conScore, newLevel, currentMax) {
    const conMod = attrMod(conScore);
    const warBonus = warriorHpBonusPerLevel(classStr) * newLevel;
    const dice = [];
    let rolled = 0;
    for (let i = 0; i < newLevel; i++) {
      const d = Math.floor(Math.random() * 6) + 1;
      const v = Math.max(1, d + conMod);
      dice.push({ raw: d, value: v });
      rolled += v;
    }
    const rolledTotal = rolled + warBonus;
    const kept = rolledTotal > currentMax;
    return {
      dice, conMod, warBonus, rolledTotal,
      kept,                                   // true = took new total; false = +1 rule
      newMax: kept ? rolledTotal : currentMax + 1,
    };
  }

  // Skill point economy. Cost to RAISE a skill to a given level (cumulative, bought in
  // order): level-0 costs 1, level-1 costs 2 … i.e. reaching level L costs L+1.
  function skillCostTo(level) { return level + 1; }
  // Max skill level a character of `charLevel` may reach (RAW gates: 2@L3, 3@L6, 4@L9).
  function maxSkillLevel(charLevel) {
    if (charLevel >= 9) return 4;
    if (charLevel >= 6) return 3;
    if (charLevel >= 3) return 2;
    return 1;
  }
  // Skill points gained on a level-up.
  function skillPointsGained(classStr) {
    const k = classKind(classStr);
    return {
      base: 3,
      expertBonus: (k.expert || k.partialExpert) ? 1 : 0, // spend on non-combat, non-psychic
      psychicRequired: (k.psychic || k.partialPsychic),   // ≥1 point must go to psionics
    };
  }
  // Cost of the Nth attribute boost (1st=1, 2nd=2 …), max 5 ever.
  function attrBoostCost(nthBoost) { return nthBoost; }
  // Minimum character level required to PURCHASE the Nth attribute boost
  // (RAW: 1st/2nd@L1, 3rd@L3, 4th@L6, 5th@L9).
  function attrBoostMinLevel(nthBoost) {
    if (nthBoost >= 5) return 9;
    if (nthBoost === 4) return 6;
    if (nthBoost === 3) return 3;
    return 1;
  }
  // Minimum character level required to raise a skill TO a given level
  // (RAW: lvl-2@L3, lvl-3@L6, lvl-4@L9).
  function skillMinLevel(level) {
    if (level >= 4) return 9;
    if (level === 3) return 6;
    if (level === 2) return 3;
    return 1;
  }

  // A focus level is granted at levels 2, 5, 7, and 10.
  function fociDueAt(level) { return level === 2 || level === 5 || level === 7 || level === 10; }

  // Max psychic Effort = 1 + highest psychic skill level + best of WIS/CON mods.
  function maxEffort(disciplines, wisScore, conScore) {
    const hi = (disciplines || []).reduce((mx, d) => Math.max(mx, d.level ?? 0), 0);
    return 1 + hi + Math.max(attrMod(wisScore), attrMod(conScore));
  }

  window.SWN_LEVELUP = {
    XP_TABLE, xpForLevel, levelFromXP, attrMod, classKind, babFor,
    warriorHpBonusPerLevel, rollHP, skillCostTo, maxSkillLevel,
    skillPointsGained, attrBoostCost, attrBoostMinLevel, skillMinLevel, fociDueAt, maxEffort,
  };
})();
