// Aggregate all campaign lore into one listen-friendly HTML, then chrome→PDF.
//
// Regenerate the audio-reference PDF after lore changes:
//   node tools/build-lore-pdf.js            # writes tools/lore.html
//   <chromium> --headless --no-sandbox --print-to-pdf=handouts/cradle-of-embers-lore.pdf \
//     --print-to-pdf-no-header file://$PWD/tools/lore.html
// (PDFs are .gitignored — the PDF is the deliverable, this script is the source.)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data/gm-lore.js'));
const L = global.window.GM_LORE;

const out = [];
const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const H1 = t => out.push(`<h1>${esc(t)}</h1>`);
const H2 = t => out.push(`<h2>${esc(t)}</h2>`);
const H3 = t => out.push(`<h3>${esc(t)}</h3>`);
const P  = t => { if (t != null && String(t).trim()) out.push(`<p>${esc(t)}</p>`); };
const LEAD = (lab, t) => { if (t != null && String(t).trim()) out.push(`<p><span class="lab">${esc(lab)}.</span> ${esc(t)}</p>`); };
const UL = arr => { if (arr && arr.length) out.push('<ul>' + arr.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>'); };

// ── TITLE ──
out.push('<div class="cover"><h1 class="title">CRADLE OF EMBERS</h1>' +
  '<p class="sub">The Complete Campaign Bible — Audio Reference</p>' +
  '<p class="sub small">Stars Without Number · read-aloud edition</p></div>');

// ── SECTOR ──
H1('The Sector');
if (L.sector) {
  H2(L.sector.name || 'The Cradle');
  LEAD('Overview', L.sector.overview);
  LEAD('Theme', L.sector.theme);
  LEAD('The science behind the name', L.sector.scienceTerm);
  LEAD('The ignition front', L.sector.ignitionFrontNote);
}

// ── FACTIONS ──
H1('The Nine Factions');
(L.factions || []).forEach(f => {
  H2(f.name);
  if (f.tagline) P(f.tagline);
  if (f.swnTags) LEAD('Faction tags', f.swnTags.join(', '));
  if (f.stats) LEAD('Stats', `Cunning ${f.stats.cunning}, Force ${f.stats.force}, Wealth ${f.stats.wealth}, HP ${f.stats.hp}`);
  LEAD('Name origin', f.nameOrigin);
  LEAD('The science behind the name', f.scienceTerm);
  if (f.gmNotes) { H3('GM notes'); String(f.gmNotes).split(/\n\n+/).forEach(P); }
  if (f.secrets && f.secrets.length) { H3('Secrets'); UL(f.secrets); }
  if (f.npcs && f.npcs.length) {
    H3('People');
    f.npcs.forEach(n => {
      const bits = [n.role, n.trait].filter(Boolean).join(' — ');
      P(`${n.name}${bits ? ': ' + bits : ''}.` + (n.quote ? ` Quote: ${n.quote}` : '') + (n.secret ? ` Secret: ${n.secret}` : ''));
    });
  }
});

// ── NOTABLE WORLDS ──
if (L.notableWorlds && L.notableWorlds.length) {
  H1('Notable Worlds');
  L.notableWorlds.forEach(w => {
    H2(w.name || w.id);
    if (w.tags) LEAD('Tags', Array.isArray(w.tags) ? w.tags.join(', ') : w.tags);
    LEAD('Description', w.description);
    LEAD('GM notes', w.gmNotes);
  });
}

// ── PLAYER CHARACTERS ──
H1('The Player Characters');
(L.playerCharacters || []).forEach(pc => {
  H2(pc.playerName + (pc.name ? ' — ' + pc.name : ''));
  LEAD('Concept', pc.characterConcept);
  if (pc.inspirations) LEAD('Inspirations', pc.inspirations.join(', '));
  if (pc.gmNotes) { H3('GM notes'); String(pc.gmNotes).split(/\n\n+/).forEach(P); }
  if (pc.moralChallenges && pc.moralChallenges.length) { H3('Moral challenges'); UL(pc.moralChallenges); }
});

// Full player backgrounds from handouts
['player1-background.md','player2-background.md'].forEach(fn => {
  const p = path.join(ROOT, 'handouts', fn);
  if (fs.existsSync(p)) { H2('Full background: ' + fn.replace('-background.md','')); mdToProse(fs.readFileSync(p,'utf8')); }
});

// ── DECIDED THREADS ──
H1('Decided Story Threads');
if (L.enkhContract) {
  H2("Enkh's Contract — who hired him, and the trap");
  const c = L.enkhContract;
  LEAD('The client', c.client);
  LEAD('Why the number was exact', c.whyExactNumber);
  LEAD('The trap', c.theTrap);
  LEAD('Where the player is now', c.playerState);
  LEAD('The scene', c.theScene);
  if (c.broker) { H3('The broker'); P(`${c.broker.name}, ${c.broker.role}.`); LEAD('Description', c.broker.description); LEAD('Trait', c.broker.trait); LEAD('Secret', c.broker.secret); }
}
if (L.westOwnership) {
  H2("West's Ownership — the \"am I free now?\" question");
  const w = L.westOwnership;
  LEAD('The short answer', w.theShortAnswer);
  if (w.theThreeClaims) { H3('The three claims'); UL(w.theThreeClaims); }
  LEAD('The practical reality', w.thePracticalReality);
  LEAD("West's greenness", w.westsGreenness);
  LEAD('How the truth arrives', w.howTheTruthArrives);
  LEAD('The real resolution', w.theRealResolution);
  LEAD('GM note', w.gmNote);
}

// ── FACTION TURN HISTORY ──
H1('Faction Turn History');
(L.factionTurns || []).forEach(t => {
  H2(`Turn ${t.turn} — ${t.label}`);
  if (t.worldState) P(t.worldState);
  (t.actions || []).forEach(a => {
    const facName = (L.factions.find(f => f.id === a.faction) || {}).name || a.faction;
    H3(`${facName} — ${a.action}`);
    P(a.detail);
    if (a.roll) P(`Roll: attacker ${a.roll.attacker} versus defender ${a.roll.defender}. Result: ${a.roll.result}.`);
    if (a.statChange) LEAD('Change', a.statChange);
    if (a.narrative) P(a.narrative);
  });
});

// ── FACTION STATE ──
if (L.factionStatePostS0) {
  H1('Faction State Snapshot');
  L.factionStatePostS0.forEach(s => {
    const facName = (L.factions.find(f => f.id === s.id) || {}).name || s.id;
    P(`${facName}: HP ${s.hp}, Cunning ${s.cunning}, Force ${s.force}, Wealth ${s.wealth}. Assets: ${(s.assets||[]).join(', ')}. ${s.note || ''}`);
  });
}

// ── SESSION 1 ──
if (L.session1) {
  const s1 = L.session1;
  H1('Session 1 — ' + (s1.title || 'The Still Gardens'));
  LEAD('World', s1.world + (s1.worldTags ? ' — ' + s1.worldTags.join(', ') : ''));
  LEAD('World description', s1.worldDescription);
  LEAD('Premise', s1.premise);
  if (s1.characterStakes) { H2('Character stakes'); LEAD('Player 1', s1.characterStakes.player1); LEAD('Player 2', s1.characterStakes.player2); }
  if (s1.stillGardens) { H2('The Still Gardens'); Object.entries(s1.stillGardens).forEach(([k,v]) => LEAD(labelize(k), v)); }
  if (s1.beats) { H2('Session beats'); s1.beats.forEach(b => { H3(`Beat ${b.beat}: ${b.title}` + (b.type ? ` (${b.type})` : '')); LEAD('GM notes', b.gmNotes); Object.entries(b).forEach(([k,v]) => { if (!['beat','title','type','gmNotes'].includes(k) && typeof v === 'string') LEAD(labelize(k), v); }); }); }
  if (s1.hiddenTruths) { H2('Hidden truths (GM only)'); UL(s1.hiddenTruths); }
  if (s1.readAloud) { H2('Read-aloud texts'); Object.entries(s1.readAloud).forEach(([k,v]) => { H3(labelize(k)); P(v); }); }
}

// Session 1 recap (player-facing)
{ const p = path.join(ROOT,'handouts/session-1-recap.md'); if (fs.existsSync(p)) { H1('Session 1 — Player Recap'); mdToProse(fs.readFileSync(p,'utf8')); } }

// ── SESSION 2 ──
if (L.session2) {
  const s2 = L.session2;
  H1('Session 2 — ' + (s2.title || '').replace(/^Session 2 — /,''));
  LEAD('Setting', s2.world);
  LEAD('Time skip', s2.timeSkip);
  if (s2.quickRef) { H2('At a glance'); LEAD('Spine', s2.quickRef.spine); UL(s2.quickRef.runOrder); LEAD('The one clock', s2.quickRef.theOneClock); LEAD('The one scene', s2.quickRef.theOneScene); LEAD('Tone', s2.quickRef.toneTouchstone); }
  if (s2.turnSummary) { H2('What each faction did since last session'); s2.turnSummary.forEach(t => { const facName = (L.factions.find(f => f.id === t.faction)||{}).name || t.faction; P(`${facName}: ${t.did} Why it matters: ${t.why}`); }); }
  const scene = (sc) => { if (!sc) return; H2(sc.title); UL(sc.talkingPoints); (sc.checks||[]).forEach(ch => P(`Skill check — ${ch.skill}, difficulty ${ch.dc}, when ${ch.when}. On success: ${ch.success} On failure: ${ch.fail}`)); };
  scene(s2.coldOpen); scene(s2.transit); scene(s2.reveal); scene(s2.arrival);
  if (s2.missions) { H2('The three missions'); s2.missions.forEach(m => {
    H3(m.title);
    LEAD('Why they say yes', m.whyUs);
    LEAD('Main-arc payoff', m.mainArcPayoff);
    LEAD('Hook', m.hook);
    UL(m.talkingPoints);
    (m.checks||[]).forEach(ch => P(`Skill check — ${ch.skill}, difficulty ${ch.dc}, when ${ch.when}. Success: ${ch.success} Failure: ${ch.fail}`));
    if (m.combat) { P(`Combat setup: ${m.combat.setup}`); (m.combat.enemies||[]).forEach(e => P(`Enemy: ${e.name}. HP ${e.hp}, armor class ${e.ac}, attack ${e.atk}, damage ${e.dmg}, morale ${e.morale}.`)); P(`Terrain: ${m.combat.terrain}`); if (m.combat.twist) P(`Twist: ${m.combat.twist}`); }
    LEAD('Reward', m.reward); LEAD('Leads to', m.leadsTo);
  }); }
  if (s2.clocks) { H2('Clocks'); s2.clocks.forEach(c => P(`${c.name}. ${c.ticks} Trigger: ${c.trigger}`)); }
  if (s2.sessionCloseOptions) { H2('Session close options'); UL(s2.sessionCloseOptions); }
  if (s2.offScript) { H2('If they go off-script'); UL(s2.offScript); }
  if (s2.glossary) { H2('Places and names'); s2.glossary.forEach(g => P(`${g.term}: ${g.what}`)); }
  if (s2.playerCheatSheet) { H2('When to call for a roll'); s2.playerCheatSheet.forEach(pc => { const c=(L.castIndex||{})[pc.pc]||{}; P(`${c.name||pc.pc}. Likely good: ${pc.likelyGood} Lean into: ${pc.leanInto} Weak at: ${pc.avoid}`); }); }
}

// ── THE TABLEAU + BACKGROUND ──
H1('The Tableau and the Wider Sector');
if (L.tableau) { H2('The Tableau — sector news service'); LEAD('What it is', L.tableau.whatItIs); LEAD('Cadence', L.tableau.cadence); if (L.tableau.curationRules) { H3('Curation rules'); UL(L.tableau.curationRules); } }
{ const p = path.join(ROOT,'handouts/tableau-issue-01.md'); if (fs.existsSync(p)) { H2('Tableau — Issue 1'); mdToProse(fs.readFileSync(p,'utf8')); } }
if (L.backgroundThreads) { H2('Background threads — the sector beyond Thessavar'); L.backgroundThreads.forEach(t => P(`${t.name} (${t.status}): ${t.thread} Hook: ${t.hook}`)); }

// ── CAST INDEX ──
if (L.castIndex) { H1('Cast — Quick Reference'); Object.values(L.castIndex).forEach(c => P(`${c.name}: ${c.blurb}`)); }

// ── helpers ──
function labelize(k){ return k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()).replace(/_/g,' '); }
function mdToProse(md){
  md.split(/\n/).forEach(line => {
    let t = line.trim();
    if (!t) return;
    if (/^\|/.test(t)) { if (/^\|[\s\-:|]+\|?$/.test(t)) return; P(t.replace(/\|/g,' ').replace(/\s+/g,' ').trim()); return; }
    if (t === '---') return;
    const h = t.match(/^(#{1,3})\s+(.*)/);
    if (h) { const lvl = h[1].length; const txt = clean(h[2]); (lvl===1?H2:H3)(txt); return; }
    if (/^[-*]\s+/.test(t)) { out.push(`<li>${esc(clean(t.replace(/^[-*]\s+/,'')))}</li>`); return; }
    if (/^>\s?/.test(t)) { P(clean(t.replace(/^>\s?/,''))); return; }
    P(clean(t));
  });
}
function clean(s){ return s.replace(/\*\*/g,'').replace(/\*/g,'').replace(/`/g,'').replace(/^\d+\.\s*/,''); }

// ── WRAP + WRITE HTML ──
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { margin: 22mm 20mm; }
body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.5; color: #1a1a1a; }
h1 { font-size: 22pt; color: #a23; border-bottom: 2px solid #a23; padding-bottom: 4px; margin-top: 30px; page-break-before: always; }
h2 { font-size: 16pt; color: #b4502c; margin-top: 22px; }
h3 { font-size: 13pt; color: #333; margin-top: 16px; }
p { margin: 6px 0; }
ul { margin: 6px 0 6px 0; }
li { margin: 3px 0; }
.lab { font-weight: bold; color: #7a3; }
.cover { text-align:center; padding-top: 120px; }
.cover .title { font-size: 40pt; border: none; page-break-before: avoid; }
.sub { font-size: 14pt; color: #555; }
.sub.small { font-size: 11pt; }
h1:first-of-type, .cover h1 { page-break-before: avoid; }
</style></head><body>${out.join('\n')}</body></html>`;

const HTML_PATH = path.join(__dirname, 'lore.html');
fs.writeFileSync(HTML_PATH, html);
console.log('HTML written:', HTML_PATH, '(' + Math.round(html.length/1024) + ' KB)');
