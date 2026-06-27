// SWN psionics data — disciplines & techniques, plus skill lists.
// Equipment/foci/weapons/armor live in swn-equipment.js (window.SWN_EQUIP).
// Classes/backgrounds are defined inline in the character sheet.

window.SWN_PSI = {
  // Non-psychic skills (for skill-check rolling) and psychic skills (for Effort).
  skills: ['Administer', 'Connect', 'Exert', 'Fix', 'Heal', 'Know', 'Lead', 'Notice', 'Perform', 'Pilot', 'Program', 'Punch', 'Shoot', 'Sneak', 'Stab', 'Survive', 'Talk', 'Trade', 'Work'],
  psychicSkills: ['Biopsionics', 'Metapsionics', 'Precognition', 'Telekinesis', 'Telepathy', 'Teleportation'],

  disciplines: [
    { name: 'Biopsionics', core: 'Psychic Succor', desc: 'Healing and biological mastery. Mend wounds, purge toxins, reshape flesh — at the cost of System Strain.',
      techniques: ['Healing Touch — restore HP, adding System Strain to the target.', 'Purge Toxin — neutralize poison or disease in a touched subject.', 'Metabolic Control — slow vitals, resist environment, feign death.', 'Metamorph — reshape your own body; alter features, traits, biology.', 'Steel Body — harden flesh against injury for the scene.', 'Psychic Hardening — shield a mind against telepathic intrusion.'] },
    { name: 'Metapsionics', core: 'Psychic Channel', desc: 'The psionics of psionics — sensing, negating, and amplifying psychic power itself.',
      techniques: ['Psychic Negation — suppress another psychic\'s active power.', 'Concert of Minds — form a gestalt with nearby willing psychics.', 'Psychic Static — blanket an area against psychic detection.', 'Suspended Animation — drop a subject into a deathlike trance.', 'Latent Ability — temporarily borrow a technique you don\'t know.'] },
    { name: 'Precognition', core: 'Oracle', desc: 'Glimpse the threads of fate. Reroll fortune, anticipate danger, pierce deceptions.',
      techniques: ['Sequential Analysis — gain an answer to a yes/no question about the near future.', 'Precognitive Reflexes — reroll a failed hit, save, or skill check.', 'Sap Will — burden a foe with crushing certainty of failure.', 'Terminal Reflection — auto-trigger Oracle when danger looms.', 'Discharge Dissonance — release stored fate as a damaging blast.'] },
    { name: 'Telekinesis', core: 'Telekinetic Manipulation', desc: 'Move matter with the mind — shields, force blades, flight, and crushing grips.',
      techniques: ['Pressure Field — manifest a vacc-suit-equivalent force skin.', 'Telekinetic Armory — conjure a force weapon you wield with TK.', 'Kinetic Aegis — absorb incoming damage with a force barrier.', 'Telekinetic Flight — lift yourself and allies into the air.', 'Crushing Grasp — seize and crush a target in a telekinetic fist.'] },
    { name: 'Telepathy', core: 'Telepathic Contact', desc: 'Touch and turn minds. Read thoughts, push emotions, dominate the weak-willed.',
      techniques: ['Mental Domination — issue a command a contacted mind obeys.', 'Emotional Engineering — shift a subject\'s mood and attitude.', 'Psychic Assault — sear a contacted mind for damage.', 'Telepathic Web — link a group for silent, instant communication.', 'Inception — plant an idea the subject believes is their own.'] },
    { name: 'Teleportation', core: 'Personal Apportation', desc: 'Fold space. Blink across a battlefield, banish objects, sense distant places.',
      techniques: ['Spatial Awareness — perceive the exact layout of your surroundings.', 'Perceptive Dislocation — sense a remote location you\'ve imprinted.', 'Effortless Apportation — short blinks no longer cost Effort.', 'Rip Space — tear a damaging rift at a point you can see.', 'Banishment — hurl a touched object or foe to a distant point.'] },
  ],
};
