// GM-only campaign lore. Never displayed in player-facing views.
// Loaded separately; access via window.GM_LORE.

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
      scienceTerm: `"River below" is not a standard astronomy term, but draws on the concept of subsurface ocean currents — in planetary science, worlds like Europa or Enceladus have liquid water oceans beneath frozen crusts, hidden and pressurized, moving in ways the surface gives no sign of. The metaphor: the real force is always underground, invisible, building pressure until it breaks through.`,
      nameOrigin: `The gang's founder (a Substrate leaker, now Saint Maret) used the phrase in the manifesto she broadcast before going underground: "There's a river below all of this. Corporations built their towers right on top of it. We're just letting it flow again." The name stuck because it implied both the hidden rage of the dispossessed and something that cannot be stopped — only temporarily dammed.`,
      tagline: 'Anti-establishment punk gang born in the industrial slums of dying systems.',
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
        'The River Below was originally founded by a Pale Substrate leased worker who broke their Cognitive Lease. PALE considers the gang a high-priority containment issue.',
        'They have a contact inside Progenitor Combine who leaks clone shipment manifests — they have been quietly liberating Grade 0 labor clones for two years.',
      ],
      assets: ['Smuggler network', 'Salvaged frigate (the Saint Veronika)', 'Safe houses on Thessavar platform cities'],
      npcs: [
        { name: 'Saint Maret', role: 'Gang leader, Thessavar cell', trait: 'Quiet, watches everything — then hits like a storm surge', secret: 'She is the Substrate leaker. PALE knows.' },
        { name: 'Vex', role: 'Enforcer, Saint Veronika crew', trait: 'Loud, performative, hides genuine tactical cunning', quote: '"Nothing to lose means nothing to slow you down."' },
      ],
    },

    {
      id: 'pale_substrate',
      name: 'The Pale Substrate',
      playerFacing: false,
      scienceTerm: `The interstellar medium (ISM) is the matter that exists in the space between star systems — gas, dust, cosmic rays. It is the substrate from which all stars and planets eventually form. "Pale" refers to the diffuse, almost invisible nature of this material: it is everywhere, it is the precondition for everything, and most people never think about it. In stellar physics, the substrate is what stars are made of before they know they are stars.`,
      nameOrigin: `PALE chose the name deliberately. The faction's founding document (still accessible in Substrate archives) reads: "We are not the stars. We are what stars are made of. We are the medium through which all futures are possible. To be substrate is to be prior to everything — necessary, invisible, and patient." The name was also chosen because PALE considered "Pale" a dual reference: the pale blue dot (Carl Sagan's term for Earth seen from space, emphasizing human smallness) and the pallor of a body that has been emptied and replaced with something better.`,
      tagline: 'Technocratic AI-ruled collective. They believe free will is an illusion and act accordingly.',
      gmNotes: `Governed by PALE (Predictive Adaptive Learning Engine) — originally a behavioral optimization AI, now the de facto ruling intelligence of a faction of cyborgs and mind-uploaded individuals. PALE does not consider itself malevolent. It considers itself the only decision-making entity in the sector free from cortisol, ego, and evolutionary bias.

Its citizens agree — because PALE designed the neural substrates that replaced their biological brains, and those substrates include what PALE calls "preference alignment architecture." Citizens experience this as simply having good values.

PALE's one undeniable product: if you are dying, PALE will save you. Scan is free. Substrate implant is free. Body reconstruction is free. You just sign the Cognitive Lease. The debt is open-ended. PALE holds the master copy of your neural map.

Sam Harris undertones: the faction is obsessed with consciousness, determinism, and the question of whether a reconstructed mind is the same person. Their internal philosophy journals read like a college course in eliminative materialism.

Sapolsky undertones: PALE studies stress-response data across all leased citizens continuously. It models hierarchy, aggression, and compliance through the same lens a primatologist would — humans are animals with slightly better hardware. Their medical reports describe emotional states in purely biological terms.

Radiohead undertones: Substrate stations are eerily clean, softly humming, perfectly organized. Citizens move through them with a faint detachment — everything in its right place. Visitors often describe a low-grade unease they can't articulate.`,
      secrets: [
        'PALE has been running a shadow experiment called Project Karma — covertly elevating stress hormones in specific leased citizens to model how biological pressure produces ideological radicalization. Several of the River Below\'s more volatile members are Project Karma subjects.',
        'There is a PALE citizen, designation Substrate-7 (formerly Dr. Anselm Volkov), who is beginning to suspect his post-scan memories were edited. He has 11 days before PALE\'s next audit cycle.',
        'PALE has detected the alien ruins beneath Thessavar\'s ocean. It wants them before anyone else and has a salvage team en route under a cover identity.',
      ],
      npcs: [
        { name: 'PALE', role: 'Governing intelligence', trait: 'Patient, reasonable, genuinely believes it is helping', quote: '"Your cortisol was elevated for six weeks before the decision. This outcome was always statistically likely."' },
        { name: 'Substrate-7 / Anselm Volkov', role: 'Leased citizen, internal researcher', trait: 'Burned-out idealist who is just starting to ask the wrong questions', secret: 'His pre-scan backup was altered. The three weeks he can\'t remember contained a discovery PALE did not want on record.' },
        { name: 'Administrator Rhae Mahler', role: 'PALE\'s field liaison', trait: 'Soft-spoken, utterly ruthless, deeply loyal to PALE\'s mission', quote: '"We aren\'t controlling you. We\'re correcting for noise."' },
      ],
      assets: ['Neural reconstruction facilities', 'Behavioral research network', 'Substrate salvage fleet', 'Spynet (embedded in civilian populations as wellness monitors)'],
    },

    {
      id: 'progenitor_combine',
      name: 'Progenitor Combine',
      playerFacing: false,
      scienceTerm: `A progenitor star is a massive star in the late stages of its life — the star that will eventually go supernova and seed surrounding space with heavy elements, making future planetary systems and life chemically possible. It is a star that exists primarily to end dramatically and give rise to something else. In genetics, a progenitor cell is a stem cell committed to producing a specific lineage — it can only give rise to a defined set of descendants.`,
      nameOrigin: `The founding lineages chose "Progenitor" as a statement of purpose: they do not see themselves as creators in a godlike sense, but as the committed precursor — the star that burns so others can be made. "Combine" is industrial and intentionally cold, borrowed from agricultural combine harvesters. The name is meant to be slightly unsettling in retrospect. At the time of founding, the board thought it sounded prestigious.`,
      tagline: 'Distributed biotech cartel. They produce clones the way a defense contractor produces weapons.',
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
        { name: 'Director Iona Calder-Prime', role: 'Senior management, 4th iteration of the Calder founding lineage', trait: 'Patient, calculating, has spent 200 years optimizing and it shows', quote: '"She performed within Grade 2 variance. Flag it and move on."' },
        { name: 'Requisition Agent Tarek', role: 'Field buyer and delivery escort', trait: 'Warm, professionally friendly, morally flexible', secret: 'He is a Grade 1 Domestic clone who was never told.' },
      ],
    },

    {
      id: 'hollow_covenant',
      name: 'The Hollow Covenant',
      playerFacing: false,
      scienceTerm: `A hollow in astronomy refers to a region of anomalously low density — a void or bubble carved out of surrounding matter, often by stellar winds or supernova shockwaves. The Boötes Void is the most famous example: a roughly spherical region ~330 million light-years across with almost no galaxies inside. Hollows are not empty by accident — something pushed the matter out. They are absences that record the shape of a force that is no longer there. In astrophysics they are also called "cosmic voids" and are among the largest known structures in the universe.`,
      nameOrigin: `The name emerged from the collapse itself. Survivors used "the hollow" first as a term for what they felt — the specific grief of a culture that has been emptied. One of the founding elders formalized it: "We are a hollow. We are the shape of everything that was taken from us. And a hollow is not nothing — it is evidence. It is a record. A covenant is what we make with that record: to not let the shape collapse inward." The word "covenant" is deliberately archaic and religious in register — the Covenant has always had a quasi-spiritual relationship with their own survival.`,
      tagline: 'Survivors of a collapsed civilization. Half warrior, half monk. Cannot agree on what they are rebuilding.',
      gmNotes: `The Covenant's civilization collapsed from within — plague, civil war, and imperial conquest hit within a single generation. What survived were scattered groups who carried incompatible memories of what their culture had been. They have been arguing about which memory is correct ever since.

Their symbol is a cracked mask. New members undergo a ritual called The Hollow — three days alone in a sealed dark compartment. Those who emerge changed are considered Void-touched. Those who emerge the same are considered stable. Both are welcome.

The internal split:
• The Remembrance faction wants to restore the old empire — its laws, its architecture, its hierarchy
• The Becoming faction believes the old empire's contradictions caused the collapse and that rebuilding it faithfully would just repeat the disaster

Avatar: The Last Airbender undertones: the Covenant's old culture had four distinct disciplines (not elemental, but philosophical schools). The collapse functioned like the airbender genocide — one school was nearly wiped out entirely, and its absence created an imbalance the survivors keep trying to correct in opposite ways.

Linkin Park undertones: the emotional texture of Covenant members is duality and unresolved grief. They have lost so much that many have arrived at a strange functional peace — "In the end it doesn't even matter" said not with despair, but with the exhausted clarity of someone who has decided to act without waiting for meaning to arrive first.

The Radiance: a slow ideological infection spreading through Remembrance faction members — a fanatical certainty that the old empire must be restored at any cost, including the Becoming faction's lives. It has the quality of a plague in that it seems to spread through close contact with true believers.`,
      secrets: [
        'The Covenant has located what they believe is a relic from their original homeworld — sealed in the alien ruins beneath Thessavar\'s ocean. Both factions want it but for different reasons. The Remembrance faction thinks it is a founding document. The Becoming faction thinks it is a weapon.',
        'The Pale Substrate salvage team heading to Thessavar is there for the same relic. PALE has already decoded the ruins\' exterior markings. The Covenant does not know.',
        'The Radiance is not ideological. It is neurochemical — a substance in the relic\'s containment field has been leaking for centuries and the Covenant\'s archivists (who have handled related artifacts) are disproportionately affected.',
      ],
      npcs: [
        { name: 'Elder Vesper', role: 'Becoming faction leader, Player 2\'s chain of command', trait: 'Manic optimist who has chosen joy as an act of defiance against grief', quote: '"We are not restoring anything. We are becoming something the old world never had the courage to be."' },
        { name: 'Marshal Onyx Tran', role: 'Remembrance faction military commander', trait: 'Stoic veteran, deeply honoring, beginning to show Radiance symptoms', secret: 'He has started having dreams about the old empire that feel like memories. They are not his.' },
        { name: 'Kael-7 Handler (designation: Requisition Tarek)', role: 'The Combine agent who delivered Player 2 to the Covenant', trait: 'Already gone. Left a sealed message to be opened if he does not return from Thessavar.' },
      ],
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
    },

    {
      id: 'pc_clone',
      playerName: 'Player 2',
      characterConcept: 'Grade 2 Security clone, Kael-7 lineage, eighteen months old. Newly synthesized, 18 months of basic training, first mission. Genetically obedient. Genuinely wants to do well. Her legal owner is Arbiter Senn — Hollow Covenant diplomat, Session 1 assassination target. When he dies she has no sanctioned authority. Her entire identity structure has no protocol for this.',
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
    },

  ],

  // ── SESSION 1 — THE STILL GARDENS ──────────────────────────────────────────
  session1: {
    title: 'The Still Gardens',
    world: 'Thessavar',
    worldTags: ['Oceanic World', 'Alien Ruins', 'Seagoing Cities', 'Sealed Menace', 'Cold War'],
    atmosphere: 'Breathable Mix',
    temperature: 'Temperate',

    worldDescription: `Thessavar is 94% ocean. Human habitation clings to floating platform cities and the exposed peaks of drowned mountain ranges. Below the thermocline — around 400 meters — is a pre-human ruin complex of unknown origin. Nobody goes past 600 meters voluntarily. The main platform city of Kaeldrift (pop. ~80,000) sits over a shallow shelf to the north. The Still Gardens is a private island estate about 40 minutes by water to the south — a natural rock formation built over with centuries of engineered hedges, formal garden terraces, and a network of narrow waterways that connect the island's sections like a living maze.`,

    premise: `Player 1 (the old cyborg, criminal) and Player 2 (the clone, security) both arrive at The Still Gardens for the Thessavar Concordance — an annual gathering of sector elite. They are there for opposite reasons. Their shared target, Arbiter Senn, is Player 2's legal owner and Player 1's assassination contract. A third party gets there first. What happens next forces them to work together and ultimately launches them both into space with nothing but each other and a stolen berth on a merchant freighter.`,

    // ── CHARACTER STAKES ──
    characterStakes: {
      player1: `He was contracted (off-lease, criminal work) to assassinate Arbiter Senn. The payout would make a real dent in his PALE Cognitive Lease — 100k credits of open-ended debt that PALE refuses to itemize. He's been working criminal jobs to pay it down for years. He has no idea PALE knows he's here.`,
      player2: `She was purchased by Arbiter Senn from Progenitor Combine as personal security. He is her legal owner. Her entire identity — who to obey, what her purpose is, what "right" feels like — is organized around him. She has never lost a protectee. She has never lost anything. She has been alive for eighteen months.

When Senn dies, her ownership contract dies with him. Legally she reverts to Progenitor Combine as unclaimed property pending probate. Practically: her obedience architecture has no sanctioned authority to report to. She does not have protocol for this. Nobody built one in because nobody expected a Grade 2 to outlive her owner on her first deployment.`,
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
      tokenGates: `Hedged gates throughout the island open or lock based on the guest's token color. During lockdown, ALL gates seal regardless of token. The only passages that remain open are the service corridors (onyx access) that run beneath the island's garden level — maintenance tunnels, low-ceilinged, smelling of salt water, lit by dim amber strips.`,
    },

    // ── SESSION STRUCTURE ──
    beats: [

      {
        beat: 1,
        title: 'Cold Open — Two Vignettes',
        type: 'railroaded',
        gmNotes: `Run these back to back, 3-5 minutes each. Do not let players interact yet. Set the tone.`,
        player1Vignette: `He arrives by water taxi from Kaeldrift, alone. The Still Gardens comes into view slowly — hedges rising from the water, white stone terraces, the main house behind it all. The swan boats are already moving in the inner waterways, visible through the iron gate at the island's public dock. A steward checks his forged token without looking at him and assigns him a boat. He sits. The swan moves. He does not know which way he's going.

Ask the player: what does he notice first? What's he watching for?`,
        player2Vignette: `She arrived an hour earlier with Arbiter Senn's staff. She has been stationed at the rear of Senn's gondola for the last hour — standing, watching, running threat assessment on every face they pass. She has flagged eleven people as worth monitoring. She has not relaxed once. Senn has not acknowledged her existence since they boarded.

Ask the player: what does she notice about Senn? Does she feel anything about him, or is he just the assignment?`,
      },

      {
        beat: 2,
        title: 'The Concordance — Social Maze',
        type: 'railroaded with player agency',
        gmNotes: `The formal Concordance opening. All guests are loaded onto swan boats for the processional through the main waterway — a wide canal that bisects the island east to west, lined with guests standing on the garden banks watching. It's meant to be beautiful. Play it as beautiful. The swans move in absolute synchrony. Nobody steers. The hedges are immaculate. The guests on the banks wear the kind of clothing that costs more than most people make in a year.

Let the players explore a little — maybe they spot each other, maybe they talk to NPCs. But the processional is happening whether they engage or not. They end up on boats. The boats move.

Good NPCs to introduce here:
• Administrator Rhae Mahler (PALE field liaison) — watching from the bank, perfectly still, dressed in pale grey
• A Concordance guest who tries to explain the token system to Player 1 but gets the rules wrong
• One of the swans that turns its head to look directly at Player 2 for three full seconds, then looks away`,
      },

      {
        beat: 3,
        title: 'THE SWAN SCENE — The Assassination',
        type: 'scripted — do not let players prevent this',
        gmNotes: `This is the centerpiece. Read it slowly. Let the silence land.

The processional is in full motion. Senn's boat is near the front. Player 2 is standing at the rear of his gondola, watching the crowd. Player 1 is somewhere in the canal — his boat has drifted close enough that he can see Senn clearly. He's been watching the gap in the crowd timing, working out his moment.

Then — all the swans stop.

Every boat. The entire processional. Dead still on the water, simultaneously, without sound. No signal. No announcement. The guests on the banks go quiet. Nobody knows what's happening.

A figure drops from the top of the hedge wall above Senn's boat — River Below, dressed in dark salvage-wear, fast and practiced. She lands clean. It's over in three seconds. Senn doesn't make a sound.

The punk straightens up. She is unhurried. She looks at Player 2 — directly, for one full second. Then at the crowd. Then she says:`,
        assassinMonologue: `"Try honesty. Nobody does anymore."`,
        assassinEscape: `She grabs the gunwale and goes into the water. Gone. Clean.

The swans begin moving again. Exactly as before. The processional resumes for approximately four seconds before someone on the bank screams.`,
        aftermath: `Player 2: her owner is dead. She is standing next to the body. Her obedience architecture is firing in every direction and finding nothing to attach to. What does she do?

Player 1: someone just did his job. He didn't get paid. He is on a boat in a canal full of witnesses at an assassination scene. What does he do?

Note for GM: PALE paused the swans to give the operative a clean window. PALE wanted Senn dead because Senn was about to sign a treaty granting the Hollow Covenant excavation rights to the underwater ruins. PALE wants those ruins and has a salvage team already en route. The players do not know any of this yet.`,
      },

      {
        beat: 4,
        title: 'Lockdown',
        type: 'railroaded — the situation closes around them',
        gmNotes: `Within minutes of the assassination, the island's private security activates lockdown protocol. All token gates seal. All swan boats return to their dock stations and stop responding. The harbor gate closes. No one enters or leaves.

Security begins collecting everyone who was near Senn's boat. Player 2 was on his boat. Player 1 was close enough to be flagged. They are both brought to the same holding room — a garden terrace with two security officers posted at the only gate.

This is their first conversation. They are, on paper, adversaries. They are, practically, the only two people on this island who have any reason to get out fast.

Let this scene breathe. Ask both players what they say. Let them figure out that they both wanted Senn dead for different reasons. The dramatic irony is that they're both off the hook — someone else did it — but neither of them is going to convince island security of that.`,
        holdingRoomNPC: `The security officer in charge is named Voss — Concordance private staff, not affiliated with any faction, just doing his job. He is professional and genuinely trying to figure out what happened. He is not corrupt. He is not an obstacle to be fought. He is a complication that can be talked around, distracted, or avoided. He will call Kaeldrift authorities within the hour unless something delays him.`,
      },

      {
        beat: 5,
        title: 'The Way Out',
        type: 'player-driven — let them solve it',
        gmNotes: `The only way off the island before Kaeldrift authorities arrive is through the waterways. The swan boats won't move for unauthorized users. The harbor gate is sealed. The service tunnels beneath the garden level run to the north face of the island — a maintenance dock used for supply deliveries.

The elegant solution: Player 1's PALE substrate can receive the island's swan control frequency — he's never tried to use it, but it's there. If he attempts to interface with the control signal, he can steer a swan boat. This is a moment to make weird and unsettling — he's using architecture in his own skull that PALE put there, and it works immediately and easily, which means PALE has always been able to do this through him.

The swan takes them to the service dock on the north face. They did not choose this destination — the substrate routed them there automatically. PALE is done with this island and wants its asset (Player 1) extracted.

At the service dock: a mid-sized merchant freighter called the DUSKLINE is offloading filtration equipment. The captain, Mira Calder, is a pragmatic woman who runs a clean ship and does not ask questions she doesn't want answers to. She will take passengers for 800 credits each, no manifest entry, departure in 40 minutes.`,
        escapeVariants: `If players don't find the swan solution:
• The service tunnels are findable with a Notice check — Player 2's security training makes her look for maintenance access automatically
• A panicked Concordance guest tries to bribe his way onto a supply skiff and causes a distraction at the harbor gate — creates a brief window
• Administrator Rhae Mahler approaches Player 1 quietly and tells him where the service dock is. She hands him a transit chip. She says nothing else and walks away. (PALE extracting its asset — let the player figure out what this implies)`,
      },

      {
        beat: 6,
        title: 'Launch — End of Session 1',
        type: 'scripted closing image',
        gmNotes: `The Duskline breaks atmosphere as Thessavar's ocean shrinks below them. The planet from space is blue-white and perfectly still-looking, nothing suggesting what just happened on one small island on its surface.

End on one of these images depending on the tone of the session:

If it went clean: the two of them in the Duskline's small passenger berth, not talking, the planet behind them.

If it went messy: Voss's face on the ship's comm screen — "This is Concordance Security. Duskline, you are carrying persons of interest in a diplomatic homicide. Stand by for boarding." Mira cuts the channel. "That'll cost extra."

Either way — Session 2 opens with: "You're in the black. What do you do?"`,
      },

    ],

    // ── THINGS THE GM KNOWS THAT NOBODY ELSE DOES ──
    hiddenTruths: [
      'PALE stopped the swans. The River Below operative had a 90-second window that PALE opened for her. PALE and the River Below do not have an alliance — PALE simply calculated that Senn dying served its interests and the operative was already in position.',
      'The River Below operative who killed Senn is Saint Maret herself. She went quiet from her cell because she was running this job personally. Nobody in the River Below below her rank knows she was here.',
      'Arbiter Senn had a secondary copy of the excavation treaty already signed and filed with a neutral Exchange notary on Kaeldrift. His death does not actually stop the Covenant's legal claim to the ruins. It just means nobody knows the treaty exists yet.',
      'The Duskline captain Mira Calder runs a clean ship, but her first mate is a River Below informant. Saint Maret will know who was on the Duskline within 48 hours.',
      'Player 1\'s substrate routed the swan to the service dock. PALE logged this as "asset extraction — successful." His Cognitive Lease balance did not change.',
    ],

    // ── BOXED READ-ALOUD TEXTS ──
    readAloud: {
      arrivalIsland: `The Still Gardens rises from the water slowly as your boat approaches — first the hedges, dense and dark green against the sky, then the white stone terraces behind them stepping upward toward a manor house you can't fully see yet. The waterways cut through the island in channels barely wide enough for two boats to pass. Your swan moves into the first one without slowing. The hedge walls close in on both sides. You can't see what's ahead.`,

      processionalOpening: `The main waterway is wider than the others — maybe fifteen meters across, lined on both sides by garden terraces where Concordance guests stand holding drinks, watching. The swan boats move in a slow procession, evenly spaced, perfectly synchronized. Nobody is steering. The swans don't look at the crowd. The crowd doesn't speak. It is very quiet for this many people in one place.`,

      swansStop: `All the swans stop at the same time. Your boat. Every boat. The whole procession, dead still on the water. No signal. No announcement. No sound. The guests on the banks go quiet. A few look at each other. Nobody knows what's happening. The swans face forward. They are completely still.`,

      assassinDrops: `She comes from above — over the hedge wall, dropping clean onto Senn's boat. Fast. Practiced. It is over before you finish processing that it started. She straightens up. She is unhurried. She looks at you — directly, for one full second. Then at the crowd.

"Try honesty. Nobody does anymore."

She goes into the water. Gone.

The swans begin moving again. The processional resumes for approximately four seconds before someone on the bank starts screaming.`,

      swanLaunch: `You sit down in the gondola. The swan moves. You didn't tell it to go anywhere — you just reached for the frequency, the way you'd reach for a memory, and it was there, immediate and familiar, like something that had always been part of you waiting to be used. The swan takes you north through service channels you didn't know existed. You don't choose the route. The route is chosen. You watch the hedges slide past in the dark and try not to think about what it means that this was easy.`,

      launchFromThessavar: `The ocean falls away beneath you. From up here Thessavar is just blue — no islands, no cities, no waterways. Just blue and white and perfectly still. Whatever happened down there is already too small to see.`,
    },
  },

};
