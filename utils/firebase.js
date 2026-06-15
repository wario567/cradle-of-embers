// Firebase multiplayer sync — Firestore + anonymous auth + presence.
// One Firestore document per campaign (`campaigns/{seed}`) holding sector edits + campaign data.
// Presence stored at `campaigns/{seed}/presence/{userId}` — auto-updated, expires stale.

(function () {
  // Config — user-provided. API key is meant to be public; security lives in Firestore Rules.
  const firebaseConfig = {
    apiKey: "AIzaSyACBC8zvb6YNfCY9aQKi_nBWn2buk6C_Gw",
    authDomain: "cradle-of-embers.firebaseapp.com",
    projectId: "cradle-of-embers",
    storageBucket: "cradle-of-embers.firebasestorage.app",
    messagingSenderId: "614243565412",
    appId: "1:614243565412:web:bb0c7b174d6bfc48748471",
    measurementId: "G-PFGVZS049J",
  };

  let app = null;
  let db = null;
  let auth = null;
  let userId = null;

  // Wait for the Firebase compat scripts to load.
  function ready() {
    return typeof firebase !== 'undefined' && firebase.firestore && firebase.auth;
  }

  async function init() {
    if (app) return { app, db, auth, userId };
    if (!ready()) throw new Error('Firebase SDK not loaded');
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    // Anonymous auth so writes can be scoped per user. Falls back gracefully if disabled.
    try {
      const cred = await auth.signInAnonymously();
      userId = cred.user.uid;
    } catch (e) {
      // Anonymous auth not enabled — generate a random local ID and proceed.
      console.warn('[mp] anonymous auth unavailable, using local user id', e?.code);
      userId = 'local-' + Math.random().toString(36).slice(2, 12);
    }
    return { app, db, auth, userId };
  }

  // Subscribe to the campaign doc. Returns unsubscribe.
  function subscribeCampaign(seed, onSnapshot) {
    if (!db) return () => {};
    return db.collection('campaigns').doc(seed).onSnapshot(
      snap => {
        if (snap.exists) onSnapshot(snap.data());
        else onSnapshot(null);
      },
      err => console.warn('[mp] subscribe error', err?.code || err?.message)
    );
  }

  // Save campaign state (debounced by caller). Last-write-wins.
  async function saveCampaign(seed, state, userName) {
    if (!db) return;
    try {
      await db.collection('campaigns').doc(seed).set({
        ...state,
        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdatedBy: userName || userId || 'anon',
      }, { merge: true });
    } catch (e) {
      console.warn('[mp] save error', e?.code || e?.message);
    }
  }

  // Presence: heartbeat updates a doc; remote clients subscribe to the collection to see who's online.
  function startPresence(seed, name, color) {
    if (!db || !userId) return () => {};
    const ref = db.collection('campaigns').doc(seed).collection('presence').doc(userId);
    const heartbeat = async () => {
      try {
        await ref.set({
          name: name || 'Anonymous',
          color: color || '#ff9457',
          userId,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } catch {}
    };
    heartbeat();
    const interval = setInterval(heartbeat, 15000);
    // Remove on unload
    const onUnload = () => { try { ref.delete(); } catch {} };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onUnload);
      onUnload();
    };
  }

  function subscribePresence(seed, onChange) {
    if (!db) return () => {};
    return db.collection('campaigns').doc(seed).collection('presence').onSnapshot(
      snap => {
        const now = Date.now();
        const users = [];
        snap.forEach(doc => {
          const d = doc.data();
          const lastSeen = d.lastSeen?.toMillis ? d.lastSeen.toMillis() : (d.lastSeen || 0);
          // Filter stale (>2 min)
          if (now - lastSeen < 120000 || !lastSeen) users.push(d);
        });
        onChange(users);
      },
      err => console.warn('[mp] presence subscribe error', err?.code || err?.message)
    );
  }

  window.MP = {
    init,
    subscribeCampaign,
    saveCampaign,
    startPresence,
    subscribePresence,
    isReady: ready,
    getUserId: () => userId,
  };
})();
