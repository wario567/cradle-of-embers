// Multiplayer sync via PocketBase.
// Replaces Firebase but keeps the same window.MP API surface.
// One PocketBase record per campaign (collection: "campaigns", id: seed).
// Presence stored as records in "presence" collection.

(function () {
  const PB_URL = 'http://129.153.115.84:8090';

  let pb = null;
  let userId = null;
  let unsubscribeFns = [];

  function ready() {
    return typeof PocketBase !== 'undefined';
  }

  async function init() {
    if (pb) return { userId };
    if (!ready()) throw new Error('PocketBase SDK not loaded');
    pb = new PocketBase(PB_URL);
    // Use stored anonymous identity or generate one
    userId = localStorage.getItem('mp-user-id');
    if (!userId) {
      userId = 'u-' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('mp-user-id', userId);
    }
    return { userId };
  }

  // Subscribe to campaign record changes. Returns unsubscribe fn.
  function subscribeCampaign(seed, onSnapshot) {
    if (!pb) return () => {};
    const recordId = seedToId(seed);

    // Fetch initial state
    pb.collection('campaigns').getOne(recordId).then(rec => {
      onSnapshot(rec.data);
    }).catch(() => onSnapshot(null));

    // Realtime updates
    pb.collection('campaigns').subscribe(recordId, e => {
      if (e.record) onSnapshot(e.record.data);
    }).catch(err => console.warn('[mp] subscribe error', err));

    return () => pb.collection('campaigns').unsubscribe(recordId);
  }

  // Save campaign state. Last-write-wins via upsert.
  async function saveCampaign(seed, state, userName) {
    if (!pb) return;
    const recordId = seedToId(seed);
    const payload = {
      seed,
      data: state,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: userName || userId || 'anon',
    };
    try {
      await pb.collection('campaigns').update(recordId, payload);
    } catch (e) {
      if (e?.status === 404) {
        try {
          await pb.collection('campaigns').create({ id: recordId, ...payload });
        } catch (e2) {
          console.warn('[mp] save error', e2);
        }
      } else {
        console.warn('[mp] save error', e);
      }
    }
  }

  // Presence heartbeat
  function startPresence(seed, name, color) {
    if (!pb) return () => {};
    const presenceId = seedToId(seed + '-' + userId);
    const payload = {
      seed,
      userId,
      name: name || 'Anonymous',
      color: color || '#ff9457',
      lastSeen: new Date().toISOString(),
    };

    const upsert = async () => {
      try {
        await pb.collection('presence').update(presenceId, payload);
      } catch (e) {
        if (e?.status === 404) {
          try { await pb.collection('presence').create({ id: presenceId, ...payload }); } catch {}
        }
      }
    };

    upsert();
    const interval = setInterval(upsert, 15000);

    const onUnload = () => {
      try { pb.collection('presence').delete(presenceId); } catch {}
    };
    window.addEventListener('beforeunload', onUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onUnload);
      onUnload();
    };
  }

  function subscribePresence(seed, onChange) {
    if (!pb) return () => {};
    const now = () => Date.now();

    const fetch = () => {
      pb.collection('presence').getList(1, 50, { filter: `seed = "${seed}"` })
        .then(res => {
          const cutoff = now() - 120000;
          const users = res.items.filter(r => new Date(r.lastSeen).getTime() > cutoff);
          onChange(users);
        }).catch(() => {});
    };

    fetch();
    pb.collection('presence').subscribe('*', e => {
      if (e.record?.seed === seed) fetch();
    }).catch(() => {});

    return () => pb.collection('presence').unsubscribe('*');
  }

  // PocketBase record IDs must be 15 chars alphanumeric. Hash the seed string.
  function seedToId(seed) {
    let h = 5381;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) + h) ^ seed.charCodeAt(i);
    const abs = Math.abs(h).toString(36).padStart(7, '0');
    // 15 char alphanumeric id
    return ('pb' + abs + seed.replace(/[^a-z0-9]/gi, '').toLowerCase()).slice(0, 15).padEnd(15, '0');
  }

  const GM_CONFIG_ID = 'gmconfigglobal0'; // fixed 15-char alphanumeric PocketBase ID

  async function saveGMHash(hash) {
    if (!pb) return;
    const payload = { seed: '__gm_config__', data: { gmHash: hash }, lastUpdatedAt: new Date().toISOString(), lastUpdatedBy: 'gm' };
    try {
      await pb.collection('campaigns').update(GM_CONFIG_ID, payload);
    } catch (e) {
      if (e?.status === 404) {
        try { await pb.collection('campaigns').create({ id: GM_CONFIG_ID, ...payload }); } catch (e2) { console.warn('[mp] saveGMHash error', e2); }
      } else { console.warn('[mp] saveGMHash error', e); }
    }
  }

  async function loadGMHash() {
    if (!pb) return null;
    try {
      const rec = await pb.collection('campaigns').getOne(GM_CONFIG_ID);
      return rec?.data?.gmHash || null;
    } catch { return null; }
  }

  window.MP = {
    init,
    subscribeCampaign,
    saveCampaign,
    saveGMHash,
    loadGMHash,
    startPresence,
    subscribePresence,
    isReady: ready,
    getUserId: () => userId,
  };
})();
