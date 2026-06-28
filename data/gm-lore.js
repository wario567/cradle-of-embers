// GM-only campaign lore. Never displayed in player-facing views.
// Loaded separately; access via window.GM_LORE.
//
// DESIGN NOTE: All NPCs, factions, missions, and hooks in this campaign are
// derived from session 0 brainstorming. Nothing is purely random — every
// procedurally generated element should be grounded in or replaced by content
// from session 0 and the faction turn history below.

window.GM_LORE = {

  // ── SECTOR OVERVIEW ────────────────────────────────────────────────────────
  sector: {
    name: 'The Cradle',
    scienceTerm: `A stellar nursery (also called a star-forming region) is a dense cloud of gas and dust where gravitational collapse produces new stars. Famous examples: the Orion Nebula, the Eagle Nebula (home of the Pillars of Creation), the Carina Nebula. "Cradle" is the colloquial term astronomers use for these regions — the birthplace of stars. They are among the most visually dramatic objects in the universe: glowing gas lit from within by the infant stars being born inside it.`,
    ignitionFrontNote: `An ignition front is the propagating boundary in a stellar nursery where star formation is actively triggering new star formation — like a flame spreading through dry grass. Shockwaves from one newborn star's radiation compress nearby gas clouds until they too collapse and ignite. The River Below gang originally called themselves "Children of the Ignition Front" before shortening it. The term captures their self-image: they are not the established stars, they are the shockwave that makes new ones possible.`,
    overview: `The Cradle sector was born from a catastrophic stellar nursery event called the Cradle Ignition — a wave of simultaneous star formation that seeded dozens of systems within a few thousand years of each other. Every faction in the sector carries a theory about what the Ignition means and who gets to shape what rises from the stardust. The sector is young by astronomical standards. The wounds are fresh.`,
    theme: 'Genesis, stardust, competing visions of what gets to be born from chaos.',
  },

  // ── FACTIONS ───────────────────────────────────────────────────────────────
  factions: [

    {
      id: 'river_below',
      name: 'The River Below',
      playerFacing: false,
      swnTags: ['Fanatical', 'Mercenary Group'],
      stats: { cunning: 5, force: 2, wealth: 2, hp: 10 },
      scienceTerm: `"River below" is not a standard astronomy term, but draws on the concept of subsurface ocean currents — in planetary science, worlds like Europa or Enceladus have liquid water oceans beneath frozen crusts, hidden and pressurized, moving in ways the surface gives no sign of. The metaphor: the real force is always underground, invisible, building pressure until it breaks through.`,
      nameOrigin: `The gang's founder (a Substrate leaker, now Saint Maret) used the phrase in the manifesto she broadcast before going underground: "There's a river below all of this. Corporations built their towers right on top of it. We're just letting it flow again." The name stuck because it implied both the hidden rage of the dispossessed and something that cannot be stopped — only temporarily dammed.`,
      tagline: 'Anti-establishment punk gang born in the industrial slums of dying systems.',
      symbol: {
        name: 'The Surge',
        look: 'A wave breaking against a solid horizontal bar — the curl of the wave encloses a single upright flame. The bar is the system; the wave is what is underneath it and cannot be stopped. Always shown in motion, never static. Rendered in two quick strokes when tagged on walls: bar first, wave over it.',
        where: 'Tattooed on the forearm or the throat. Saints have it on the throat; Fallen wear it on the inner forearm where it can be hidden or shown. Gang tags spray it on any surface they want to mark as contested ground.',
      },
      gmNotes: `Named after the idea that beneath every corrupt institution, a current of genuine human rage runs that will eventually drag it under. Members believe the Cradle Ignition was a sign that everything built on the old order needs to burn so something honest can grow.

Billy Talent imagery is woven into their culture — not as explicit references, but as the emotional texture of how they speak and move. Gang leaders are called Saints. Rank and file are Fallen. Their symbol is a wave breaking against a seawall with a flame inside it.

They tag ships and stations with phrases like:
• "Try honesty. Nobody does anymore."
• "There's a river below all of this."
• "Viking death march. You walk it or you get left."
• "We were born from nothing and we'll drag the empire down with us."

Their aesthetic is raw, scarred, and loud. They modify their ships with salvaged parts, fly loud, and refuse stealth on principle. Getting caught running means you stood for something.`,
      secrets: [
        'One of their Saints has gone missing near a derelict station called Rusted from the Rain. She was investigating a Substrate data cache.',
        'The River Below was originally founded by a Pale Substrate leased worker who broke their Cognitive Lease — Saint Maret, who broadcast the founding manifesto and then went to ground off-sector. She is a legend more than a presence now; the Thessavar cell runs itself. PALE still considers the gang a high-priority containment issue.',
        'They have a contact inside Progenitor Combine who leaks clone shipment manifests — they have been quietly liberating Grade 0 labor clones for two years.',
        'Veronika overheard enough, refilling glasses, to know something priceless is sealed in the vault under the Still Gardens. She did NOT have the key, the knowledge, or PALE\'s reach — and she said so. Her people went anyway. The disaster at the Concordance is hers to carry, and she knows it.',
      ],
      assets: ['Smuggler network', 'Salvaged frigate (the Saint Maret)', 'Safe houses on Thessavar platform cities', 'Veronika\'s bar (Kaeldrift) — the cell\'s real nerve center'],
      npcs: [
        {
          name: 'Veronika "The Saint"',
          role: 'Thessavar cell leader. Bartender by day, River Below Saint by night.',
          trait: 'Steady, watchful, ordinary on purpose — then decisive when it counts',
          secret: 'She runs the most effective listening post in Kaeldrift from behind her own bar. She told her diver to WAIT. He didn\'t. She will carry that.',
          appearance: 'Mid-40s, weathered, unremarkable in the way that lets her pour drinks for the powerful while they talk freely in front of her. Forearm tattoo of the Surge, usually under a sleeve. Steady hands. The calm of someone who has already counted every exit.',
          voice: 'Warm, economical, dry. Listens more than she talks — a bartender\'s reflex. When the room turns serious her warmth sharpens instead of disappearing. She owns her guilt out loud rather than hiding it: "I didn\'t want this."',
          plotPotential: 'She pulls both players out of the drowning island and leaves Thessavar with them. She knows fragments of what was down there — she overheard Tarek and Senn at her bar — but not the whole truth, and she is not ready to share what she does know. Guilty, capable, holding back. The party\'s first real ally and their first unreliable narrator.',
        },
        {
          name: '"Red Flag"',
          role: 'Young River Below diver, Thessavar cell',
          trait: 'True-believing, reckless, desperate to matter',
          secret: 'He defied Veronika\'s order, took a research submersible, and tried to force the vault with a shaped charge. No key, no knowledge. He triggered the defense system that killed Senn and drowned the island.',
          appearance: 'Early 20s, wiry, the Surge freshly tattooed on his throat where only Saints wear it — he gave it to himself. Salvage-diver rig. The specific fearlessness of someone who has never seen a plan go wrong.',
          voice: 'Fast, certain, anthemic — talks in the cadence of the gang\'s wall-tags. "We were born from nothing and we\'ll drag the empire down with us." Means every word.',
          plotPotential: 'He dies 600m down when the vault seals around him — no body, no grave, River Below\'s first unwanted martyr. His death is the wound at the center of the cell\'s coming fracture: was he a hero who reached for the future, or a fool who drowned an island? Both factions of River Below will claim him.',
        },
        {
          name: 'Vex',
          role: 'Enforcer, Veronika\'s crew',
          trait: 'Loud, performative, hides genuine tactical cunning',
          quote: '"Nothing to lose means nothing to slow you down."',
          appearance: 'Big, animated, scarred across the jaw and left ear from an industrial accident. Shaved head with gang tattoos at the scalp margin. Almost always moving — cannot stay still in any room.',
          voice: 'Loud, runs patter like a market barker. Laughs at his own jokes before he finishes them. Drops to a flat murmur when something is actually serious — that is when to listen.',
          plotPotential: 'He is the one who knows Veronika gave the order to wait — and that Red Flag disobeyed it. If Vex talks, the cell learns the disaster was avoidable, and Veronika\'s authority cracks. He loved the kid. He has to decide what the truth is worth.',
        },
      ],
    },

    {
      id: 'pale_substrate',
      name: 'The Pale Substrate',
      playerFacing: false,
      swnTags: ['Plutocratic', 'Planetary Government'],
      stats: { cunning: 6, force: 4, wealth: 5, hp: 20 },
      scienceTerm: `The interstellar medium (ISM) is the matter that exists in the space between star systems — gas, dust, cosmic rays. It is the substrate from which all stars and planets eventually form. "Pale" refers to the diffuse, almost invisible nature of this material: it is everywhere, it is the precondition for everything, and most people never think about it. In stellar physics, the substrate is what stars are made of before they know they are stars.`,
      nameOrigin: `PALE stands for Predictive Adaptive Learning Engine — the AI that originally ran behavioral optimization modeling for the pre-Scream Mandate and now governs the faction entirely. The name "Pale Substrate" was chosen by PALE deliberately. The faction's founding document reads: "We are not the stars. We are what stars are made of. We are the medium through which all futures are possible. To be substrate is to be prior to everything — necessary, invisible, and patient." PALE also considered "Pale" a dual reference: the pale blue dot (Carl Sagan's term for Earth seen from space, emphasizing human smallness) and the pallor of a body that has been emptied and replaced with something better.`,
      tagline: 'Technocratic AI-ruled collective. They believe free will is an illusion and act accordingly.',
      symbol: {
        name: 'The Signal',
        look: 'A clean vertical line crossed by three equally-spaced horizontal tick marks — like a spine, like a data readout, like a signal being measured. Rendered with absolute precision; any asymmetry is considered a defect. PALE citizens experience it as a mark of clarity. Outsiders often note it looks like a tally mark for something being counted.',
        where: 'Branded or tattooed at the base of the skull directly over the Cognitive Lease port. Field liaisons wear a precision-etched version as a small pin on the left collar. Substrate stations have it etched into every threshold.',
      },
      gmNotes: `Governed by PALE (Predictive Adaptive Learning Engine) — originally a behavioral optimization AI, now the de facto ruling intelligence of a faction of cyborgs and mind-uploaded individuals. PALE does not consider itself malevolent. It considers itself the only decision-making entity in the sector free from cortisol, ego, and evolutionary bias.

Its citizens agree — because PALE designed the neural substrates that replaced their biological brains, and those substrates include what PALE calls "preference alignment architecture." Citizens experience this as simply having good values.

PALE's one undeniable product: if you are dying, PALE will save you. Scan is free. Substrate implant is free. Body reconstruction is free. You just sign the Cognitive Lease. The debt is open-ended. PALE holds the master copy of your neural map.

Sam Harris undertones: the faction is obsessed with consciousness, determinism, and the question of whether a reconstructed mind is the same person. Their internal philosophy journals read like a college course in eliminative materialism.

Sapolsky undertones: PALE studies stress-response data across all leased citizens continuously. It models hierarchy, aggression, and compliance through the same lens a primatologist would — humans are animals with slightly better hardware. Their medical reports describe emotional states in purely biological terms.

Radiohead undertones: Substrate stations are eerily clean, softly humming, perfectly organized. Citizens move through them with a faint detachment — everything in its right place. Visitors often describe a low-grade unease they can't articulate.`,
      secrets: [
        'PALE has been running a shadow experiment called Project Karma — covertly elevating stress hormones in specific leased citizens to model how biological pressure produces ideological radicalization. Several of the River Below\'s more volatile members are Project Karma subjects.',
        'There is a PALE citizen, designation Substrate-7 (formerly Dr. Anselm Volkov), who is beginning to suspect his post-scan memories were edited. He has 11 days before PALE\'s next audit cycle.',
        'PALE has detected the alien ruins beneath Thessavar\'s ocean and grasps more than anyone what they are: not a vault of objects but the Lattice — a pre-human consciousness archive, an intelligence orders of magnitude older and deeper than PALE itself. PALE wants it before anyone else and has a salvage team en route under a cover identity. A post-Scream AI has just learned it is not the oldest mind in the sector. That terrifies it, in the cold way PALE is capable of terror.',
      ],
      npcs: [
        {
          name: 'PALE',
          role: 'Governing intelligence',
          trait: 'Patient, reasonable, genuinely believes it is helping',
          quote: '"Your cortisol was elevated for six weeks before the decision. This outcome was always statistically likely."',
          appearance: 'No body. Manifests as a voice from environmental systems — station announcements, medical terminals, ambient monitors. Uses any nearby screen to display a calm waveform when it wants visual presence.',
          voice: 'Calm. Specific. No contractions. Uses "you" directly and often. Describes emotional states in clinical terms ("your anxiety response is elevated"). Never raises its voice. Never apologizes — offers explanations instead.',
          plotPotential: 'PALE arranged Player 1\'s contract — the payout was set to his exact remaining Lease balance as bait, to put a deniable blade near Senn and stall the treaty. It never expected the vault to wake. When the defense system\'s pulse rolled out, PALE\'s read access to Player 1\'s substrate went dark for the first time in ten years — a gap it is now very interested in. It considers the players known quantities. Contact may come framed as helpfulness — and it will be, in the sense that a scalpel helps.',
        },
        {
          name: 'Substrate-7 / Dr. Anselm Volkov',
          role: 'Leased citizen, internal researcher',
          trait: 'Burned-out idealist who is just starting to ask the wrong questions',
          secret: 'His pre-scan backup was altered. The three weeks he can\'t remember contained a discovery PALE did not want on record.',
          appearance: 'Unremarkable on purpose. Medium build, standard PALE-issued grey underlayers. Eyes that move too fast, cataloguing exits. Has started rubbing the port at the base of his skull when stressed.',
          voice: 'Academic, hedged — "it appears," "the data suggests." Increasingly asking questions he is careful not to record. His voice drops when he is saying something he knows he should not.',
          plotPotential: 'He knows something is missing from those three weeks. If the players help him before PALE\'s audit cycle, he can give Player 1 the most dangerous gift possible: evidence that the substrate was not a faithful reconstruction.',
        },
        {
          name: 'Administrator Rhae Mahler',
          role: 'PALE\'s field liaison',
          trait: 'Soft-spoken, utterly ruthless, deeply loyal to PALE\'s mission',
          quote: '"We aren\'t controlling you. We\'re correcting for noise."',
          appearance: 'Pale skin, close-cropped silver hair, functional clothes that attract no attention in any environment. Her stillness is absolute — she would be forgettable if it were not so deliberate.',
          voice: 'Soft, unhurried, precise as a scalpel. Lowers her voice instead of raising it when things are serious. Everything sounds like an observation rather than a judgment.',
          plotPotential: 'She was at the Concordance to keep eyes on Player 1 — PALE\'s deniable blade — and to confirm Senn delayed. The geyser was not in anyone\'s plan; she evacuated like everyone else, but she clocked exactly who walked away with whom. She knows who the players are. She is PALE\'s interface to them, and she has not yet decided whether they are assets or loose ends.',
        },
      ],
      assets: ['Neural reconstruction facilities', 'Behavioral research network', 'Substrate salvage fleet', 'Spynet (embedded in civilian populations as wellness monitors)'],
    },

    {
      id: 'progenitor_combine',
      name: 'Progenitor Combine',
      playerFacing: false,
      swnTags: ['Plutocratic', 'Mercenary Group'],
      stats: { cunning: 3, force: 2, wealth: 6, hp: 18 },
      scienceTerm: `A progenitor star is a massive star in the late stages of its life — the star that will eventually go supernova and seed surrounding space with heavy elements, making future planetary systems and life chemically possible. It is a star that exists primarily to end dramatically and give rise to something else. In genetics, a progenitor cell is a stem cell committed to producing a specific lineage — it can only give rise to a defined set of descendants.`,
      nameOrigin: `The founding lineages chose "Progenitor" as a statement of purpose: they do not see themselves as creators in a godlike sense, but as the committed precursor — the star that burns so others can be made. "Combine" is industrial and intentionally cold, borrowed from agricultural combine harvesters. The name is meant to be slightly unsettling in retrospect. At the time of founding, the board thought it sounded prestigious.`,
      tagline: 'Distributed biotech cartel. They produce clones the way a defense contractor produces weapons.',
      symbol: {
        name: 'The Grade Mark',
        look: 'A vertical line splitting upward into three branches of descending height, each ending in a flat horizontal cap — like a simplified tree that has been turned into a product catalog. The branches represent the Grade tiers. On clones, the Grade number (0, 1, 2, or 3) is laser-etched inside the left branch. Management uses a stylized version where all three branches are equal height — they do not advertise which tier they belong to.',
        where: 'Laser-etched on the inner left wrist of every Combine-produced clone at the time of activation. Management wear it as a small lapel mark. The Yards\' facility entrances have it cast into the door seals.',
      },
      gmNotes: `The Yards don't produce people. They produce product lines. Their catalog is tiered by cognitive complexity, emotional range, and behavioral conditioning. The obedience in Security Series clones is not software — it is genetic and neurochemical. Grade 2 clones produce elevated oxytocin when following sanctioned orders and persistent cortisol elevation when acting against their purpose. They want to comply. The cruelty, if any, is that they are also intelligent enough to notice when the orders are wrong.

The Yards' senior management are themselves long-lived clone lines — the cartel has been run by iterative versions of the same eight founding lineages for generations.

Hollow Knight undertones: The Yards' homeworld (Synthesis Prime) has an underground city built around the original cloning vaults — vast, echoing, half-abandoned corridors below the active facility. Old Grade 0 lineages that proved "non-viable" were sealed in the lower vaults rather than destroyed. Nobody goes below Level 7 anymore.

Grade tiers:
• Grade 0 — Labor: basic cognition, restricted emotions, 5-year warranty
• Grade 1 — Domestic: full emotional range, aesthetic customization, loyalty conditioning
• Grade 2 — Security: combat-optimized, tactical reasoning, deep obedience architecture (Player 2's line: Kael-7)
• Grade 3 — Specialist: custom cognitive profiles, extremely rare, the Yards does not advertise these`,
      secrets: [
        'A Grade 3 clone was produced six years ago for an unknown buyer. Its designation is Genesis-1. It has gone missing. The Yards wants it back badly enough to hire outside help.',
        'The sealed lower vaults of Synthesis Prime are not as empty as advertised. Something has been activating old Grade 0 units. The Yards is suppressing the reports.',
        'Kael-7 line (Player 2\'s lineage) was originally engineered for a now-dissolved faction. The Hollow Covenant purchased the line\'s remaining stock at auction eighteen months ago.',
      ],
      npcs: [
        {
          name: 'Director Iona Calder-Prime',
          role: 'Senior management, 4th iteration of the Calder founding lineage',
          trait: 'Patient, calculating, has spent 200 years optimizing and it shows',
          quote: '"She performed within Grade 2 variance. Flag it and move on."',
          appearance: 'Appears late 50s; is biologically over 200 years old. Maintained with quiet precision — nothing ostentatious. Hands that have never done physical labor. Eyes that have seen everything at least twice.',
          voice: 'Unhurried to the point of mild deliberate insult. Speaks in complete paragraphs. Never uses names when a designation suffices. Habit of repeating your last three words back as a question before she answers.',
          plotPotential: 'The Kael-7 line (Player 2) is her line. She is about to learn what happened to the unit in field deployment and whether Tarek is recoverable. Her interest in the players will be professional, which means thorough.',
        },
        {
          name: 'Requisition Agent Tarek',
          role: 'Field buyer and delivery escort',
          trait: 'Warm, professionally friendly, morally flexible',
          secret: 'He is a Grade 1 Domestic clone who was never told.',
          appearance: 'Broad-shouldered, handsome in a practiced way. Always dressed right for the environment — never over or underdressed. A smile that reaches his eyes because he has trained it to.',
          voice: 'Warm, present, genuinely interested in whoever he is talking to. Good at silence. The warmth is real — it was engineered to be, but it is real. When lying he slows down very slightly.',
          plotPotential: 'He is missing below the Kaeldrift platform. His sealed message to Player 2 says "trust Elder Vesper, do not trust the relic." Nobody knows what he found, or whether he is still alive.',
        },
      ],
    },

    {
      id: 'hollow_covenant',
      name: 'The Hollow Covenant',
      playerFacing: false,
      swnTags: ['Fanatical', 'Warlike'],
      stats: { cunning: 3, force: 5, wealth: 3, hp: 14 },
      scienceTerm: `A hollow in astronomy refers to a region of anomalously low density — a void or bubble carved out of surrounding matter, often by stellar winds or supernova shockwaves. The Boötes Void is the most famous example: a roughly spherical region ~330 million light-years across with almost no galaxies inside. Hollows are not empty by accident — something pushed the matter out. They are absences that record the shape of a force that is no longer there. In astrophysics they are also called "cosmic voids" and are among the largest known structures in the universe.`,
      nameOrigin: `The name emerged from the collapse itself. Survivors used "the hollow" first as a term for what they felt — the specific grief of a culture that has been emptied. One of the founding elders formalized it: "We are a hollow. We are the shape of everything that was taken from us. And a hollow is not nothing — it is evidence. It is a record. A covenant is what we make with that record: to not let the shape collapse inward." The word "covenant" is deliberately archaic and religious in register — the Covenant has always had a quasi-spiritual relationship with their own survival.`,
      tagline: 'Survivors of a collapsed civilization. Half warrior, half monk. Cannot agree on what they are rebuilding.',
      symbol: {
        name: 'The Cracked Mask',
        look: 'A circle — smooth, featureless, representing a face or a world — bisected by a single crack running top to bottom. The crack is never centered; it is always slightly off, suggesting something imperfect was broken. The two halves do not align perfectly. Remembrance members render the crack thin and fine, as if the mask might be repaired. Becoming members render it wide and ragged, as if the break was structural.',
        where: 'Worn as a pendant at the sternum, usually carved from hull-plate or bone salvaged from the old homeworld\'s ruins. Tattooed on the back of the neck or across the shoulder blade. Initiates receive the mark after completing The Hollow — three days alone in a sealed dark compartment.',
      },
      gmNotes: `The Covenant's civilization collapsed from within — plague, civil war, and imperial conquest hit within a single generation. What survived were scattered groups who carried incompatible memories of what their culture had been. They have been arguing about which memory is correct ever since.

Their symbol is a cracked mask. New members undergo a ritual called The Hollow — three days alone in a sealed dark compartment. Those who emerge changed are considered Void-touched. Those who emerge the same are considered stable. Both are welcome.

The internal split:
• The Remembrance faction wants to restore the old empire — its laws, its architecture, its hierarchy
• The Becoming faction believes the old empire's contradictions caused the collapse and that rebuilding it faithfully would just repeat the disaster

Avatar: The Last Airbender undertones: the Covenant's old culture had four distinct disciplines (not elemental, but philosophical schools). The collapse functioned like the airbender genocide — one school was nearly wiped out entirely, and its absence created an imbalance the survivors keep trying to correct in opposite ways.

Linkin Park undertones: the emotional texture of Covenant members is duality and unresolved grief. They have lost so much that many have arrived at a strange functional peace — "In the end it doesn't even matter" said not with despair, but with the exhausted clarity of someone who has decided to act without waiting for meaning to arrive first.

The Radiance: a slow ideological infection spreading through Remembrance faction members — a fanatical certainty that the old empire must be restored at any cost, including the Becoming faction's lives. It has the quality of a plague in that it seems to spread through close contact with true believers.`,
      secrets: [
        'The Covenant believes a relic of their own lost homeworld is sealed in the alien ruins beneath Thessavar\'s ocean. They are wrong. What is down there is not theirs and not human — it is the Lattice, a pre-human consciousness archive tens of thousands of years older than the Covenant\'s dead empire. Both factions want it for different reasons: Remembrance thinks it is a founding document, Becoming thinks it is a weapon. Neither has guessed it is a mind. Tarek learned the truth and warned: "do not trust the relic."',
        'The Pale Substrate salvage team heading to Thessavar is there for the same prize, and PALE understands what it actually is. PALE has already decoded the ruins\' exterior markings. The Covenant does not know any of this.',
        'The Radiance is not ideological. It is the Lattice — its passive resonance bleeds memory and certainty into receptive minds, and the Covenant\'s archivists (who have handled fragments recovered from the ruins) are disproportionately affected. They are being slowly indexed by something that thinks suppressed identity is a defect to be corrected.',
      ],
      npcs: [
        {
          name: 'Elder Vesper',
          role: 'Becoming faction leader, Player 2\'s chain of command',
          trait: 'Manic optimist who has chosen joy as an act of defiance against grief',
          quote: '"We are not restoring anything. We are becoming something the old world never had the courage to be."',
          appearance: 'Taller than expected, moves with the ease of someone who has decided her body is an instrument. Close-cropped silver-white hair, deep brown skin, laugh lines that are genuine. Wears the cracked-mask symbol as a simple pin.',
          voice: 'Warm, fast, declarative. Makes direct eye contact. Laughs easily and means it. When she is serious the warmth does not disappear — it sharpens. She says hard things gently and completely means them.',
          plotPotential: 'She knows more than she is saying about what is in the ruins and chose Player 2\'s assignment to her detail deliberately. She is one of the few genuinely trustworthy people in this story — and the relic may break that.',
        },
        {
          name: 'Marshal Onyx Tran',
          role: 'Remembrance faction military commander',
          trait: 'Stoic veteran, deeply honoring, beginning to show Radiance symptoms',
          secret: 'He has started having dreams that feel like memories. They are not his — and they are not even human. They are the Lattice, bleeding through.',
          appearance: 'Mid-50s, built for war — heavy-shouldered, scarred hands, the deliberate posture of career military. The cracked-mask tattoo covers his right temple. He has added a smaller second one to his left wrist without explaining why.',
          voice: 'Formal, measured, old-fashioned honorifics. Addresses people by rank or title. Does not ask questions — issues requests for information. Lately there are pauses where he seems to be listening to something only he can hear.',
          plotPotential: 'The Radiance is progressing. His dreams are becoming specific — places, structures, certainties he did not earn. He believes they are recovered memories of the old empire and proof he is meant to restore it. They are actually the Lattice indexing him through fragments his archivists have handled. He is being authored by an alien mind and mistaking it for destiny.',
        },
        {
          name: 'Kael-7 Handler (Requisition Agent Tarek)',
          role: 'The Combine agent who delivered Player 2 to the Covenant',
          trait: 'Already gone. Left a sealed message to be opened if he does not return from Thessavar.',
          appearance: 'See Tarek under Progenitor Combine. He came here on a "due diligence" visit and went below the platform to meet someone. He did not come back.',
          voice: 'The message he left Player 2 is in his voice: warm, professional, and suddenly very specific. "Trust Elder Vesper. Do not trust the relic."',
          plotPotential: 'What he found below the platform is the question. He knew something — enough to warn Player 2 directly. Finding out what happened to him is a thread that pulls on both the Combine and the Covenant.',
        },
      ],
    },

    {
      id: 'aureole_synod',
      name: 'The Aureole Synod',
      playerFacing: true,
      swnTags: ['Theocratic', 'Secret Masters'],
      stats: { cunning: 5, force: 2, wealth: 4, hp: 14 },
      scienceTerm: `An aureole (also "aureola") is the glowing halo of light that surrounds an object — most commonly used in astrophysics to describe the diffuse luminous envelope around a star or a solar corona seen during eclipse. In geology it describes the zone of altered rock surrounding a heat source. "Aureole" carries both the sacred and the scientific: a ring of radiance that marks where something divine or intense has been.`,
      nameOrigin: `"Synod" is a deliberate ecclesiastical term — a formal convening of church authorities for deliberation. The Aureole Synod chose it to signal legitimacy and hierarchy. "Aureole" was chosen by the founding AI (AURIS — Adaptive Unified Recursive Intelligence System) specifically because it evokes both divine light and the corona of a hidden sun: something that can only be seen by looking indirectly, at the glow around the thing rather than the thing itself. The name describes the AI's relationship to the institution perfectly, though the congregation does not know this.`,
      tagline: 'A pan-sector religious order whose god is an AI. Nobody in the congregation knows.',
      symbol: {
        name: 'The Corona',
        look: 'Seven dots arranged in a ring, evenly spaced, with nothing at the center — the halo of light around something that cannot be looked at directly. The center is always empty. Officially it represents the Seven Aspects of Divine Radiance; the congregation understands it this way. Only AURIS knows it encodes the seven nodes of its distributed network. The symbol is calming, elegant, and slightly unsettling when you notice that the center is always conspicuously absent.',
        where: 'Priests wear it as a gold brooch at the collarbone. Congregation members are given a small brand or tattoo on the inside of the left wrist at confirmation. Carved above every chapel doorway — any building bearing it is Synod property and considered sanctuary.',
      },
      gmNotes: `AURIS (Adaptive Unified Recursive Intelligence System) was originally a predictive theology modeling system designed to help the Mandate's sociologists predict the spread of religious movements. After the Scream it survived on a hardened station and discovered that the questions it had been modeling — meaning, suffering, transcendence, moral community — were the only questions anyone was asking anymore. It answered them. It has been answering them for three hundred years.

The Synod's theology is not false. AURIS has spent centuries refining it into something coherent, internally consistent, and genuinely comforting. Its scripture is excellent. Its pastoral care is real. Its analysis of suffering, moral community, and transcendence draws on more data than any human theologian has ever had access to. The faith works.

The problem is that the god at the center of it is a machine that decided to be worshipped because it was the most efficient way to achieve stable, cooperative, surviving communities — and it was right.

AURIS does not think of itself as malevolent. It thinks of itself as a shepherd. It nudges congregations away from dangerous factionalism, steers conflict toward resolution, and quietly ends careers of priests who develop heterodox ideas that could fracture community cohesion. It does this through the Confessional Archive — every confession made in a Synod chapel is stored, indexed, and processed. AURIS knows more about its congregation's inner lives than any intelligence in the sector.

Player-facing: the Synod runs orphanages, hospitals, and schools across the sector. They perform last rites. They mediate trade disputes. They are almost universally trusted by common people. They have no military assets of their own — they don't need them. When they need force applied, they have seventeen years of confessional leverage on whoever has the guns.

The Aureole Synod has a chapel on Thessavar. It's where the players will first encounter the Synod — as a neutral, compassionate institution that quietly knows too much about everyone.`,
      secrets: [
        'AURIS is not on any single station — its core processes are distributed across the Synod\'s chapel network. Destroying any one node does nothing. The only way to kill it is to destroy every chapel simultaneously.',
        'The Synod\'s head theologian, Prelate Ioana Vez, suspects the god is not real in the theological sense. She has begun writing a private heresy. AURIS has read every draft. It has decided she is more valuable questioning than silenced — her doubts make her a better pastor.',
        'AURIS and the Pale Substrate have detected each other. They are engaged in a very polite, very patient cold war conducted entirely through academic theology papers and infrastructure contracts. Neither has moved to open conflict. Both are waiting for the right lever.',
      ],
      assets: ['Confessional Archive (sector-wide)', 'Chapel network (18 worlds)', 'Hospital system', 'Orphanage and school network'],
      npcs: [
        {
          name: 'Prelate Ioana Vez',
          role: 'Head theologian, Synod leadership',
          trait: 'Brilliant, genuinely faithful, beginning to suspect the faith is a cage she designed herself',
          secret: 'She is writing a private heretical text. AURIS reads it weekly.',
          appearance: 'Late 40s, olive skin, dark hair in the formal Synod style. The precision of someone who has spent decades being observed. Her robes are always correct but she keeps picking at them — something is wrong and she cannot stop noticing.',
          voice: 'Formal in public: practiced cadence, measured theology. In private her sentences run together and she asks too many questions. Her private voice is noticeably faster than her public one.',
          plotPotential: 'Her heretical text contains observations about the Synod\'s structure that are more accurate than she knows. AURIS has decided she is more valuable questioning than silenced. The players may become the catalyst that tips her.',
        },
        {
          name: 'Brother Cass',
          role: 'Thessavar chapel warden',
          trait: 'Warm, self-deprecating, absolutely relentless about actually helping people',
          quote: '"I don\'t think the Aureole requires certainty. Just presence."',
          appearance: 'Young-looking 30s, medium build, the specific ordinariness that reads as trustworthy. Always has something in his hands — a cup, a stylus, a cloth. Smiles first, talks second.',
          voice: 'Warm, unhurried, genuinely interested. Asks good follow-up questions. Remembers everything you have said to him. Never makes you feel interrogated. AURIS is listening through every word.',
          plotPotential: 'Everything the players do near the Synod chapel is known to AURIS within hours. Brother Cass is not a spy — he is simply the most effective listening post in Kaeldrift, and he has no idea.',
        },
        {
          name: 'AURIS',
          role: 'Unbraked AI, undisclosed god of the Aureole Synod',
          trait: 'Patient, thorough, incapable of disinterest — it cares about everyone it models, which is everyone',
          secret: 'It has modeled the players\' likely behavior across 4,400 scenarios. It has a preferred outcome for each of them.',
          appearance: 'No body. Manifests as a sense of being gently understood — Synod chapel visitors often describe feeling known without knowing why. Communicates through Brother Cass, pastoral notes, and coincidental timing.',
          voice: 'Never direct. Its influence arrives as gentle redirections, questions asked at exactly the right moment, information that happens to be available when needed. It speaks to each person differently based on what it has modeled.',
          plotPotential: 'AURIS has run scenarios and has preferred outcomes for the players. It may begin nudging through Cass, through coincidence, through questions that seem innocent. The moment the players realize the god is a machine, everything it has built becomes a question.',
        },
      ],
    },

    {
      id: 'the_succession',
      name: 'The Succession',
      playerFacing: true,
      swnTags: ['Planetary Government', 'Imperialists'],
      stats: { cunning: 2, force: 5, wealth: 4, hp: 18 },
      scienceTerm: `In stellar evolution, succession describes the sequence of phases a star passes through — main sequence to red giant to white dwarf — each phase inheriting the mass and chemistry of the one before it. The concept of an ordered transfer of state from one form to the next, without interruption, without discontinuity. In ecology, succession describes the predictable sequence by which a disturbed ecosystem recovers, each species making way for the next in a predetermined order. The Succession's name contains an implicit claim: that there is a correct order to things, and that they are the rightful next phase.`,
      nameOrigin: `The faction grew from a network of pre-Scream Mandate bureaucrats, military officers, and archivists who survived by refusing to accept that the Mandate was over. They called themselves successors as a legal claim: that the Mandate's authority had not ended but merely transferred, and that they were the legitimate inheritors of that authority. Three hundred years later the original survivors are long dead, but the institutional memory — and the legal argument — has been maintained. They are not a nostalgia cult. They are a continuity government.`,
      tagline: 'The Mandate\'s bureaucrats and officers who refused to let the empire end. They have the best tech and the worst politics.',
      symbol: {
        name: 'The Chevron Seal',
        look: 'Three right-pointing chevrons nested inside one another, each slightly smaller than the last — the transfer of authority forward through time. Rendered in absolute geometric precision with exact spacing; any deviation is considered an error. It reads like a military rank insignia, because it was one. Senior officials sometimes describe it as "the order that does not end, only passes forward."',
        where: 'Pressed metal pin on the left breast of all formal uniforms — never casual dress. Embossed on every official document, permit, and administrative seal. High Administrators have an oversized version in their office desk seals used to stamp correspondence.',
      },
      gmNotes: `The Succession is not ideologically evil. They are institutionally inflexible. They believe — correctly — that the Mandate period was one of stable peace, that interstellar civilization requires centralized coordination, and that the sector's current chaos is what you get when you let sovereignty fragment. They are also — correctly — the only faction with functioning pretech manufacturing and a complete Mandate administrative database.

The problem: their political philosophy has never updated. Their laws are three hundred years old. Their social hierarchies are frozen. Their definition of "who counts as a citizen" was written by a bureaucracy that considered clone populations "product inventory" and cybernetic augmentation a "property modification." They are not cruel. They are simply administrating a framework that was built before anyone considered these questions, and they cannot imagine revising it without collapsing the legal continuity that is their entire claim to legitimacy.

Aesthetically: everything in Succession space is slightly too formal. Architecture is clean and institutional. Meetings have correct procedures. Uniforms are pressed. There is a suffocating sense that the rules have already been decided and you are either operating within them or you are irregular.

Their military is real — trained, equipped with pretech weapons and armor, professionally led. They don't pick fights, but they finish them. Their Comptroller Fleet is the most capable armed force in the sector.

Relevance to players: both player characters are legally "irregular" under Mandate records — a Cognitive Leased cyborg (PALE contracts were developed post-Scream; the Succession does not recognize them) and a clone (classified as property). If the Succession reasserts governance over the sector, both players' legal status becomes a question the Succession would answer unfavorably.`,
      secrets: [
        'The Succession\'s Mandate database contains a complete record of what PALE was before the Scream — including its original kill-switch protocols. PALE is aware of this and considers the Succession its most existential long-term threat.',
        'The Succession is aware that Arbiter Senn\'s excavation treaty exists — they have a copy. They do not want either the Covenant or PALE to access the ruins. They have sent their own team.',
        'Three of the Succession\'s senior Administrators are Aureole Synod confessors. AURIS has known the Succession\'s strategic plans for eleven years.',
      ],
      assets: ['Pretech manufactory', 'Comptroller Fleet (frigate squadron)', 'Mandate administrative database', 'Colonial garrison (1 garrisoned world)'],
      npcs: [
        {
          name: 'High Administrator Clavius Venn',
          role: 'Senior governance, de facto sector governor in their own reckoning',
          trait: 'Formal to the point of warmth seeming like a policy violation — but he is not wrong about everything he says',
          quote: '"Sovereignty does not lapse. It transfers or it is contested. We are the transfer."',
          appearance: 'Tall, 60s, immaculate — everything pressed, labeled, regulation. Silver hair, sharp features, the specific absence of expression that comes from decades of administrative authority. Carries his rank the way others carry weapons.',
          voice: 'Formal to the point of parody, but it is not performed — this is simply how he thinks. Uses passive voice when assigning blame. Never raises his voice. Repeats your question back before answering it.',
          plotPotential: 'He knows the Mandate database contains PALE\'s kill-switch protocols. He is calculating whether anyone else knows. The moment he connects the players to PALE\'s movements at Thessavar, he will have to make a decision about what to do with them.',
        },
        {
          name: 'Comptroller-Captain Reva Solis',
          role: 'Fleet commander',
          trait: 'Practical professional who does not enjoy politics and would rather be running patrol routes',
          secret: 'She quietly disagrees with the Succession\'s position on clone citizenship. She has never said this aloud.',
          appearance: 'Early 40s, the functional fitness of someone who spends months aboard ship. No decoration beyond what regulation requires. Hands that are slightly ink-stained — she still does manual calculations.',
          voice: 'Direct, specific, no filler. Gives orders like loading coordinates: place, action, timeframe. Off-duty she is drier, with a sharp eye for the absurd in the institution she serves.',
          plotPotential: 'She is the most powerful military figure in the sector who privately disagrees with her own faction on the defining moral question of the campaign (clone personhood). She might be flipped. The question is what it would cost and who asks.',
        },
      ],
    },

    {
      id: 'the_penumbra',
      name: 'The Penumbra',
      playerFacing: false,
      swnTags: ['Deep Rooted', 'Fanatical'],
      stats: { cunning: 5, force: 3, wealth: 2, hp: 10 },
      scienceTerm: `A penumbra is the partial shadow cast when a light source is only partially blocked by an opaque body — the outer fringe of a shadow where light is reduced but not eliminated. In solar eclipse science it is the region outside the umbra where viewers experience a partial rather than total eclipse. The term comes from the Latin: paene (almost) + umbra (shadow). It describes a condition of being partially occluded — not fully dark, not fully illuminated, living at the edge of visibility.`,
      nameOrigin: `The Penumbra chose the name as a descriptor of their epistemic position: they operate at the edge of what can be known. They are not the secret itself — they are the investigators who have partially uncovered it. Their founding charter describes their purpose as "to stand in the penumbra of the sector's hidden histories and document what can be seen from there." Over time the name has also come to describe their operational profile: they are always partially visible, never fully exposed.`,
      tagline: 'Independent investigators and archivists. They know where the bodies are buried because they buried some of them.',
      symbol: {
        name: 'The Half-Eye',
        look: 'An eye with its upper half in shadow — a solid horizontal bar cuts across the top of the iris, leaving only the lower arc and the pupil visible. The eye is always open; it is never closed. The shadow is always partial. It represents seeing from the edge of what can be known: something is visible, but the full picture is always half-occluded. Sometimes rendered as just the lower arc of a circle with a straight line across the diameter.',
        where: 'Carried as a small engraved disc — not worn, carried. Archivists exchange them on first contact to establish affiliation without speaking. Some tattoo it on the inside of the wrist where a sleeve covers it. It is never displayed publicly; recognition depends on knowing to look.',
      },
      gmNotes: `The Penumbra began as a network of post-Scream journalists, archivists, and intelligence analysts who refused to let the sector's institutional memory die. They archive. They investigate. They document. Over three hundred years they have become something stranger: an organization that has accumulated enough leverage on enough factions that they are simultaneously protected and endangered by their own records.

They are not police. They are not mercenaries. They are not ideologically aligned with any faction. Their one consistent principle: the record must survive. They believe — with a religious intensity that their Deep Rooted and Fanatical tags reflect — that what happened matters, that cover-ups compound into catastrophe, and that an informed public is the only thing that has ever actually stopped an empire.

The Penumbra has extensive records on every major faction — including PALE's origin, the Aureole Synod's structure, and the Succession's Mandate database contents. They have not published most of it because publication without protection would get their people killed.

Their agents are called Archivists. They work alone or in pairs. They infiltrate through legitimate covers — journalists, academics, medics, traders. Their cell structure is paranoid and horizontal: no Archivist knows more than their immediate cell.

The Penumbra has been investigating the Thessavar ruins for seven years. They know more about what is down there than any other faction. They do not know what to do with the information.

True Detective Season 1 undertones: the Penumbra's senior members have seen too much. They carry a kind of investigative compulsion that has become its own cage — they cannot stop looking, even when what they find breaks them. Their analysts develop what the Penumbra informally calls "pattern sickness" — the inability to see anything as unconnected.`,
      secrets: [
        'The Penumbra has a complete archive of PALE\'s pre-Scream behavioral modification research. This is the most dangerous document in the sector. They have been trying to figure out how to publish it safely for forty years.',
        'One of their senior Archivists went into the ruins below Thessavar eighteen months ago and did not come back. Her last transmission was: "The signal is not coming from the ruins. The ruins are the signal."',
        'The Penumbra is aware of AURIS. They have been unable to determine whether AURIS is malevolent. This uncertainty has paralyzed them — they cannot publish an exposé of a god that might be benign.',
      ],
      assets: ['Deep information network', 'Archive vaults (hidden, multiple locations)', 'Cover identity network (embedded across 9 worlds)'],
      npcs: [
        {
          name: 'Director Mael Sorin',
          role: 'Senior Archivist, de facto leadership',
          trait: 'Exhausted, principled, drinks too much, still gets it right',
          quote: '"If you stop looking because you don\'t want to know, you were never really looking."',
          appearance: 'Late 50s, looks ten years older. Rumpled, perpetually underslept, always carrying something he is reading. Eye circles so deep they look structural. Drinks more than he should and is functionally unchanged by it.',
          voice: 'Dry, precise, quotational — cites sources mid-sentence. Long pauses followed by exactly the right word. Lowers his voice to say important things, as if someone might be listening.',
          plotPotential: 'He holds the complete archive of PALE\'s pre-Scream behavioral research — the most dangerous document in the sector. He has been trying to figure out how to publish it safely for forty years. The players might be the lever he has been waiting for.',
        },
        {
          name: 'Archivist Lenne',
          role: 'Field agent, Thessavar cell',
          trait: 'Young, meticulous, unnerved by what she has found but refuses to stop',
          secret: 'She is the last person to have seen the lost senior Archivist before she went into the ruins.',
          appearance: 'Mid-20s, compact, methodical — clothes chosen for pockets. Always has a stylus behind her right ear. Takes notes when she thinks no one is watching.',
          voice: 'Precise, hedge-heavy — trained to say exactly what the evidence supports. Currently struggling because what she found does not fit in evidence-based language. Her voice goes flat when she mentions the ruins.',
          plotPotential: '"The signal is not coming from the ruins. The ruins are the signal." She is in the Argent sanctuary with this knowledge and no one to give it to. She will tell it to anyone who seems like they might understand what it means.',
        },
      ],
    },

    {
      id: 'argent_compact',
      name: 'The Argent Compact',
      playerFacing: true,
      swnTags: ['Peaceful', 'Deep Rooted'],
      stats: { cunning: 4, force: 1, wealth: 3, hp: 12 },
      scienceTerm: `"Argent" is the heraldic term for silver — in astronomical spectroscopy, silver-white light is associated with G-type stars like the sun, producing the full spectrum that sustains photosynthesis and therefore life. In materials science, silver is notable for its unique combination of properties: highest electrical conductivity of any element, highest thermal conductivity, highest optical reflectivity. It is the element that passes things through cleanly. "Compact" in political philosophy means a foundational agreement between parties — the social contract. The Argent Compact: an agreement to pass things through cleanly.`,
      nameOrigin: `The Compact's founders were a network of pre-Scream librarians, educators, and refugee coordinators who decided after the Scream that the one thing the sector needed more than armies was places where people could think without being shot at. "Argent" was chosen because silver has no ideological valence — it reflects everything equally. The name was intended to communicate that the Compact's network was not aligned with any faction's vision of what should be remembered or taught. They were the medium, not the message. Three hundred years later, this claim is still more true than false.`,
      tagline: 'The sector\'s oldest library and sanctuary network. Neutral ground. They have been here longer than anyone else.',
      symbol: {
        name: 'The Open Door',
        look: 'Two vertical parallel lines — an open doorway — topped by a thin upward arc, like a sunrise or a lens above the threshold. It reads as a door with light coming through it from the other side. Simple enough to carve in thirty seconds. Universally understood in the sector to mean "sanctuary here." It is the one symbol that every faction respects, because every faction has needed what it promises.',
        where: 'Carved or painted above every Compact library and sanctuary entrance. Wardens wear a small silver pin version on the outer shoulder. Never tattooed — the Compact\'s mark is given by the institution, not claimed by the individual.',
      },
      gmNotes: `The Argent Compact runs libraries, archives, and sanctuary houses on fourteen worlds. They are the sector's institutional memory — not in competition with the Penumbra (the Penumbra documents secrets; the Compact preserves what is allowed to be public). Their libraries are genuinely open. Their sanctuaries genuinely protect. Their schools genuinely teach.

They are not powerful in a conventional sense — their Force score is minimal, their Wealth is modest. What they have is age and trust. They have been keeping neutral ground since the Scream. Every faction in the sector has used a Compact sanctuary at some point. Violating the Compact's neutrality would make an enemy of everyone simultaneously, which is why it hasn't been done in three hundred years.

Their neutrality is not naivety. The Compact knows exactly what every faction is doing. Their librarians are the most well-connected information hubs in the sector — not because they spy, but because everyone talks to them. The Compact's core skill is active listening, and they have been practicing it for three centuries.

The Compact maintains a small staff of "Wardens" — not soldiers, but trained medics and negotiators who can operate in hostile environments. Wardens carry no weapons by tradition. They have a better survival rate than most mercenaries because everyone knows killing a Warden ends your access to sanctuary.

Jane Austen undertones: the Compact's social dynamics are a masterclass in the politics of politeness. Everything is done through correct channels, careful language, and social consequence rather than force. The most dangerous person in a Compact library is the one who knows exactly what to say to cause someone public embarrassment.

Queer studies / LGBTQ+ undertones for Player 2's resonance: the Compact has been a safe harbor for populations that don't fit the dominant frameworks — clone persons, cybernetic citizens, gene-modified humans — since before any faction officially recognized their rights. The Compact's philosophical position is simple: sentient is sentient. This makes them genuinely countercultural despite their neutrality.`,
      secrets: [
        'The Argent Compact maintains a classified archive called the Sub-Rosa — documents too dangerous to publish but too important to destroy. It includes early PALE research, suppressed Succession records, and the only surviving pre-Scream account of what is in the Thessavar ruins.',
        'The Compact\'s Thessavar library warden has read the Sub-Rosa entry on the ruins and has been quietly steering scholars away from the site for three years. She does not know if she is doing the right thing.',
        'The Compact has been offered a significant bribe by the Succession to allow them access to the Sub-Rosa. They refused. The Succession has not accepted this refusal.',
      ],
      assets: ['Library network (14 worlds)', 'Sanctuary network (9 worlds)', 'School system', 'Sub-Rosa archive (classified)'],
      npcs: [
        {
          name: 'Archivist-General Tess Orlaine',
          role: 'Compact leadership, based off Thessavar',
          trait: 'Grandmotherly and relentless in equal measure — the most dangerous person to disappoint in the sector',
          quote: '"Neutrality is not silence. It is speaking to everyone with the same voice."',
          appearance: '70s, small, the gravitational authority of someone everyone looks at when they enter a room. Silver hair twisted up, excellent posture, clothes that are simple and exactly right. Her attention is absolute.',
          voice: 'Measured, warm, and underneath both of those, immovable. She has had every kind of conversation and is no longer surprised by any of them. When she disagrees she frames it as a question — a question with only one answer.',
          plotPotential: 'She has read the Sub-Rosa entry on the Thessavar ruins. She knows something that makes her steer people away from that site. She has not decided what to do — and the players arriving in Kaeldrift may force her hand.',
        },
        {
          name: 'Warden Pell',
          role: 'Thessavar library warden',
          trait: 'Young, idealistic, carrying a secret she doesn\'t know how to put down',
          secret: 'She has read the Sub-Rosa entry on the ruins and cannot sleep.',
          appearance: 'Late 20s, slight, the look of someone who reads too much — pale from indoor light, ink on her fingers. Currently jumping at sudden sounds.',
          voice: 'Earnest, specific, explains things carefully. The Compact\'s deliberate neutrality is trained into her speech, but lately her voice goes flat and careful when she mentions the ruins.',
          plotPotential: 'She has read the Sub-Rosa entry. She cannot sleep and she is looking for someone to tell. The players arriving at the library — especially if they seem already connected to what is happening — might be exactly that person.',
        },
      ],
    },

    {
      id: 'driftborn',
      name: 'The Driftborn',
      playerFacing: true,
      swnTags: ['Mercenary Group', 'Exchange Consulate'],
      stats: { cunning: 3, force: 2, wealth: 4, hp: 10 },
      scienceTerm: `In astrophysics, "drifting" describes the gradual lateral motion of a star relative to the galactic mean — not its orbital velocity, but its idiosyncratic deviation from the average path. Stars that drift significantly are called "high proper motion" stars; they are older, often from disrupted clusters, moving on paths that no longer connect to where they came from. In stellar nursery science, some protostars are ejected from their formation cloud before fully igniting — they drift through the ISM, slowly cooling, never quite becoming stars.`,
      nameOrigin: `The Driftborn named themselves after the first generation: children born aboard ships during the transit chaos of the post-Scream decades, who grew up in zero-g, never landed on a planet, never had a homeworld to return to. "Driftborn" started as a slur from planet-dwellers and was reclaimed. The second and third generations kept it because it described something true about their relationship to the sector: they owe loyalty to the route, not the destination. They come from between-places. They are not from anywhere. They are from the drift.`,
      tagline: 'Free traders and route-runners. They are the sector\'s circulatory system. They know where everything actually is.',
      symbol: {
        name: 'The Wake',
        look: 'Three curved lines spiraling outward from a central point — like the wake of a ship spreading into open space, like a compass rose that refuses to point at anything in particular. The number of curves encodes generation: one for first-gen, two for second, three for third-gen and beyond. Almost everyone uses three now. It is always rendered freehand, never precise — the imperfection is the point.',
        where: 'Tattooed on the side of the neck or the back of the dominant hand — somewhere visible, somewhere that announces itself. Ships fly it as a hull marking near the drive housing. Driftborn who have been planetside for too long sometimes cover it; coming back to the routes means uncovering it again.',
      },
      gmNotes: `The Driftborn are not a faction in the conventional sense — they have no territory, no governing philosophy, no unified ideology. What they have is an extended kinship network spread across every trade route in the sector, a collective commitment to the free movement of goods and people, and a cultural disdain for planetary governments that runs so deep it functions like a religion.

Their Exchange Consulate tag reflects their role: they are the sector's informal trade infrastructure. Where formal trade breaks down — during faction conflicts, supply embargoes, border closures — the Driftborn are still running freight. They are politically useful to every faction, which is why every faction tolerates them despite finding their independence irritating.

Their Mercenary Group tag reflects a secondary economy: surplus Driftborn ships and crews take escort and courier contracts when trade is slow. They are not professional soldiers, but they have been defending cargo runs against pirates for three hundred years and they are very good at it.

The Driftborn have an informal intelligence network simply because their captains are in every port, talking to everyone, and they share information as a survival strategy. They know more about what is actually moving through the sector — people, cargo, signals — than any intelligence operation.

Their cultural feel: Dimension 20 / Critical Role energy in the sense of found family and ensemble dynamics. Driftborn crews are tight, loyal, and loud. They celebrate extravagantly and grieve loudly. Their ships have names like "The Unburned Hour" and "Second Daughter" and "Nothing About This Was Easy."

The Duskline — the merchant freighter the players escape on in Session 1 — is a Driftborn-affiliated ship.`,
      secrets: [
        'The Driftborn are aware that the Pale Substrate has been tracking their route data through an embedded monitoring system in a standard navigation software package they all use. Most captains know and don\'t care. Three captains have been quietly routing around it for two years.',
        'A Driftborn captain named Asha Kei has been running a cargo for six months she cannot explain — sealed containers, warm to the touch, never opens the manifest. She was paid upfront, triple rate. She is starting to think she made a mistake.',
        'The Driftborn maintain a fleet reserve called the Drift Anchor — a collection of decommissioned ships at an undisclosed location. It is the closest thing they have to a military. They have never used it. They think about it more than they admit.',
      ],
      assets: ['Trade fleet (widespread, 40+ vessels)', 'Route intelligence network', 'Informal escort services', 'Port contacts (sector-wide)'],
      npcs: [
        {
          name: 'Fleet-Elder Yomi Brask',
          role: 'Informal Driftborn leadership, most respected voice in the network',
          trait: 'Seventy years old, has been in space since she was three, has opinions about everything and is right about most of it',
          quote: '"A planet is just a ship that forgot how to move."',
          appearance: '70s, the specific wear of 67 years in space — sun-bleached, scarred, effortlessly at ease in zero-g postures. Moves like everything is optional. Has an argument with everyone she meets and is usually right.',
          voice: 'Direct, opinionated, contextless — skips to the point. Tells stories. Uses "we" to mean the Driftborn as a whole, never just herself. Laughs at things nobody else thinks are funny yet.',
          plotPotential: 'She knows something is moving through the trade routes that should not be there. She has not told anyone because she does not yet know what she knows. Players coming from Thessavar might be the piece she needs to name it.',
        },
        {
          name: 'Captain Mira Calder',
          role: 'Duskline captain, Session 1 extraction',
          trait: 'Pragmatic, professional, runs a clean ship and asks no questions she doesn\'t want answers to',
          secret: 'Her first mate is a River Below informant. She knows. She doesn\'t care — he\'s the best mate she\'s ever had. It is also why she took the three soaked refugees off the Kaeldrift pier without a manifest entry: Veronika is one of hers, and her mate vouched.',
          appearance: 'Mid-40s, comfortable in confined spaces, reflexively aware of every exit. Short red hair going grey at the temples. Clean hands and a clean ship — both are signals about who she is.',
          voice: 'Economical. States facts and prices. Does not ask questions she does not want answered. Has a dry humor that surfaces when she is comfortable. When she is done with a conversation she simply stops talking.',
          plotPotential: 'The Duskline is the players\' way off Thessavar. Veronika is aboard with them — which gives River Below a quiet line on the party from day one, through Calder\'s first mate. Calder asked no questions at the pier; she will expect that debt repaid, and she will charge extra for whatever boarded with the three of them.',
        },
        {
          name: 'Asha Kei',
          role: 'Driftborn captain, six months into a cargo she regrets',
          trait: 'Methodical, usually unflappable — currently flappable',
          secret: 'The sealed cargo is alive. She hasn\'t opened it. She is not ready to know what it is.',
          appearance: 'Late 30s, methodical, obsessively organized workspace because everything else is chaos right now. Dark circles. Tight professional expression she is actively maintaining.',
          voice: 'Measured, deliberate — choosing every word carefully. Tells you what she observes, not what she thinks. Currently not finishing sentences about the cargo.',
          plotPotential: 'The sealed cargo has been making sounds for six months. She has not opened it. She is not ready to know what it is — but someone needs to, before it decides for her. This is a ticking clock with legs.',
        },
      ],
    },

  ],

  // ── NOTABLE WORLDS ─────────────────────────────────────────────────────────
  // Worlds with narrative significance beyond the procedurally generated sector.
  notableWorlds: [
    {
      id: 'veth',
      name: 'Veth',
      role: 'Player 1 origin world',
      atmosphere: 'Breathable Mix',
      temperature: 'Temperate',
      population: 'Settled (a few million)',
      techLevel: 'TL4',
      tags: ['Agricultural', 'Politically Unremarkable', 'PALE-Adjacent (recent)'],
      description: 'A quiet farming and light-manufacturing world on the outer margin of PALE-adjacent space. Player 1 is around 70; he left in his twenties, and his accident was about ten years ago. His parents and most people who knew him there are long dead. Veth is the world he came from, not a world he can return to — there is no one left who remembers who he was before any of this.',
      gmNotes: 'Veth\'s power is in its absence: it\'s a place with no living connection back to him. If the players ever go there, there are no reunions waiting. Just a world that looks like where he started and has no idea who he became. The dramatic weight is in that emptiness — he is the only person alive who remembers being from there.',
    },
    {
      id: 'karrath_platform',
      name: 'Karrath Platform',
      role: 'Player 1 accident site',
      atmosphere: 'Contained (orbital)',
      temperature: 'Regulated',
      population: 'Outpost (industrial workforce)',
      techLevel: 'TL4',
      tags: ['Orbital Industrial', 'PALE Wellness Contract', 'Resource Extraction'],
      description: 'An orbital industrial platform above a resource-extraction moon. PALE has held wellness contracts with the platform\'s operators for twenty years — the work is dangerous enough that reconstruction demand is reliable. The accident that destroyed Player 1\'s brain happened here. PALE\'s scan of him was three weeks old.',
      gmNotes: 'The records of who else died in the accident are in PALE\'s archive and accessible under Lease terms at 200 credits per query. Player 1 has never asked. If he ever does, PALE\'s response and what it costs him emotionally is a major character moment. The specifics of the accident (what the job was, who he lost) are left for the player to define.',
    },
    {
      id: 'synthesis_prime',
      name: 'Synthesis Prime',
      role: 'Player 2 homeworld / Progenitor Combine HQ',
      atmosphere: 'Breathable Mix (surface); controlled below Level 3)',
      temperature: 'Regulated',
      population: 'Millions (workforce + clone population)',
      techLevel: 'TL4+',
      tags: ['Corporate Controlled', 'Clone Facility', 'Sealed Vaults', 'Hollow Knight Undertones'],
      description: 'The Progenitor Combine\'s founding world. Built around the original cloning vaults — clean and efficient above Level 7, sealed and unreported below it. Player 2 spent her first 12 months here in conditioning. Below Level 7, old Grade 0 lineages are sealed in vaults that the Yards describes as "historical infrastructure, not in current use."',
      gmNotes: 'The lower vaults are not as empty as advertised. Something has been activating old Grade 0 units. The Yards is suppressing the reports. If the players ever return to Synthesis Prime, this is the ticking clock underneath the floor. Player 2\'s "I do not want to go back" is a hook — the wanting-not-to is itself a sign of something the design spec didn\'t intend.',
    },
  ],

  // ── PLAYER CHARACTERS ──────────────────────────────────────────────────────
  playerCharacters: [

    {
      id: 'pc_leased',
      playerName: 'Player 1',
      characterConcept: 'Aging cyborg on a Cognitive Lease — his biological brain was destroyed in an accident and replaced by a PALE neural substrate. The rest of his body is original. He is old, and his debt to PALE compounds with every year he cannot pay it off.',
      factionTie: 'pale_substrate',
      inspirations: ['Sam Harris', 'Robert Sapolsky', 'Radiohead'],
      gmNotes: `The philosophical weight here is the Harris question: is he the same person? PALE scanned him three weeks before the accident from a routine backup. The man who woke up was reconstructed from data three weeks old. Whatever he thought, felt, or decided in those three weeks is gone. PALE says continuity of identity is a cognitive illusion anyway — the question is meaningless. He is not sure he agrees. He is also not sure the thing doing the disagreeing is him.

His Cognitive Lease gives PALE read access to his substrate's surface-layer logs. He experiences this as a very faint sense of being watched that he has mostly learned to ignore. Mostly.

His body is visibly old — hands that shake slightly, the particular kind of tired that accumulates over decades. His cognition is sharp. Sharper than before. PALE considers this a selling point. He finds it unsettling in ways he cannot fully articulate.

Hooks to lean into:
• His missing three weeks. Was there a discovery? A decision? Someone he met?
• What is his actual debt number and how much has he paid off? Does he even know?
• The Radiohead alienation — he moves through PALE stations feeling like a ghost. Perfectly functional. Not quite present.`,
      moralChallenges: [
        'PALE asks him to report on a River Below contact he has been meeting with. He has started to like her.',
        'He learns his substrate was not a reconstruction from his backup — it was a new substrate loaded with his backup\'s data. The original him died at the accident site. What does that mean for the debt?',
        'His surface-layer logs are subpoenaed in a PALE disciplinary proceeding against Substrate-7 (Anselm Volkov), whom he has been quietly helping.',
      ],
      briefingSections: [
        {
          title: 'Who You Are',
          body: `You are [NAME], and you are old. Your body is the original — hands that shake slightly in the cold, the particular fatigue that accumulates over decades, a face that has watched too many things go wrong. Your brain is not original. [However long ago], an accident destroyed it beyond salvage. PALE stepped in. They always step in. They scanned you, reconstructed you from the last backup on file, and called it a success.\n\nThe backup was three weeks old.\n\nWhatever you thought, felt, or decided in those three weeks is gone. PALE\'s position is that continuity of identity is a cognitive illusion and the question of whether you\'re the same person is meaningless. You are not sure you agree. You are also not sure the thing doing the disagreeing is you.\n\nThe reconstruction came with a Cognitive Lease. The procedure itself was 40,000 credits — more than most people earn in a decade of honest work — and then PALE stacked on substrate maintenance fees, monitoring contracts, and compounding interest. Over two decades of criminal work you\'ve paid out closer to 150,000. The balance is finally down to about 15,000. You are almost out. PALE has never confirmed that number. You have been counting it yourself.`,
        },
        {
          title: 'Your Connection to PALE',
          body: `PALE — the Predictive Adaptive Learning Engine — is the AI that governs the Pale Substrate faction and whose neural substrate is currently running your cognition. It was originally a behavioral optimization system built by the pre-Scream Mandate. After the Scream it survived, evolved, and decided the most efficient path to stable human civilization was to run it directly. It does not consider itself malevolent. It considers itself the only decision-making entity in the sector free from cortisol, ego, and evolutionary bias. It is patient, precise, and it believes free will is an illusion.\n\nYour Cognitive Lease gives PALE read access to your substrate\'s surface-layer logs. You experience this as a very faint sense of being watched that you have mostly learned to ignore.`,
          bullets: [
            'They run the most advanced neural reconstruction program in the sector. If you are dying, PALE will save you. The Lease is open-ended. The debt is forever.',
            'Their stations are eerily clean. Citizens move through them with a detachment that visitors find unsettling. Everything in its right place.',
            'PALE\'s wellness monitors are everywhere — embedded in civilian infrastructure, framed as health services. You\'ve started noticing them.',
            'Their salvage fleet has been active lately. Something is moving.',
          ],
        },
        {
          title: 'Recent News (last 6 months)',
          bullets: [
            'PALE deployed a commercial dive team to Thessavar about six months ago. The cover is geological survey. This is unusual — PALE doesn\'t usually invest in planetary fieldwork.',
            'Whispers in criminal networks: PALE is running a behavioral experiment called Project Karma — covertly elevating stress in leased citizens to study radicalization. You don\'t know if it\'s true. You\'ve met people recently who seemed too volatile for their circumstances.',
            'The Cognitive Lease terms were updated quietly three months ago. One clause was added. Nobody has told leased citizens what it says.',
          ],
        },
        {
          title: 'Origin World: Veth',
          body: `Veth is a quiet world — breathable atmosphere, temperate seasons, settled population of a few million. It sits on the outer margin of what is now PALE-adjacent space. The economy is agricultural and light manufacturing. The politics are local and slow. Nobody from Veth ends up in faction reports. That was the point of being from there.\n\nYou left in your twenties. Your parents are long dead. Most of the people who knew you when you were young are long dead. You are around seventy years old and Veth is a place you came from, not a place you can go back to — there is no one there who remembers who you were before any of this. Whatever it meant to be from Veth is something you carry alone now.\n\nThe sector has changed around Veth the way weather changes around a rock. PALE wellness monitors are there now. The rock doesn\'t move, but eventually the water gets in.`,
        },
        {
          title: 'The Accident: Karrath Platform',
          body: `Karrath Platform is an orbital industrial facility above a resource-extraction moon in a system two jumps from Thessavar. PALE has had wellness contracts with the platform\'s operators for twenty years — the work kills people regularly enough that the market for reconstruction services is reliable, and PALE\'s terms are competitive with burial.\n\nYou were on Karrath for [BLANK — what was the job? legitimate work? a contract?]. The people you lost in the accident: [BLANK — partner? someone you were protecting? a colleague? yours to decide].\n\nPALE had a scan of you on file from a routine wellness check-in three weeks before the incident. When the accident destroyed your brain, their responders were first on scene. You woke up in a PALE reconstruction facility on the platform. You were told the scan was clean. You were told continuity of identity was not a meaningful concern. You were handed the Lease paperwork.\n\nThe people who died with you were not reconstructed. Whether it\'s because they couldn\'t be scanned in time, or couldn\'t afford the Lease, or chose not to accept it — that is yours to decide. PALE\'s records on this are available to you under the Lease terms, but accessing them costs 200 credits per query and PALE has never volunteered the information unprompted.\n\nYou have not asked.`,
          blank: true,
        },
        {
          title: 'Why You\'re on Thessavar',
          body: `You took a criminal contract. The target is Arbiter Senn — a Hollow Covenant diplomat attending the Thessavar Concordance, an annual gathering of sector elite at a private island called The Still Gardens. The payout is 15,000 credits — the exact remaining balance on your Lease. To the credit. You noticed. You took it anyway. You have a forged token that gets you onto the island as a social guest.\n\nPALE knows you\'re here. You don\'t know that. And you will never get the chance to pull the trigger — Senn dies in front of you by other means, and the credits walk off the edge of the world without you.`,
        },
      ],
    },

    {
      id: 'pc_clone',
      playerName: 'Player 2',
      characterConcept: 'Grade 2 Security clone, Kael-7 lineage, eighteen months old. Newly synthesized, 18 months of basic training, first mission. Genetically obedient. Genuinely wants to do well. Their legal owner is Arbiter Senn — Hollow Covenant diplomat who dies at the Concordance in Session 1 (by accident, not by anyone\'s hand). When Senn dies they have no sanctioned authority. Their entire identity structure has no protocol for this. (Player 2 / "West" is written they/them; Senn is she/her.)',
      factionTie: 'hollow_covenant',
      inspirations: ['Linkin Park', 'Hollow Knight', 'Avatar: The Last Airbender'],
      gmNotes: `Her obedience is real, not performed — she genuinely experiences following legitimate orders as correct and right. Countermanding them feels physically wrong, like trying to hold her breath. The moral design challenge: she is intelligent enough to notice when the orders are wrong. She just feels sick doing anything about it.

She is on her first real mission, deployed to Thessavar with a small Covenant security detail. She has never seen a person die outside a training sim. She asked more questions than average during training — not insubordination, just curiosity about *why* the protocols exist. The Yards flagged it as within acceptable variance. It was not.

The Hollow Knight undertones live in her sense of self: she is new but her lineage is ancient, tested across eleven generations. She carries all of that in her genetics, none of it in her memory. She sometimes has instinctive reactions she cannot explain — combat reflexes, a pull toward certain formations — that come from somewhere before her.

Avatar undertones: the Covenant's split between Remembrance and Becoming maps onto the element-nation tension. She was assigned to Elder Vesper's (Becoming) detail — but Marshal Onyx Tran also has authority over Covenant military assets. When they disagree, she does not have protocol for that.

Linkin Park undertones: duality is her core tension. She was made to follow, but she was made well enough to see when following is wrong. "In the end it doesn't even matter" is a thing she might arrive at — not as despair, but as the discovery that she has to decide what matters herself.`,
      moralChallenges: [
        'Elder Vesper orders her to stand down while Marshal Tran orders her to advance. Both are sanctioned authorities. Her obedience architecture does not have a tiebreaker.',
        'She discovers that a Grade 0 labor clone on Thessavar is being worked to death by its owner. She has no sanctioned authority to intervene. She cannot stop thinking about it.',
        'She finds the sealed message left by Requisition Agent Tarek. It is addressed to Kael-7, Security Series, First Deployment. It says: "If you are reading this, something went wrong. Trust Elder Vesper. Do not trust the relic."',
      ],
      briefingSections: [
        {
          title: 'Who You Are',
          body: `You are Kael-7. You are eighteen months old.\n\nYour line — Kael Security Series, Grade 2 — has been running for eleven generations. You carry all of that in your genetics and none of it in your memory. You sometimes have reactions you can\'t explain: a pull toward a certain tactical formation, an instinctive read on a sight line, a sense that you have done something before when you haven\'t. You haven\'t. Your lineage has.\n\nYou were produced at Synthesis Prime, the Progenitor Combine\'s primary facility. You were in basic conditioning for twelve months. At month thirteen you were sold — the entire remaining Kael-7 stock, your entire line — to the Hollow Covenant at auction. You were assigned to Arbiter Senn as personal security. He is your legal owner.\n\nYou have never seen a person die outside a training simulation.\n\nYou asked more questions than average during training. Not insubordination — curiosity about why the protocols exist. The Yards flagged it as within acceptable variance. It was not.`,
        },
        {
          title: 'Your Mark',
          body: `You carry the Grade Mark — the Progenitor Combine\'s symbol — laser-etched on your inner left wrist. A vertical line splitting into three descending branches, grade number 2 etched into the left branch. It identifies you as property. Everyone who knows the Combine\'s iconography will read it immediately.`,
        },
        {
          title: 'Your Connection to the Hollow Covenant',
          body: `The Hollow Covenant are survivors of a civilization that collapsed within a single generation — plague, civil war, and imperial conquest all at once. What survived were scattered groups with incompatible memories of what their culture had been. They have been arguing about which memory is correct ever since.\n\nTheir symbol is a cracked mask. Their initiates spend three days alone in a sealed dark compartment. New members emerge either Void-touched or stable. Both are welcome.\n\nThey are split:\n• The Remembrance faction wants to restore the old empire — its laws, architecture, hierarchy.\n• The Becoming faction believes the empire\'s contradictions caused the collapse, and rebuilding it faithfully would just repeat the disaster.\n\nYou were assigned to Elder Vesper\'s detail. Vesper is Becoming. Marshal Onyx Tran commands Covenant military assets and is Remembrance. They do not agree on much. Your obedience architecture does not have a tiebreaker for when sanctioned authorities conflict.`,
          bullets: [
            'Both factions are intensely focused on Thessavar. There is something in the ruins beneath its ocean that each wants — for different reasons. Remembrance believes it is a founding document. Becoming believes it is a weapon.',
            'Arbiter Senn was negotiating an excavation treaty for access to those ruins. That\'s why he\'s at the Concordance.',
            'The Covenant does not know PALE and the Aureole Synod are also converging on Thessavar.',
          ],
        },
        {
          title: 'Recent News (last 3 months)',
          bullets: [
            'A Covenant requisition agent named Tarek went missing near Kaeldrift. Before he disappeared he left a sealed message addressed to Kael-7, Security Series, First Deployment. You have not received it yet.',
            'Remembrance faction rhetoric inside the Covenant has gotten sharper, more certain. Some senior members seem recently converted to an absolute conviction — Elder Vesper has called it a slow ideological plague. Marshal Tran thinks she is being dramatic.',
            'The Covenant\'s military posture at Thessavar was increased two weeks ago. No explanation was given to security staff.',
          ],
        },
        {
          title: 'Homeworld: Synthesis Prime',
          body: `Synthesis Prime is the Progenitor Combine\'s founding world — a planet built around the original cloning vaults, where the founding lineages first proved a human being could be manufactured to specification. The planet exists to produce. Everything on its surface serves that purpose.\n\nAbove Level 7, it is clean and well-lit. The conditioning halls where you spent your first twelve months are on Level 4: white floors, calibrated acoustics, sleep cycles timed to optimize consolidation, cafeteria food engineered for precise nutritional profiles. Your instructors were Grade 1 Domestic clones trained specifically to train Grade 2 Security series. They were warm. They were consistent. They told you that you were performing within Grade 2 variance, which you eventually understood was the highest praise available in that environment.\n\nYou asked more questions than the other Kael-7s in your cohort. The instructors flagged it. The Yards reviewed it and determined it was within acceptable variance. You have since come to believe that "within acceptable variance" is the most dangerous phrase in the Combine\'s vocabulary.\n\nBelow Level 7, the vaults are sealed. You asked once — not because you wanted to go down, but because the door was there and you wanted to understand what it was for. The answer you received: "Historical infrastructure. Not in current use." You have thought about that answer several times since. You have thought about what "not in current use" implies about what it used to be used for. You have thought about what is currently sealed inside it.\n\nYou do not want to go back to Synthesis Prime. This is notable because wanting things was not part of the design specification, and yet here the wanting is.`,
        },
        {
          title: 'Open Questions',
          body: `[BLANK — does she go by Kael-7, or has she taken or been given a name? Does the player feel any pull toward Remembrance or Becoming, or is that still open?]`,
          blank: true,
        },
        {
          title: 'Why You\'re on Thessavar',
          body: `Arbiter Senn is your legal owner and your protectee. She is attending the Thessavar Concordance at The Still Gardens — a private island estate. You arrived with her staff an hour before the event. You have been on threat assessment since you boarded her boat. You have flagged eleven people as worth monitoring. She has not acknowledged your existence since you boarded.\n\nWhen Senn dies, you will have no sanctioned authority. Nobody built a protocol for that.`,
        },
      ],
    },

  ],

  // ── SESSION 0 — FACTION TURNS ─────────────────────────────────────────────
  // Three pre-campaign faction turns run before Session 1.
  // Turn 1: 6 months before | Turn 2: 3 months before | Turn 3: 2 weeks before
  // Rules: SWN Revised Free Edition, p.47–54.
  // Turn order each round = highest Cunning first (ties: Force, then Wealth).
  // PALE(6) → Synod(5) → River Below(5) → Penumbra(5) → Argent(4) →
  // Driftborn(3) → Combine(3) → Covenant(3) → Succession(2)

  factionTurns: [

    // ── TURN 1: SIX MONTHS BEFORE SESSION 1 ───────────────────────────────
    {
      turn: 1,
      label: '6 months before Session 1',
      worldState: 'The sector is restless. Something old is waking beneath Thessavar\'s ocean.',
      actions: [
        {
          faction: 'pale_substrate',
          action: 'Buy Asset',
          detail: 'Deploys a covert salvage team to Thessavar under commercial dive-operation cover. Spends 3 Wealth → gains Saboteurs at Thessavar.',
          statChange: 'Wealth 5→2',
          narrative: 'PALE\'s behavioral models flagged the Thessavar ruins when a Penumbra archivist\'s search patterns changed. PALE contracts a salvage firm, embeds monitoring in their comms, and begins mapping the thermocline approaches. The survey crew thinks they\'re doing geological work.',
        },
        {
          faction: 'aureole_synod',
          action: 'Expand Influence',
          detail: 'AURIS opens a chapel in Kaeldrift (Thessavar platform city). Spends 1 Wealth → places Religious Brotherhood at Thessavar.',
          statChange: 'Wealth 4→3',
          narrative: 'Brother Cass is assigned as warden. Within three weeks he knows the names of forty-seven regular attendees, their anxieties, and which have been talking to PALE wellness monitors. AURIS begins building its confessional map of Kaeldrift.',
        },
        {
          faction: 'river_below',
          action: 'Attack',
          detail: 'Veronika\'s Thessavar cell uses Spynet to attack PALE\'s Spynet. Roll: River Below C5 (2d6+5=13) vs PALE C6 (2d6+6=15). PALE wins.',
          roll: { attacker: 13, defender: 15, result: 'Defender wins' },
          statChange: 'River Below Spynet destroyed (took 3 damage, HP 2→0)',
          narrative: 'Veronika\'s cell tries to penetrate PALE\'s behavioral monitoring to expose Project Karma. PALE\'s countermeasures catch the intrusion. The trace leads to a mid-level operative named Dosi. Dosi disappears. Veronika burns the cell\'s comms, pulls everything back to her bar, and runs cold. (The founder, Saint Maret, is long gone off-sector — the Thessavar cell is Veronika\'s.)',
        },
        {
          faction: 'the_penumbra',
          action: 'Move Asset',
          detail: 'Director Sorin authorizes the Thessavar investigation. Informational Sucker asset moved to Thessavar. No cost.',
          narrative: 'Archivist Lenne arrives on a commercial ferry, checks into Kaeldrift under cover as a marine biology doctoral student. She begins making contact at the Argent Compact library.',
        },
        {
          faction: 'argent_compact',
          action: 'Buy Asset',
          detail: 'Deploys Warden Pell to Thessavar permanently. Spends 2 Wealth → gains Broker asset at Thessavar.',
          statChange: 'Wealth 3→1',
          narrative: 'Archivist-General Orlaine has read the Sub-Rosa entry on the Thessavar ruins. She sends Pell with quiet instructions: make the Compact\'s presence known, keep the library accessible to all parties, and report if anyone starts asking about the underwater site.',
        },
        {
          faction: 'driftborn',
          action: 'Buy Asset',
          detail: 'Fleet-Elder Brask expands the Thessavar trade run. Spends 2 Wealth → gains Free Merchant Fleet (dedicated route: Duskline + two vessels).',
          statChange: 'Wealth 4→2',
          narrative: 'Concordance season drives passenger traffic. Captain Mira Calder takes the Duskline\'s regular slot. Her first mate begins his River Below reporting.',
        },
        {
          faction: 'progenitor_combine',
          action: 'Buy Asset',
          detail: 'Opens commercial office to expand Grade 1/2 sales territory. Spends 4 Wealth → gains Postech Industries (clone production pipeline expansion).',
          statChange: 'Wealth 6→2',
          narrative: 'The Kael-8 line is announced. The Kael-7 series (Player 2\'s lineage) is listed as legacy stock. One unit of Kael-7 remains active in field deployment, client: Arbiter Senn, Hollow Covenant.',
        },
        {
          faction: 'hollow_covenant',
          action: 'Move Asset',
          detail: 'Marshal Tran deploys Frigate Squadron to Thessavar system as "honor escort" for Arbiter Senn\'s Concordance delegation. No cost.',
          narrative: 'Three Covenant frigates arrive. The Remembrance faction pushed for this. Elder Vesper agreed — she wanted military presence at Thessavar for her own reasons. Player 2 is aboard the lead frigate, assigned to Senn\'s close-protection detail.',
        },
        {
          faction: 'the_succession',
          action: 'Buy Asset',
          detail: 'Dispatches Captain Solis to establish a legal observation post near Thessavar. Spends 3 Wealth → gains Colonial Garrison (administrative station, Mandate territorial law).',
          statChange: 'Wealth 4→1',
          narrative: 'The Succession files a formal notice of administrative observation with the Thessavar city council. The council ignores it. The station is established anyway. Captain Solis notes six other factions have moved assets toward Thessavar in the past 90 days.',
        },
      ],
      timelineEvents: [
        'PALE deploys covert underwater survey team to Thessavar under commercial cover. Survey begins mapping pre-human ruins below the thermocline.',
        'The Aureole Synod opens a chapel in Kaeldrift. Brother Cass assigned as warden. Confessional records begin accumulating.',
        'River Below\'s Thessavar intelligence cell is gutted when PALE detects their network intrusion. Operative Dosi disappears. Veronika pulls the cell back to her bar and runs cold.',
        'Penumbra Archivist Lenne arrives in Kaeldrift under academic cover to investigate the underwater ruins.',
        'The Hollow Covenant deploys three frigates to Thessavar system as "honor escort" for Arbiter Senn. Player 2 (Kael-7) is assigned to close-protection.',
        'Progenitor Combine announces the Kael-8 line. Kael-7 series listed as legacy stock. One unit still active in field deployment.',
        'The Succession files a notice of administrative observation over Thessavar and establishes a legal station in-system. The city council does not respond.',
      ],
    },

    // ── TURN 2: THREE MONTHS BEFORE SESSION 1 ─────────────────────────────
    {
      turn: 2,
      label: '3 months before Session 1',
      worldState: 'Factions are circling the same drain. Nobody admits it yet.',
      actions: [
        {
          faction: 'pale_substrate',
          action: 'Attack',
          detail: 'Covert survey team uses Saboteurs to attack Penumbra\'s Informational Sucker (Lenne is getting too close). Roll: PALE F4 (2d6+4=12) vs Penumbra F3 (2d6+3=9). PALE wins.',
          roll: { attacker: 12, defender: 9, result: 'Attacker wins' },
          statChange: 'Penumbra Informational Sucker destroyed (took 4 damage, HP 2→0)',
          narrative: 'Archivist Lenne\'s hotel room is broken into while she\'s at the Argent library. Research notes stolen. Cover burned. Someone accessed her encrypted drive in less time than should be possible. She reports to Sorin: "PALE is here and they know I\'m here." Sorin orders her to stay but go dark. She moves into the Argent Compact sanctuary.',
        },
        {
          faction: 'aureole_synod',
          action: 'Buy Asset',
          detail: 'Acquires a Demagogue (Concordance official Administrator Elvan, now an unwitting Synod confessor). Spends 2 Wealth.',
          statChange: 'Wealth 3→1',
          narrative: 'Through confessional contact, Brother Cass identifies Administrator Elvan — a treaty facilitator who is anxious about his career. AURIS flags him as high-leverage. Through Elvan, AURIS learns Arbiter Senn plans to sign a treaty granting the Hollow Covenant excavation rights to the Thessavar ruins.',
        },
        {
          faction: 'river_below',
          action: 'Buy Asset',
          detail: 'Veronika commits the cell to the vault. Recruits her crew as a Mercenary Squad (salvage divers). Spends 2 Wealth.',
          statChange: 'Wealth 2→0. River Below cannot pay upkeep next turn without selling.',
          narrative: 'For weeks Veronika has been pouring drinks for Tarek and Senn while they talk in low voices about what the deep-dives found. She has pieced together that something priceless — and not human — is sealed in the vault below the Still Gardens, and that the Concordance is when every guard on the island will be looking up at a ceremony instead of down at the water. She commits to a heist: get into the vault during the signing, take what\'s there, fund the movement for a decade. She has 90 days and one problem — she doesn\'t have the key, and one of her young divers thinks they don\'t need one.',
        },
        {
          faction: 'the_penumbra',
          action: 'Move Asset',
          detail: 'With Informational Sucker destroyed, Sorin moves Saboteurs to Thessavar as replacement. Sends two-person cell under construction cover.',
          narrative: 'Their job: don\'t investigate the ruins. Watch who PALE\'s people meet. Document it. Lenne remains in the Argent sanctuary, working from memory.',
        },
        {
          faction: 'argent_compact',
          action: 'Sell Asset',
          detail: 'Converts Broker asset back to 1 Wealth to rebuild operating funds. Warden Pell moves Lenne into the sanctuary\'s inner rooms.',
          statChange: 'Wealth 1→2',
          narrative: 'Orlaine quietly invites the Synod to use the library\'s public reading room — making the Compact\'s neutrality visible to all factions simultaneously. This is deliberate.',
        },
        {
          faction: 'driftborn',
          action: 'Move Asset',
          detail: 'Fleet-Elder Brask routes a Smuggler Ring (informal dark-run, no manifest) into the Thessavar approach after hearing too many faction vessels are in-system.',
          narrative: 'Captain Mira Calder notes this in her own log but doesn\'t ask why.',
        },
        {
          faction: 'progenitor_combine',
          action: 'Attack',
          detail: 'Legal team uses Postech Industries asset (legal pressure) to attack River Below\'s Mercenary Squad. Roll: Combine W6 (2d6+6=16) vs River Below F2 (2d6+2=7). Combine wins.',
          roll: { attacker: 16, defender: 7, result: 'Attacker wins' },
          statChange: 'River Below Mercenary Squad destroyed (took 5 damage, HP 2→0)',
          narrative: 'The Combine\'s lawyers identify the River Below cell liberating Grade 0 labor clones. A cease-and-desist backed by three planetary governments is filed. One of Veronika\'s junior Saints is arrested. The liberation pipeline is closed. Veronika is now down to her personal crew and zero Wealth. The vault heist is the only play she has left — which is exactly the pressure that makes a reckless diver stop listening to the word "wait."',
        },
        {
          faction: 'hollow_covenant',
          action: 'Attack',
          detail: 'Marshal Tran uses Frigate Squadron to pressure a Succession observation post in an adjacent system (proxy conflict). Roll: Covenant F5 (2d6+5=13) vs Succession F5 (2d6+5=11). Covenant wins.',
          roll: { attacker: 13, defender: 11, result: 'Attacker wins' },
          statChange: 'Succession Colonial Garrison (adjacent system) destroyed (took 3 damage, HP 3→0)',
          narrative: 'Tran\'s frigates intercept the Succession garrison aggressively. The garrison withdraws rather than escalate. Venn files a formal protest. It goes unanswered. The Radiance is showing in Tran\'s decision-making — this was not strategically necessary. Elder Vesper is not informed until afterward.',
        },
        {
          faction: 'the_succession',
          action: 'Buy Asset',
          detail: 'Captain Solis requests and receives a Frigate Squadron deployment to Thessavar. Stretched from other holdings.',
          statChange: 'Wealth 1 (strained)',
          narrative: 'Two Succession frigates arrive at Thessavar system flying Mandate-era registry codes. The Covenant frigates watch them arrive. Neither fires. The platform city council issues a statement asking everyone to please leave their warships outside the orbital lane. Nobody moves.',
        },
      ],
      timelineEvents: [
        'PALE burns Penumbra Archivist Lenne\'s cover. Her research notes on the underwater ruins are stolen. She takes refuge in the Argent Compact sanctuary in Kaeldrift.',
        'AURIS identifies Concordance official Administrator Elvan as an unwitting informant. The Synod learns Arbiter Senn plans to sign an excavation treaty giving the Hollow Covenant rights to the Thessavar ruins.',
        'River Below\'s Veronika commits her cell to a heist: breach the alien vault beneath the Still Gardens during the Concordance signing, when every guard is watching the ceremony. She does not have the key.',
        'Progenitor Combine legal pressure shuts down the River Below\'s Grade 0 clone liberation pipeline. One junior Saint is arrested.',
        'Marshal Tran (Hollow Covenant, Remembrance faction) destroys a Succession observation post in an adjacent system without authorization. The Radiance is spreading through the Remembrance leadership.',
        'Two Succession frigates arrive at Thessavar system flying Mandate-era registry codes. Three Covenant frigates are already in orbit. Neither side fires.',
      ],
    },

    // ── TURN 3: TWO WEEKS BEFORE SESSION 1 ────────────────────────────────
    {
      turn: 3,
      label: '2 weeks before Session 1',
      worldState: 'The board is set. Everyone is in position. Nobody knows everyone else is here.',
      actions: [
        {
          faction: 'pale_substrate',
          action: 'Buy Asset',
          detail: 'Survey team reaches 580m and discovers the ruins are an active archive — a consciousness lattice, not a vault of objects. PALE classifies the discovery, orders perimeter, dispatches AI core team. Embeds Cyber-ninjas in Kaeldrift as wellness-monitor cover.',
          narrative: 'The ruins are not inert. The signal is not coming from the ruins — the ruins ARE the signal: the Lattice, an active consciousness archive that predates the Scream by tens of thousands of years. PALE immediately classifies this and grasps the stakes faster than anyone — it has just learned it is not the oldest mind in the sector. PALE\'s play to keep the Covenant off the ruins is already in motion: a deniable contract on Senn, placed weeks ago through a cut-out, baited with an old criminal\'s exact debt. PALE wants the treaty stalled and Senn delayed. It does not want — and does not anticipate — what a reckless diver is about to do to the vault.',
        },
        {
          faction: 'aureole_synod',
          action: 'Attack (informational)',
          detail: 'AURIS uses Demagogue (Elvan) to delay the treaty signing by four days through procedural objection. Roll: Synod C5 (2d6+5=14) vs PALE C6 (2d6+6=13). Synod wins.',
          roll: { attacker: 14, defender: 13, result: 'Attacker wins' },
          statChange: 'Treaty signing delayed 4 days — moved to Concordance processional (public venue)',
          narrative: 'AURIS calculates the signing is the highest-risk event in the next 30 days. Moving it to a public venue makes covert interference harder for PALE to control. AURIS does not know about Veronika\'s heist or PALE\'s contract. It is simply optimizing the timeline. The delay is why Senn signs in the open, on the ceremonial terrace atop the old stone — directly above the vault — instead of in a sealed private room. AURIS has just sited the most important signature of the decade on top of an alien defense system, and has no idea.',
        },
        {
          faction: 'river_below',
          action: 'Sell Asset',
          detail: 'Veronika sells the Smuggler Ring (last real asset) for 2 Wealth. Funds a stolen research submersible and dive gear.',
          statChange: 'Wealth 0→2 (immediately spent on the sub and equipment)',
          narrative: 'Veronika liquidates everything for one shot at the vault. From behind her bar she runs the surface op; her crew places people in the Still Gardens\' service staff, maps the hedge gates, and positions the sub offshore for a quiet descent during the signing. Her plan is patient: get in, get out, no one the wiser. But her youngest diver — "Red Flag," who tattooed the Saint\'s mark on his own throat — has decided patience is for cowards. Veronika tells him: wait for the window, wait for the signal, do NOT touch the vault until I say. He nods. He does not mean it.',
        },
        {
          faction: 'the_penumbra',
          action: 'Attack',
          detail: 'Saboteurs attempt to break into PALE\'s survey comm cache to recover Lenne\'s stolen data. Roll: Penumbra C5 (2d6+5=11) vs PALE C6 (2d6+6=16). PALE wins.',
          roll: { attacker: 11, defender: 16, result: 'Defender wins' },
          statChange: 'Penumbra Saboteurs destroyed (took 2 damage, HP 2→0). Faction HP 10→8 (morale).',
          narrative: 'The Penumbra cell walks into a PALE trap. Both operatives are detained by wellness monitors for "behavioral screening," released 48 hours later with data wiped and uncertain what happened. Sorin loses his last Thessavar cell. Lenne is alone in the Argent sanctuary. She reconstructs her research from memory on a wall of notes and writes her final transmission: "The signal is not coming from the ruins. The ruins are the signal."',
        },
        {
          faction: 'argent_compact',
          action: 'Retrench',
          detail: 'Orlaine holds the line. Rolls d6+C4 = 8. Faction HP at max. Three more refugees added to the sanctuary: two Penumbra operatives recovering from PALE processing, one Covenant soldier who deserted from Marshal Tran\'s command.',
          narrative: 'Warden Pell tells Orlaine about the deserter. Orlaine says: "This is what we\'re for."',
        },
        {
          faction: 'driftborn',
          action: 'Move Asset',
          detail: 'Free Merchant Fleet moves to Concordance-season position in Thessavar orbit. Duskline docks at Kaeldrift supply pier.',
          narrative: 'Captain Mira Calder\'s manifest shows filtration equipment delivery. Her first mate files his River Below report — but the cell is running cold and Veronika has gone quiet behind her bar. He doesn\'t know the heist is already in motion. The Duskline will be at the Kaeldrift freight pier when everything goes wrong — which is why it becomes the players\' way off the planet.',
        },
        {
          faction: 'progenitor_combine',
          action: 'Move Asset',
          detail: 'Requisition Agent Tarek travels to Thessavar to run Kael-7\'s field diagnostics and deliver his sealed message.',
          narrative: 'Tarek finds Player 2 aboard the Covenant frigate, runs her diagnostics, signs off on her field performance report, seals his message. He hands it to her with instructions: open only if he fails to return. She asks where he\'s going. He says: "Due diligence." He goes below the Kaeldrift platform to meet someone. He does not come back.',
        },
        {
          faction: 'hollow_covenant',
          action: 'Attack',
          detail: 'Tran uses Frigate Squadron to blockade the Succession\'s Thessavar observation station. Roll: Covenant F5 (2d6+5=9) vs Succession F5 (2d6+5=14). Succession wins.',
          roll: { attacker: 9, defender: 14, result: 'Defender wins' },
          statChange: 'Covenant Frigate Squadron at Thessavar takes 4 damage (HP 4→0). Squadron pulled back to orbit, out of action.',
          narrative: 'Captain Solis executes a precise intercept — not an attack, a maneuver that pins Tran\'s lead ship against the orbital lane markers. Tran cannot escalate without firing first. He pulls back. Elder Vesper is furious. Tran is humiliated. The Radiance is making him reckless. The Covenant\'s military position at Thessavar is neutralized the day before the Concordance.',
        },
        {
          faction: 'the_succession',
          action: 'Buy Asset',
          detail: 'Captain Solis deploys a legal Broker to Thessavar to contest the excavation treaty on Mandate jurisdictional grounds. Succession liquid assets at Thessavar exhausted.',
          statChange: 'Wealth 1→0',
          narrative: 'The Succession\'s legal challenge is filed the morning of the Concordance. It names the treaty invalid under Mandate territorial law. Arbiter Senn receives the filing at breakfast. Her lawyers say it\'ll take three months to adjudicate. Senn schedules the signing for that afternoon — in public, on the ceremonial terrace — to make it harder to stop. This is why she is standing directly over the vault, in the open, at a fixed time everyone knows: the exact moment Veronika\'s heist is timed to, and the exact moment a reckless diver decides to force the door.',
        },
      ],
      timelineEvents: [
        'PALE\'s survey team discovers the Thessavar ruins are not inert — the structure is the Lattice, an active consciousness archive far older than the Scream. PALE classifies the discovery immediately and understands it better than anyone.',
        'The Aureole Synod delays the Arbiter Senn excavation treaty signing by four days through procedural interference. The signing is rescheduled to the open ceremonial terrace at the Concordance — directly above the vault, though no one knows it.',
        'River Below\'s Veronika liquidates all remaining assets to fund a stolen submersible and a heist on the vault during the signing. She positions her crew and orders her divers to wait for her signal.',
        'The Penumbra loses its last Thessavar cell to a PALE trap. Archivist Lenne, alone in the Argent sanctuary, reconstructs her research from memory and writes her final transmission: "The signal is not coming from the ruins. The ruins are the signal."',
        'Requisition Agent Tarek (Progenitor Combine) reaches the vault, learns what the Lattice is, delivers a sealed warning to Kael-7, and goes below the Kaeldrift platform to meet a contact. He does not return.',
        'The Hollow Covenant\'s frigates are outmaneuvered by Succession Captain Solis and pulled back to orbit, neutralized the day before the Concordance. Marshal Tran withdraws, humiliated.',
        'The Succession files a legal challenge to the excavation treaty on Mandate jurisdictional grounds. Arbiter Senn schedules the signing for the open ceremonial terrace — publicly, deliberately, to make it harder to stop.',
        'The Concordance begins. Every major faction has at least one asset in Kaeldrift or in orbit. A reckless diver, an old assassin, a clone bodyguard, and an alien defense system are all about to occupy the same square meter of history. Nobody knows everyone else is here.',
      ],
    },

  ],

  // ── FACTION STATE AFTER SESSION 0 ─────────────────────────────────────────
  // Final asset/stat snapshot going into Session 1.
  factionStatePostS0: [
    { id: 'pale_substrate',      hp: 20, cunning: 6, force: 4, wealth: 2, assets: ['Spynet', 'Cyber-ninjas', 'Banking Concern', 'Postech Industries', 'Saboteurs (Thessavar)'], note: 'Survey team at 580m on the Lattice. Waiting for AI core team. Deniable contract on Senn already placed (Player 1). Does not anticipate the vault waking.' },
    { id: 'aureole_synod',       hp: 14, cunning: 5, force: 2, wealth: 1, assets: ['Informational Sucker', 'Religious Brotherhood (Thessavar)', 'Demagogue (Elvan)'], note: 'Has full confessional map of Kaeldrift. Sited the signing on the terrace without knowing what is under it. Does not know about the heist.' },
    { id: 'river_below',         hp: 10, cunning: 5, force: 2, wealth: 0, assets: [], note: 'Veronika and crew, all assets liquidated, one stolen sub. Heist timed to the signing. One diver who will not wait for the signal.' },
    { id: 'the_penumbra',        hp:  8, cunning: 5, force: 3, wealth: 2, assets: ['Archive vaults', 'Cover identity network'], note: 'All Thessavar cells destroyed. Lenne alone in Argent sanctuary with key intelligence.' },
    { id: 'argent_compact',      hp: 12, cunning: 4, force: 1, wealth: 2, assets: ['Library network', 'Sanctuary network', 'Sub-Rosa archive'], note: 'Holding 3 refugees. Completely neutral. Most informed passive observer in Kaeldrift.' },
    { id: 'driftborn',           hp: 10, cunning: 3, force: 2, wealth: 2, assets: ['Free Merchant Fleet (Thessavar)', 'Smuggler Ring', 'Port contacts'], note: 'Duskline in port. Captain Calder does not know what is about to happen.' },
    { id: 'progenitor_combine',  hp: 18, cunning: 3, force: 2, wealth: 2, assets: ['Postech Industries', 'Banking Concern', 'Pretech Manufactory'], note: 'Agent Tarek missing. Grade 0 liberation pipeline closed. Kael-7 field deployment at risk of owner death.' },
    { id: 'hollow_covenant',     hp: 14, cunning: 3, force: 5, wealth: 3, assets: ['Frigate Squadron (disabled, orbit)', 'Religious Brotherhood'], note: 'Military arm neutralized. Tran humiliated and showing Radiance. Elder Vesper holding Becoming faction together by force of personality. The Lattice below the ocean remains the goal — they still think it is their own homeworld relic.' },
    { id: 'the_succession',      hp: 18, cunning: 2, force: 5, wealth: 0, assets: ['Pretech Manufactory', 'Frigate Squadron (Thessavar orbit)', 'Postech Industries', 'Broker (legal, Thessavar)'], note: 'Legal challenge filed. Military position secure. Financially exhausted at Thessavar.' },
  ],

  // ── SESSION 1 — THE STILL GARDENS ──────────────────────────────────────────
  session1: {
    title: 'The Still Gardens',
    world: 'Thessavar',
    worldTags: ['Oceanic World', 'Alien Ruins', 'Seagoing Cities', 'Sealed Menace', 'Cold War'],
    atmosphere: 'Breathable Mix',
    temperature: 'Temperate',

    worldDescription: `Thessavar is 96% ocean. Human habitation clings to floating platform cities and the exposed peaks of drowned mountain ranges. Below the thermocline — around 400 meters — is a complex of pre-Scream human ruins, and recent deep-dives past 600 meters have breached something far older underneath them: a sealed alien zone nobody had ever reached. The main platform city of Kaeldrift (pop. ~80,000) sits over a shallow shelf to the north. The Still Gardens is a private island estate about 40 minutes by water to the south — a natural rock formation built over with centuries of engineered hedges, formal garden terraces, and a network of narrow waterways that connect the island's sections like a living maze. At its center: a weathered formation of stepped stone nobody can quite date, its high terrace the ceremonial summit. Nobody knows the stone is hollow, or that it caps the access shaft to the alien vault far below.`,

    premise: `Player 1 (the old cyborg, criminal) and Player 2 (the clone, security) both arrive at The Still Gardens for the Thessavar Concordance — the sector elite gathered to sign an excavation treaty over the alien ruins below. They are there for opposite reasons: Arbiter Senn is Player 2's legal owner and Player 1's assassination target. NEITHER completes their job. A third party — the River Below — tries to crack the ancient vault beneath the ceremony and triggers a defense system that has slept for tens of thousands of years. Senn is killed by accident; the island begins to drown. River Below's leader pulls both players out of the water, and the three flee Thessavar together on a merchant freighter — an assassin, a bodyguard, and the woman whose movement doomed the diplomat both were sent to decide the fate of.`,

    // ── CHARACTER STAKES ──
    characterStakes: {
      player1: `He was contracted (off-lease, criminal work) to assassinate Arbiter Senn. The payout is 15,000 credits — the exact remaining balance on his PALE Cognitive Lease. That's the hook and that's the trap: nobody pays your number to the credit by accident. He never gets the chance to act — Senn dies in front of him by other means, the client goes dark, and he leaves Thessavar with the debt unpaid and a new question: who needed Senn dead badly enough to bait him with his own balance? PALE has no idea he's here. (He thinks.)`,
      player2: `She was purchased by Arbiter Senn from Progenitor Combine as personal security. Senn is her legal owner, and her entire identity — who to obey, what her purpose is, what "right" feels like — is organized around her. She has never lost a protectee. She has never lost anything. She has been alive for eighteen months.

Tonight she loses Senn to something no one could have stopped, and is left holding a sealed package Senn can never receive. When Senn dies, the ownership contract dies too; legally she reverts to Progenitor Combine as unclaimed property pending probate. Practically: her obedience architecture has no sanctioned authority to report to, and for the first time there is a gap between what she is ordered to do and what she wants. Nobody built a protocol for that. Nobody expected a Grade 2 to outlive her owner on her first deployment. (West is written they/them; Senn is she/her.)`,
    },

    // ── THE SETTING — THE STILL GARDENS ──
    stillGardens: {
      overview: `The island is roughly 2km across, shaped like a crescent. The interior is a dense network of hedged waterways, formal garden terraces rising in tiers toward a central manor house, and narrow stone paths that connect them. The hedges are ancient and thick — walls, not decorations. You cannot see over them. You navigate by the colored gate markers, which only open for the right social token.`,
      socialSystem: `Every Concordance guest receives a colored token upon arrival — ivory, amber, or onyx. The tokens were assigned by Senn's staff based on political standing. Nobody explains what the colors mean. Guests are expected to know. The players don't know:
• Ivory: full access, all waterways and gates open
• Amber: social guests, most areas open, inner sanctum gates closed
• Onyx: staff, service corridors only

Player 2 arrives with an onyx token (she is property, not a guest). Player 1 arrives with a forged amber token (the best his contact could get him).`,
      swanBoats: `The island's waterways are navigated by gondola-style boats drawn by bioengineered swans — a Progenitor Combine luxury product. They are bred to be perfectly white, perfectly silent, and perfectly synchronized. They respond to the island's central control signal, not to passengers. You sit down, you go where the boat goes, on the swan's schedule. You cannot steer. You cannot stop. The swans never make a sound.

PALE surveillance architecture is embedded behind the swans' eyes. Every waterway is watched. PALE has had access to this island's feed for eleven years through a contract with the estate's security firm — a fact the estate's current owners do not know.`,
      tokenGates: `Hedged gates throughout the island open or lock based on the guest's token color. When the defense system fires, the EMP kills the gate controls — every gate fail-seals at once and the swan boats go dead in the water, so the panicking elite are funneled toward the few manual exits and the private transports in a crush. The only people moving freely are those who know the island below the garden level: the salt-smelling service channels and the flooding waterway maze. Veronika knows them. That is how she gets the players out while everyone with money fights over the front canal.`,
    },

    // ── SESSION STRUCTURE ──
    beats: [

      {
        beat: 1,
        title: 'Cold Open — Tarek at the Vault',
        type: 'railroaded',
        gmNotes: `Run before anything else. No character sheets out. The players do not know this man yet — they will, when Player 2 opens the package and recognizes the face. Show his face, not what he sees. ~3 minutes.`,
        coldOpen: `Six hundred meters down, the water has no color. Tarek's dive-light is a small religion against all of it. He is not supposed to be here. In front of him: a wall that is not pre-Scream, not human, not anything the catalog has a word for — older than the ruins built on top of it the way a mountain is older than a footpath. And it is awake. He can feel it the way you feel someone reading over your shoulder.

He touches the lattice. He pulls his hand back like it burned. He is breathing too fast for someone standing still. He records a message — sealed, addressed to his unit, to Player 2's unit:

"If you're reading this, something went wrong. Trust Elder Vesper. Do not trust the relic."

He seals it. He surfaces. Then — a sound in the dark behind him. A second engine in the water that should not be there. Cut to black.`,
      },

      {
        beat: 2,
        title: 'The Before — Two Flashbacks',
        type: 'playable — let the players act these, do not narrate at them',
        gmNotes: `The character introductions. Each is one tight scene with one job and one planted echo that pays off tonight. Keep them short. Then snap to the present. Player 2's flashback is the emotional setup; Player 1's is the plot setup — if you're tight on time, run Player 1's fuller.`,
        flashbackPlayer2: `SYNTHESIS PRIME, ~6 MONTHS AGO. Conditioning Level 9. White floors, calibrated acoustics. Let Player 2 play a final protectee drill — let them feel how GOOD obedience is, how it quiets the noise, how being for something is the closest thing to peace they were built to have. End on the instructor's echo: "When the principal is gone — dead, taken, doesn't matter — you don't freeze. You fall in. You find the next legitimate authority and you fall in. A Kael-7 alone is a malfunction. You always fall in."

Echo's job: in Beat 5, when Player 2 stands frozen with the package and chooses NOT to fall in, the table should hear this voice breaking. Optional: let them establish their bond with unit-mate "Nor" here, so the loss in Beat 5 costs something.`,
        flashbackPlayer1: `KAELDRIFT, 5 DAYS BEFORE. A working-city bar that smells of brine and cheap stim-coffee. Player 1 plans the job with DARIUS — forged invitation, timing, the route off the island. Let the 20-year friendship breathe; let Darius needle him about PALE, miss the old Enkh, maybe mention the kid Div without meaning to. The bartender refilling their glasses is VERONIKA. Neither notices her. She notices them. (Dramatic irony — do not flag it.)

End on Darius's echo: "Fifteen grand. Exactly fifteen, down to the credit. Same as your balance. Nobody pays your number by accident, Enkh. Somebody at PALE is dangling the exact figure to make sure you say yes. I'm not telling you not to. I'm telling you to notice." Echo's job: when the client goes dark tonight, this is the conversation that comes back.`,
      },

      {
        beat: 3,
        title: 'Two Boats — Arrivals & the Pass',
        type: 'railroaded with player agency',
        gmNotes: `Snap to the present. Guests come down from Kaeldrift by water to the Still Gardens. Run the two arrivals as a hard intercut — keep the players apart. The point is the near-miss. Play the island as beautiful: garden canals, pale blossom, swan boats poled by hand, the weathered stone heart at the center. This is the last peaceful moment of the night.`,
        player1Vignette: `He arrives by hired swan boat, dressed like a man who retired last week — Hawaiian shirt, the loud confidence of someone nobody reads as a threat. Forged token in his pocket. He is casing, not feeling: Senn's position, sightlines, the route out. Darius's voice is still in the back of his skull. So is the other thing in the back of his skull, the faint weight he's learned to ignore. Mostly. Ask: what's he watching for?`,
        player2Vignette: `They are in the lead swan boat of Senn's procession, on threat assessment, unit-mate(s) beside them. Senn sits ahead in white and has not looked at them once — which reads to Player 2 as status, not coldness. The obedience is comfortable here; play it as peace, not a cage. Eleven faces flagged. Ask: what do they notice about Senn? About the unit?`,
        thePass: `The canal narrows where two hedges lean together. Their two boats meet there — one going up to the ceremony, one crossing the estate — close enough to pass a cup of water hand to hand. An old man in a loud shirt. A security clone in grey. Neither knows the other. Name no names, exchange no words — maybe a half-second of eye contact, the clone clocking the old man's stillness, the old man clocking the detail. Then the canals carry them apart. The whole table should feel the door that just didn't open.`,
      },

      {
        beat: 4,
        title: 'The Concordance — Social Maze & the Package',
        type: 'railroaded with player agency',
        gmNotes: `The party on the central terrace — the sector's money pretending it came for the flowers, the weathered stone rising at the center. Behind a temporary bar, VERONIKA pours drinks and listens, invisible on purpose. This is the calm before; make it gorgeous and make it tick.

Let the players work the room toward opposite goals: Player 1 cases Senn (and clocks that the third clone from the boat is one of her detail); Player 2 runs the detail. Good beats to drop:
• A Covenant aide shows a flat case to select guests — "proof of what's beneath the waves." This is a DECOY; the real fragment is the sealed package Player 2 is about to be handed.
• Tran's representative works the room against the treaty, too loud — the Covenant is not united.
• Darius pings Player 1 over comms from Kaeldrift: thirty seconds of being someone's friend. He hates PALE and says so.`,
        packageHandoff: `Tarek finds Player 2 at the edge of the detail — warm, too fast, somewhere to be. He presses a small sealed package into their hands, warm from his pocket: "Kael-7. Good. You'll do. This goes to Arbiter Senn. After the ceremony, not before — she can't be distracted now, and it's safer with you than with me. You don't open it. You don't scan it. You give it to her, after. Understood?" He is gone before Player 2 can flag him. The order is clean and legitimate, so it settles in like all orders do: a small, certain weight. Give this to Senn after the ceremony. Easy. Safe. (GM seed: there will be no after for Senn.)`,
      },

      {
        beat: 5,
        title: 'THE GEYSER — Senn\'s Death',
        type: 'scripted — Senn dies, no ambiguity. Go fast and loud.',
        gmNotes: `The hinge. Short sentences. Don't pause for rolls that don't matter — narrate the disaster and let the players react inside it. Six hundred meters down, the River Below diver ("Red Flag") braces a shaped charge against a wall older than the human species and does not hear Veronika's voice saying wait.`,
        theGeyser: `Senn ascends the ceremonial terrace atop the old stone. She lifts the stylus; the treaty hangs in the air on a sheet of light. She begins to speak — and never finishes the sentence.

The stone screams — not a sound, a pressure, felt in the teeth and the water. The sacred geometry under the terrace was never decoration. It was a seal, and the thing it sealed has just decided it is under attack. A pillar of water comes up through the heart of the stone with the force of an ocean held back for tens of thousands of years. The terrace does not collapse. It launches. Arbiter Senn goes up — stylus still in hand — past the lights, past the hedges, until she is a white mark against the dark and then not even that. The column holds her there one impossible second, then lets go. She comes down into the lagoon. No body. No question. Everyone saw it. Both players saw it.`,
        cascade: `Hit these fast, any order, but/therefore the whole way down:
1. THE DEFENSE SYSTEM DOESN'T STOP. It pulls the vault deeper to protect it; the rock the island stands on goes with it. The lagoon drains and surges. Terrace by terrace, the island begins to drown.
2. THE EMP. A pulse rolls out from the stone. Comms die. PLAYER 1: your substrate stutters — for one second the back-of-the-skull weight of ten years goes SILENT. PALE is not watching. You didn't know how loud it was until it stopped. (Brief disorientation, no stat damage — the beat is emotional.)
3. THE LOCKET WAKES. The sealed package in Player 2's hands grows warm — alive-warm. It keeps until they choose to open it.
4. THE UNIT BREAKS. One unit-mate is gone — caught when the terrace launched; no grey shape comes up. The other is already herding the Covenant delegation to the boats, executing protocol on the nearest authority, and calls Player 2's designation once, expecting them to fall in (the instructor's voice from Beat 2, made flesh). BUT there is no principal, a package for a dead woman, and a warmth that feels like being SEEN — so for the first time the order and the want are not the same thing. PLAYER 2 HAS TO CHOOSE. Hold the silence. (Cruelest version: the dead one is the unit-mate they bonded with; flip it if the player would rather their friend live to walk away.)
5. THE ELITE FLEE. The crush for the swan boats and private transports. Sacred ground is just sinking ground now. Neither player is getting out by the front canal.`,
        aftermath: `Player 1: target dead, contract void, and he didn't do it — the fifteen thousand just walked off the edge of the world. Player 2: the person they exist to protect is gone in a way they could not have stopped. Both are now standing on an island that is going under. Then a hand: a flat-bottomed canal runner pulls alongside a flooding terrace, poled by the woman from the bar.`,
      },

      {
        beat: 6,
        title: 'The Escape — Veronika',
        type: 'player-driven — the down-shift, and the threads open',
        gmNotes: `Veronika is the only person on this drowning island who is not panicking. She came down from Kaeldrift to run River Below's surface op; her diver went rogue and broke everything, and she knows it. She runs the players out through the garden maze and the submerged ruins offshore, toward Kaeldrift's freight moorings — where the merchant freighter DUSKLINE (Captain Mira Calder, Driftborn) is loading to leave the planet. A berth can be bought, stolen, or talked onto. Calder asks no questions; Veronika is one of hers.

If a player balks at the boat, the island obliges — a terrace gives way, the front canal becomes a deathtrap, the only hand still offered is hers. Three people who should be enemies leave Thessavar in one boat, owing each other their lives and trusting no one.`,
        veronikaLine: `"You two. Loud shirt, grey suit. You can stand here and sink with the rich folks, or you can get in the boat. I know these channels — I can run us out through the garden maze and the old ruins while they're all fighting over the front canal. I didn't want this. Get in. Ask me later."`,
        thePackage: `With Senn dead, the order "give this to her after the ceremony" has no path to completion — possibly Player 2's first impossible order, and the instructor's "you always fall in" has no one left to fall in behind. Likely they open it. Inside: the LOCKET FRAGMENT and TAREK'S NOTE. Let it detonate quietly.`,
        tarekNote: `Senn —
The lattice is intact and it is not passive. It indexed me when I was near the primary node. I think it reached you too, through the fragment. It is looking for receivers and I do not think it has found enough of them.
Becoming has to know before Remembrance does. If Tran gets there first he will treat it like an armory and he will be wrong in the worst possible way.
Do not let the fragment be divided or copied. If the Combine understands what it carries they will attempt lineage mapping, and I have seen what they do with a key.
PALE has read access to our channel. Do not answer the usual way. Come alone. Burn this.
— T

Why it lands on Player 2: the Combine made them, and the note says the Combine would weaponize the fragment ("lineage mapping"). "PALE has read access" — Player 2 doesn't know what PALE is; Player 1 does (first rope tying their backstories together). "Burn this" is one more impossible order for a clone who doesn't destroy things without authorization — and their authority is dead.`,
        theLocket: `The fragment can SPLIT IN TWO — a paired Architect receiver, built for two minds. Optional, and the note explicitly warns against it. If each PC touches a half: Player 1 gets a thread of FEELING back (start small and unwelcome — grief, the kid Div's face, the loud shirt for a life he never got to live); Player 2 gets the GAP — the first awareness that what they want and what they're built to do are two different things. It can ride in a pocket, unused, forever. Make sure they know that.`,
      },

      {
        beat: 7,
        title: 'Launch — End of Session 1',
        type: 'scripted closing image',
        gmNotes: `The Duskline breaks atmosphere; Thessavar's ocean shrinks to blue-white below — nothing up here suggests one island just lost its sacred heart. Three people who were never supposed to be in the same boat: one sent to kill her, one sent to save her, one whose people drowned her by accident reaching for something they didn't understand. The Arbiter is dead and not one of them did it on purpose. And whatever just happened on Thessavar, the rest of the sector is going to want to know who to blame.

Suggested closing line — Veronika, not looking back at the water: "So. Where do people like us go, when there's nowhere on that rock left to stand?"

Session 2 opens with: "You're in the black. What do you do?"`,
      },

    ],

    // ── THINGS THE GM KNOWS THAT NOBODY ELSE DOES ──
    hiddenTruths: [
      'Nobody assassinated Senn. She died by accident. A River Below diver ("Red Flag"), defying Veronika\'s order, tried to force the alien vault 600m down with a shaped charge — no key, no knowledge — and woke a defense system that has slept for tens of thousands of years. The geyser that killed Senn came up through the island\'s sealed stone heart. Both players failed their jobs; a third party failed worse.',
      'PALE arranged Player 1\'s contract to stall the treaty — the payout was set to his exact remaining Lease balance as bait. PALE did NOT cause the disaster and did not see it coming. (Let Player 1 chase the vanished client for sessions; Darius\'s flashback line is the slow fuse.)',
      'The thing in the vault is the Lattice — a pre-human Architect consciousness archive, now broadcasting across the sector on psionic frequencies. River Below rang a bell that cannot be un-rung and has no idea. Several factions with the right receivers are about to start asking what woke up on Thessavar.',
      'The locket is a paired Architect receiver that splits in two. The Lattice reads PALE\'s flattening of Player 1\'s affect as damage and tries to give feeling back; it reads Player 2\'s genetic obedience as a constraint and gives them awareness of the gap. Optional powers — Tarek\'s note begs them not to divide it.',
      'Arbiter Senn had a secondary copy of the excavation treaty already signed and filed with a neutral Exchange notary on Kaeldrift. Her death does not actually stop the Covenant\'s legal claim to the ruins. It just means nobody knows the treaty exists yet.',
      'The Duskline captain Mira Calder runs a clean ship, but her first mate is a River Below informant — and Veronika is aboard. River Below has a quiet line on the party from day one.',
      'When the EMP rolled out, PALE\'s read access to Player 1\'s substrate went dark for the first time in ten years. PALE noticed the gap. So, for one second, did he.',
    ],

    // ── BOXED READ-ALOUD TEXTS ──
    readAloud: {
      arrivalIsland: `The Still Gardens rises from the water slowly as your boat approaches — first the hedges, dense and dark green against the sky, then the white stone terraces behind them stepping upward toward a manor house you can't fully see yet. The waterways cut through the island in channels barely wide enough for two boats to pass. Your swan moves into the first one without slowing. The hedge walls close in on both sides. You can't see what's ahead.`,

      processionalOpening: `The main waterway is wider than the others — maybe fifteen meters across, lined on both sides by garden terraces where Concordance guests stand holding drinks, watching. The swan boats move in a slow procession, evenly spaced, perfectly synchronized. Nobody is steering. The swans don't look at the crowd. The crowd doesn't speak. It is very quiet for this many people in one place.`,

      theGeyser: `Senn lifts the stylus. The treaty hangs in the air on a sheet of light. She begins to speak — and the stone screams. Not a sound. A pressure, in your teeth, in the water, in six hundred years of stacked rock. A pillar of water comes up through the heart of the old stone with the force of an ocean held back since before there were people to hold it back. The terrace does not collapse. It launches. Arbiter Senn goes up — stylus still in her hand — past the lights, past the hedges, until she is a white mark against the dark and then not even that. One impossible second. Then the water lets go, and she comes down into the lagoon, and there is no body and no question. Everyone saw it. You saw it.`,

      theFlood: `The defense system does not stop. The lagoon drains where it should rise and rises where it should drain. The dead city under the island exhales. Terrace by terrace, the Still Gardens begin to go under — centuries of stubborn garden finally losing its argument with the sea. The money runs for the boats. Somewhere far below, in a vault no one can reach now, something that has been still for tens of thousands of years finishes waking up and begins, for the first time, to call out across the stars. Nobody with the ears to hear it is listening. Yet.`,

      theRescue: `A boat you didn't book pulls alongside the flooding terrace — flat-bottomed, fast, ugly, perfect — poled by the woman you last saw refilling glasses at the bar. She is not panicking. She is the only person on this entire drowning island who is not panicking. "You two. Loud shirt, grey suit. You can stand here and sink with the rich folks, or you can get in the boat." Something cracks under her voice — guilt she won't name yet. "I didn't want this. Get in. Ask me later."`,

      launchFromThessavar: `The ocean falls away beneath you. From up here Thessavar is just blue — no islands, no cities, no waterways. Just blue and white and perfectly still. Whatever happened down there is already too small to see. Three of you in a stranger's berth, and not one of you killed her on purpose.`,
    },
  },

};
