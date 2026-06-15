// Seeded RNG (mulberry32) — deterministic, reproducible sectors.
// Usage: const r = makeRNG('seed-string'); r.float(); r.int(1,6); r.pick(arr);

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRNG(seed) {
  const s = typeof seed === 'number' ? seed : hashString(String(seed));
  const next = mulberry32(s);
  const api = {
    float: () => next(),
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    picks: (arr, n) => {
      const copy = [...arr];
      const out = [];
      for (let i = 0; i < n && copy.length; i++) {
        out.push(copy.splice(Math.floor(next() * copy.length), 1)[0]);
      }
      return out;
    },
    weighted: (entries) => {
      // entries: [[item, weight], ...]
      const total = entries.reduce((s, [, w]) => s + w, 0);
      let r = next() * total;
      for (const [item, w] of entries) {
        r -= w;
        if (r <= 0) return item;
      }
      return entries[entries.length - 1][0];
    },
    chance: (p) => next() < p,
    roll: (n, sides) => {
      let total = 0;
      for (let i = 0; i < n; i++) total += Math.floor(next() * sides) + 1;
      return total;
    },
    fork: (label) => makeRNG(s + '::' + label),
  };
  return api;
}

window.makeRNG = makeRNG;
window.hashString = hashString;
