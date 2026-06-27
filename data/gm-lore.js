// GM-only campaign lore. Never displayed in player-facing views.
// Loaded separately; access via window.GM_LORE.

window.GM_LORE = {

  // ── SECTOR OVERVIEW ────────────────────────────────────────────────────────
  sector: {
    name: 'The Cradle',
    overview: `The Cradle sector was born from a catastrophic stellar nursery event called the Cradle Ignition — a wave of simultaneous star formation that seeded dozens of systems within a few thousand years of each other. Every faction in the sector carries a theory about what the Ignition means and who gets to shape what rises from the stardust. The sector is young by astronomical standards. The wounds are fresh.`,
    theme: 'Genesis, stardust, competing visions of what gets to be born from chaos.',
  },

  // ── FACTIONS ───────────────────────────────────────────────────────────────
  factions: [

    {
      id: 'river_below',
      name: 'The River Below',
      playerFacing: false,
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
      characterConcept: 'Grade 2 Security clone, Kael-7 lineage, eighteen months old. Newly synthesized, 18 months of basic training, first mission. Genetically obedient. Genuinely wants to do well.',
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

  // ── STARTING ADVENTURE — THESSAVAR ─────────────────────────────────────────
  openingAdventure: {
    world: 'Thessavar',
    worldTags: ['Oceanic World', 'Alien Ruins', 'Seagoing Cities', 'Sealed Menace', 'Cold War'],
    atmosphere: 'Breathable Mix',
    temperature: 'Temperate',
    description: `Thessavar is 94% ocean. Human habitation clings to floating platform cities and the exposed peaks of drowned mountain ranges. Below the thermocline — around 400 meters — is a pre-human ruin complex of unknown origin. Nobody goes past 600 meters voluntarily. The platform city of Kaeldrift is the main settlement, population ~80,000, built on six interlocked hexagonal platforms over a shallow shelf.`,
    gmNotes: `All four factions have reason to be here simultaneously:
• The Hollow Covenant sent a small team (including Player 2) to retrieve what they believe is a founding relic
• The Pale Substrate sent a salvage team under cover as marine surveyors
• The River Below is here for a Substrate shipment passing through Kaeldrift port — and Saint Maret has just gone quiet
• Player 1 is here because PALE sent him to oversee the "survey team" and he knows it is not a survey

The cold war between Covenant factions is playing out in the background — Remembrance and Becoming operatives are watching each other on Kaeldrift. Player 2 is caught in the middle.`,
    coolScene: `[PLACEHOLDER — fill in the GM's cool scene idea here]`,
    openingHook: `The party arrives on Kaeldrift separately. Within the first hour: a body is pulled from the water by the platform's maintenance drones. It is not human. It is not the alien species from the ruins. Nobody has seen its like before. The platform's harbormaster locks down incoming and outgoing traffic "pending investigation." Everyone who came to Thessavar for something is now stuck here together.`,
  },

};
