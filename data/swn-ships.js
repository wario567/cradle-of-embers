// SWN:Revised starship data — hull types, weapons, defenses, fittings, spike drives.
// Sourced from the free edition. Read by the Fleet / starship registry view.

window.SWN_SHIPS = {
  hulls: [
    { name: 'Strike Fighter', cost: '200k', speed: 5, armor: 5, hp: 8, crew: '1/1', ac: 16, power: 5, mass: 2, hardpoints: 1, cls: 'Fighter' },
    { name: 'Shuttle', cost: '200k', speed: 3, armor: 0, hp: 15, crew: '1/10', ac: 11, power: 3, mass: 5, hardpoints: 1, cls: 'Fighter' },
    { name: 'Free Merchant', cost: '500k', speed: 3, armor: 2, hp: 20, crew: '1/6', ac: 14, power: 10, mass: 15, hardpoints: 2, cls: 'Frigate' },
    { name: 'Patrol Boat', cost: '2.5m', speed: 4, armor: 5, hp: 25, crew: '5/20', ac: 14, power: 15, mass: 10, hardpoints: 4, cls: 'Frigate' },
    { name: 'Corvette', cost: '4m', speed: 2, armor: 10, hp: 40, crew: '10/40', ac: 13, power: 15, mass: 15, hardpoints: 6, cls: 'Frigate' },
    { name: 'Heavy Frigate', cost: '7m', speed: 1, armor: 10, hp: 50, crew: '30/120', ac: 15, power: 25, mass: 20, hardpoints: 8, cls: 'Frigate' },
    { name: 'Bulk Freighter', cost: '5m', speed: 0, armor: 0, hp: 40, crew: '10/40', ac: 11, power: 15, mass: 25, hardpoints: 2, cls: 'Cruiser' },
    { name: 'Fleet Cruiser', cost: '10m', speed: 1, armor: 15, hp: 60, crew: '50/200', ac: 14, power: 50, mass: 30, hardpoints: 10, cls: 'Cruiser' },
    { name: 'Battleship', cost: '50m', speed: 0, armor: 20, hp: 100, crew: '200/1,000', ac: 16, power: 75, mass: 50, hardpoints: 15, cls: 'Capital' },
    { name: 'Carrier', cost: '60m', speed: 0, armor: 10, hp: 75, crew: '300/1,500', ac: 14, power: 50, mass: 100, hardpoints: 4, cls: 'Capital' },
    { name: 'Small Station', cost: '5m', speed: 'N/A', armor: 5, hp: 120, crew: '20/200', ac: 11, power: 50, mass: 40, hardpoints: 10, cls: 'Cruiser' },
    { name: 'Large Station', cost: '40m', speed: 'N/A', armor: 20, hp: 120, crew: '100/1000', ac: 17, power: 125, mass: 75, hardpoints: 30, cls: 'Capital' },
  ],

  weapons: [
    { name: 'Multifocal Laser', dmg: '1d4', power: 5, mass: 1, cls: 'Fighter', tl: 4, qualities: 'AP 20' },
    { name: 'Reaper Battery', dmg: '3d4', power: 4, mass: 1, cls: 'Fighter', tl: 4, qualities: 'Clumsy' },
    { name: 'Fractal Impact Charge', dmg: '2d6', power: 5, mass: 1, cls: 'Fighter', tl: 4, qualities: 'AP 15, Ammo 4' },
    { name: 'Polyspectral MES Beam', dmg: '2d4', power: 5, mass: 1, cls: 'Fighter', tl: 5, qualities: 'AP 25' },
    { name: 'Sandthrower', dmg: '2d4', power: 3, mass: 1, cls: 'Fighter', tl: 4, qualities: 'Flak' },
    { name: 'Flak Emitter Battery', dmg: '2d6', power: 5, mass: 3, cls: 'Frigate', tl: 4, qualities: 'AP 10, Flak' },
    { name: 'Torpedo Launcher', dmg: '3d8', power: 10, mass: 3, cls: 'Frigate', tl: 4, qualities: 'AP 20, Ammo 4' },
    { name: 'Charged Particle Caster', dmg: '3d6', power: 10, mass: 1, cls: 'Frigate', tl: 4, qualities: 'AP 15, Clumsy' },
    { name: 'Plasma Beam', dmg: '3d6', power: 5, mass: 2, cls: 'Frigate', tl: 4, qualities: 'AP 10' },
    { name: 'Mag Spike Array', dmg: '2d6+2', power: 5, mass: 2, cls: 'Frigate', tl: 4, qualities: 'Flak, AP 10, Ammo 5' },
    { name: 'Nuclear Missiles', dmg: 'Special', power: 5, mass: 1, cls: 'Frigate', tl: 4, qualities: 'Ammo 5' },
    { name: 'Spinal Beam Cannon', dmg: '3d10', power: 10, mass: 5, cls: 'Cruiser', tl: 4, qualities: 'AP 15, Clumsy' },
    { name: 'Gravcannon', dmg: '4d6', power: 10, mass: 3, cls: 'Cruiser', tl: 4, qualities: 'AP 20' },
    { name: 'Smart Cloud', dmg: '3d10', power: 10, mass: 3, cls: 'Cruiser', tl: 4, qualities: 'Cloud, Clumsy' },
    { name: 'Vortex Tunnel Inductor', dmg: '3d20', power: 20, mass: 10, cls: 'Capital', tl: 4, qualities: 'AP 20, Clumsy' },
    { name: 'Mass Cannon', dmg: '2d20', power: 10, mass: 5, cls: 'Capital', tl: 4, qualities: 'AP 20, Ammo 4' },
    { name: 'Lightning Charge Mantle', dmg: '1d20', power: 15, mass: 5, cls: 'Capital', tl: 4, qualities: 'AP 5, Cloud' },
    { name: 'Singularity Gun', dmg: '5d20', power: 25, mass: 10, cls: 'Capital', tl: 5, qualities: 'AP 25' },
  ],

  defenses: [
    { name: 'Augmented Plating', power: 0, mass: 1, cls: 'Fighter', effect: '+2 AC, −1 Speed' },
    { name: 'Hardened Polyceramic Overlay', power: 0, mass: 1, cls: 'Fighter', effect: 'Reduces attacker AP by 5' },
    { name: 'Foxer Drones', power: 2, mass: 1, cls: 'Cruiser', effect: '+2 AC for one round when fired (Ammo 5)' },
    { name: 'Burst ECM Generator', power: 2, mass: 1, cls: 'Frigate', effect: 'Negate one successful hit' },
    { name: 'Point Defense Lasers', power: 3, mass: 2, cls: 'Frigate', effect: '+2 AC vs weapons that use ammo' },
    { name: 'Grav Eddy Displacer', power: 5, mass: 2, cls: 'Frigate', effect: '1-in-6 chance any attack misses' },
    { name: 'Planetary Defense Array', power: 4, mass: 2, cls: 'Frigate', effect: 'Anti-impact & anti-nuke surface defenses' },
    { name: 'Ablative Hull Compartments', power: 5, mass: 2, cls: 'Capital', effect: '+1 AC, +20 max HP' },
  ],

  fittings: [
    'Atmospheric Configuration', 'Extended Life Support', 'Fuel Scoops', 'Fuel Bunker',
    'Cargo Space', 'Cargo Lighter', 'Drop Pod', 'Boarding Tubes', 'Armory', "Ship's Locker",
    'Extended Stores', 'Advanced Nav Computer', 'Survey Sensor Array', 'Workshop',
    'Lab', 'Med Bay', 'Smuggler\'s Hold', 'Precognitive Nav Chamber', 'Automation Support',
  ],

  spikeDrives: [
    { rating: 1, desc: 'Drive-1 · 48h to enter a new region. Cheapest spike drive.' },
    { rating: 2, desc: 'Drive-2 · the workhorse of most independent ships.' },
    { rating: 3, desc: 'Drive-3 · favored by warships and serious traders.' },
    { rating: 4, desc: 'Drive-4 · fast couriers and elite military craft.' },
    { rating: 5, desc: 'Drive-5 · rare, expensive long-range capability.' },
    { rating: 6, desc: 'Drive-6 · cutting-edge reach, very few worlds can build it.' },
  ],

  // Pre-built example loadouts (matching the rulebook's stock ships).
  presets: {
    'Free Merchant': { weapons: ['Sandthrower', 'Multifocal Laser'], defenses: [], drive: 1, fittings: ['Atmospheric Configuration', 'Fuel Scoops', 'Fuel Bunker', 'Cargo Space'] },
    'Patrol Boat': { weapons: ['Plasma Beam'], defenses: [], drive: 2, fittings: ['Atmospheric Configuration', 'Extended Stores', 'Boarding Tubes'] },
    'Corvette': { weapons: ['Plasma Beam', 'Plasma Beam', 'Sandthrower'], defenses: ['Hardened Polyceramic Overlay'], drive: 2, fittings: ['Armory', "Ship's Locker", 'Fuel Bunker'] },
    'Strike Fighter': { weapons: ['Reaper Battery'], defenses: [], drive: 1, fittings: ['Atmospheric Configuration'] },
  },
};
