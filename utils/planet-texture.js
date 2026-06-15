// Procedural planet texture generation onto an HTMLCanvasElement.
// Produces an equirectangular texture (2:1) suitable for mapping onto a Three.js sphere.
// Biomes: rocky, temperate, ice, molten, toxic, engineered, desert, ocean.

(function () {
  // Simple value-noise with bilinear interp & FBM octaves. Deterministic from seed.
  function makeNoise(seed) {
    // 256-entry permutation seeded by mulberry32.
    let s = seed >>> 0;
    function rand() {
      s = (s + 0x6D2B79F5) >>> 0;
      let r = Math.imul(s ^ (s >>> 15), s | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    }
    const perm = new Uint8Array(512);
    const base = new Uint8Array(256);
    for (let i = 0; i < 256; i++) base[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = base[i]; base[i] = base[j]; base[j] = t;
    }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255];

    function valueAt(x, y) {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const tl = perm[(perm[xi] + yi) & 255] / 255;
      const tr = perm[(perm[(xi + 1) & 255] + yi) & 255] / 255;
      const bl = perm[(perm[xi] + ((yi + 1) & 255)) & 255] / 255;
      const br = perm[(perm[(xi + 1) & 255] + ((yi + 1) & 255)) & 255] / 255;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const a = tl * (1 - u) + tr * u;
      const b = bl * (1 - u) + br * u;
      return a * (1 - v) + b * v;
    }

    function fbm(x, y, octaves = 5, lacunarity = 2.0, gain = 0.5) {
      let amp = 1, freq = 1, sum = 0, norm = 0;
      for (let i = 0; i < octaves; i++) {
        sum += amp * valueAt(x * freq, y * freq);
        norm += amp;
        amp *= gain;
        freq *= lacunarity;
      }
      return sum / norm;
    }

    return { valueAt, fbm };
  }

  // mix two [r,g,b] colors
  function mix(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }

  // Sample a gradient stops array: [[t, [r,g,b]], ...]
  function sampleGradient(stops, t) {
    if (t <= stops[0][0]) return stops[0][1];
    if (t >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
    for (let i = 0; i < stops.length - 1; i++) {
      const [t0, c0] = stops[i];
      const [t1, c1] = stops[i + 1];
      if (t >= t0 && t <= t1) {
        const k = (t - t0) / (t1 - t0);
        return mix(c0, c1, k);
      }
    }
    return stops[stops.length - 1][1];
  }

  const PALETTES = {
    rocky: [
      [0.0, [42, 30, 28]],
      [0.3, [74, 48, 38]],
      [0.55, [120, 78, 58]],
      [0.75, [156, 110, 82]],
      [1.0, [196, 156, 122]],
    ],
    temperate: [
      [0.0, [10, 28, 60]],
      [0.4, [24, 70, 120]],
      [0.5, [40, 110, 150]],
      [0.52, [218, 198, 144]],
      [0.65, [80, 132, 70]],
      [0.85, [50, 96, 50]],
      [1.0, [220, 230, 235]],
    ],
    ice: [
      [0.0, [50, 70, 96]],
      [0.4, [130, 160, 190]],
      [0.7, [200, 220, 240]],
      [1.0, [245, 250, 255]],
    ],
    molten: [
      [0.0, [10, 4, 2]],
      [0.5, [80, 18, 6]],
      [0.75, [200, 60, 12]],
      [0.9, [255, 160, 30]],
      [1.0, [255, 240, 140]],
    ],
    toxic: [
      [0.0, [30, 40, 12]],
      [0.4, [80, 90, 24]],
      [0.7, [150, 170, 40]],
      [1.0, [200, 210, 90]],
    ],
    engineered: [
      [0.0, [20, 40, 30]],
      [0.4, [40, 80, 60]],
      [0.6, [80, 130, 90]],
      [0.8, [200, 180, 90]],
      [1.0, [120, 60, 100]],
    ],
    desert: [
      [0.0, [110, 60, 30]],
      [0.4, [180, 110, 60]],
      [0.7, [220, 170, 90]],
      [1.0, [240, 220, 160]],
    ],
    ocean: [
      [0.0, [8, 18, 50]],
      [0.5, [16, 50, 110]],
      [0.85, [60, 130, 170]],
      [0.95, [200, 200, 160]],
      [1.0, [80, 130, 70]],
    ],
  };

  // Equirectangular sphere texture, with anti-pinching by warping x by latitude.
  function generatePlanetTexture(width, biome, seed) {
    const height = Math.floor(width / 2);
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');
    const img = ctx.createImageData(width, height);
    const data = img.data;

    const noise = makeNoise(seed);
    const palette = PALETTES[biome] || PALETTES.rocky;

    // Pre-compute warp factor across latitude for slight pole compression
    for (let y = 0; y < height; y++) {
      const lat = (y / height) * Math.PI - Math.PI / 2;
      const coslat = Math.cos(lat);
      for (let x = 0; x < width; x++) {
        const lon = (x / width) * Math.PI * 2;
        // Sample at uniform sphere-surface coordinates.
        const nx = Math.cos(lon) * coslat;
        const ny = Math.sin(lon) * coslat;
        const nz = Math.sin(lat);
        // Use 3D-projected 2D noise — sample noise in 2D using projected coords.
        // Convert to noise space:
        const fx = (nx + 1) * 2.5;
        const fy = (ny + 1) * 2.5;
        const fz = (nz + 1) * 2.5;
        // Layered FBMs offset by z to feel 3D-ish.
        let n = noise.fbm(fx + fz * 0.4, fy + fz * 0.3, 5);
        // Continent shaping: emphasize for water-based biomes.
        if (biome === 'temperate' || biome === 'ocean') {
          n = Math.pow(n, 1.3);
        }
        // Detail layer
        const d = noise.fbm(fx * 4 + 10, fy * 4 + 20, 3) * 0.15;
        n = Math.min(1, Math.max(0, n + d - 0.075));
        const c = sampleGradient(palette, n);
        // Polar caps for cold/temperate biomes
        if (biome === 'temperate' || biome === 'ocean') {
          const polar = Math.pow(Math.abs(Math.sin(lat)), 6);
          const ice = [240, 245, 250];
          const mixed = mix(c, ice, Math.min(1, polar));
          const idx = (y * width + x) * 4;
          data[idx] = mixed[0];
          data[idx + 1] = mixed[1];
          data[idx + 2] = mixed[2];
          data[idx + 3] = 255;
        } else {
          const idx = (y * width + x) * 4;
          data[idx] = c[0];
          data[idx + 1] = c[1];
          data[idx + 2] = c[2];
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return cvs;
  }

  // Bumpmap derived from the same noise — used as displacement / normal hint.
  function generateBumpTexture(width, biome, seed) {
    const height = Math.floor(width / 2);
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');
    const img = ctx.createImageData(width, height);
    const data = img.data;
    const noise = makeNoise(seed);
    for (let y = 0; y < height; y++) {
      const lat = (y / height) * Math.PI - Math.PI / 2;
      const coslat = Math.cos(lat);
      for (let x = 0; x < width; x++) {
        const lon = (x / width) * Math.PI * 2;
        const nx = Math.cos(lon) * coslat;
        const ny = Math.sin(lon) * coslat;
        const nz = Math.sin(lat);
        const fx = (nx + 1) * 2.5;
        const fy = (ny + 1) * 2.5;
        const fz = (nz + 1) * 2.5;
        let n = noise.fbm(fx + fz * 0.4, fy + fz * 0.3, 5);
        const v = Math.floor(n * 255);
        const idx = (y * width + x) * 4;
        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cvs;
  }

  // Cloud layer texture (transparent except where clouds form).
  function generateCloudTexture(width, seed) {
    const height = Math.floor(width / 2);
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');
    const img = ctx.createImageData(width, height);
    const data = img.data;
    const noise = makeNoise(seed);
    for (let y = 0; y < height; y++) {
      const lat = (y / height) * Math.PI - Math.PI / 2;
      const coslat = Math.cos(lat);
      for (let x = 0; x < width; x++) {
        const lon = (x / width) * Math.PI * 2;
        const nx = Math.cos(lon) * coslat;
        const ny = Math.sin(lon) * coslat;
        const nz = Math.sin(lat);
        const fx = (nx + 1) * 3.5;
        const fy = (ny + 1) * 3.5;
        const fz = (nz + 1) * 3.5;
        // Streaky banding by stretching x.
        let n = noise.fbm(fx * 1.5, fy * 0.5 + fz * 0.5, 5);
        n = Math.pow(Math.max(0, n - 0.5) * 2, 1.3);
        const idx = (y * width + x) * 4;
        data[idx] = 240;
        data[idx + 1] = 240;
        data[idx + 2] = 245;
        data[idx + 3] = Math.floor(n * 220);
      }
    }
    ctx.putImageData(img, 0, 0);
    return cvs;
  }

  window.generatePlanetTexture = generatePlanetTexture;
  window.generateBumpTexture = generateBumpTexture;
  window.generateCloudTexture = generateCloudTexture;
  window.PLANET_PALETTES = PALETTES;
})();
