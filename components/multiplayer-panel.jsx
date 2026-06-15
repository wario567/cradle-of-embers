// Multiplayer panel — connect to Firebase, set your name, see who's online.
// Sits in the sidebar footer area; toggles connection state.

const { useState: useMPs, useEffect: useMPe, useRef: useMPr } = React;

const MP_COLORS = ['#ff9457', '#c084fc', '#ffb340', '#7fb069', '#5eb6f1', '#ef5b5b'];

function MultiplayerPanel({ seed, campaignState, onRemoteCampaign, open, setOpen }) {
  const [status, setStatus] = useMPs('disconnected'); // disconnected | connecting | connected | error
  const [name, setName] = useMPs(() => localStorage.getItem('mp-name') || '');
  const [color, setColor] = useMPs(() => localStorage.getItem('mp-color') || MP_COLORS[0]);
  const [presence, setPresence] = useMPs([]);
  const [autoSync, setAutoSync] = useMPs(() => localStorage.getItem('mp-autosync-' + seed) === '1');
  const [lastSyncedBy, setLastSyncedBy] = useMPs(null);
  const [error, setError] = useMPs(null);

  const unsubCampaignRef = useMPr(null);
  const unsubPresenceRef = useMPr(null);
  const stopPresenceRef = useMPr(null);
  const saveTimerRef = useMPr(null);
  const lastLocalUpdateRef = useMPr(0);

  // Auto-connect on mount if user previously enabled.
  useMPe(() => {
    if (localStorage.getItem('mp-autoconnect') === '1') connect();
    return () => disconnect();
  }, []);

  // When seed changes, re-establish subscriptions if connected.
  useMPe(() => {
    if (status !== 'connected') return;
    setupSubscriptions();
    return cleanupSubscriptions;
  }, [seed, status]);

  // Debounced auto-sync of local state to Firebase.
  useMPe(() => {
    if (status !== 'connected' || !autoSync || !campaignState) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      lastLocalUpdateRef.current = Date.now();
      window.MP.saveCampaign(seed, campaignState, name).catch(() => {});
    }, 1200);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [campaignState, status, autoSync, seed, name]);

  async function connect() {
    setStatus('connecting');
    setError(null);
    try {
      // Wait for SDK to load
      let waited = 0;
      while (!window.MP?.isReady() && waited < 5000) {
        await new Promise(r => setTimeout(r, 100));
        waited += 100;
      }
      await window.MP.init();
      setStatus('connected');
      localStorage.setItem('mp-autoconnect', '1');
      setupSubscriptions();
    } catch (e) {
      console.error('[mp]', e);
      setError(e.message || 'Failed to connect');
      setStatus('error');
    }
  }

  function disconnect() {
    cleanupSubscriptions();
    setStatus('disconnected');
    localStorage.removeItem('mp-autoconnect');
    setPresence([]);
  }

  function setupSubscriptions() {
    cleanupSubscriptions();
    unsubCampaignRef.current = window.MP.subscribeCampaign(seed, (data) => {
      if (!data) return;
      // Don't apply our own writes (best-effort de-bounce).
      if (Date.now() - lastLocalUpdateRef.current < 800) return;
      setLastSyncedBy(data.lastUpdatedBy);
      onRemoteCampaign(data);
    });
    unsubPresenceRef.current = window.MP.subscribePresence(seed, (users) => setPresence(users));
    stopPresenceRef.current = window.MP.startPresence(seed, name || 'Anonymous', color);
  }
  function cleanupSubscriptions() {
    if (unsubCampaignRef.current) { unsubCampaignRef.current(); unsubCampaignRef.current = null; }
    if (unsubPresenceRef.current) { unsubPresenceRef.current(); unsubPresenceRef.current = null; }
    if (stopPresenceRef.current) { stopPresenceRef.current(); stopPresenceRef.current = null; }
  }

  function saveName(v) {
    setName(v);
    localStorage.setItem('mp-name', v);
    // Refresh presence
    if (status === 'connected') {
      if (stopPresenceRef.current) stopPresenceRef.current();
      stopPresenceRef.current = window.MP.startPresence(seed, v || 'Anonymous', color);
    }
  }
  function saveColor(v) {
    setColor(v);
    localStorage.setItem('mp-color', v);
    if (status === 'connected') {
      if (stopPresenceRef.current) stopPresenceRef.current();
      stopPresenceRef.current = window.MP.startPresence(seed, name || 'Anonymous', v);
    }
  }
  function toggleAutoSync(v) {
    setAutoSync(v);
    localStorage.setItem('mp-autosync-' + seed, v ? '1' : '0');
  }

  function pushNow() {
    lastLocalUpdateRef.current = Date.now();
    window.MP.saveCampaign(seed, campaignState, name);
  }

  function copyRoomLink() {
    const url = location.origin + location.pathname + '?seed=' + encodeURIComponent(seed);
    navigator.clipboard.writeText(url).then(
      () => alert('Room link copied to clipboard:\n' + url),
      () => prompt('Copy this room link:', url)
    );
  }

  if (!open) {
    // Compact button — just a status pip
    return React.createElement('button', {
      onClick: () => setOpen(true),
      className: 'ghost',
      style: { width: '100%', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
    },
      React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: status === 'connected' ? 'var(--success)' : status === 'connecting' ? 'var(--warning)' : 'var(--fg-3)', boxShadow: status === 'connected' ? '0 0 6px var(--success)' : 'none' } }),
      status === 'connected' ? presence.length + ' online' : status === 'connecting' ? 'Connecting…' : 'Multiplayer'
    );
  }

  return React.createElement('div', { style: { position: 'fixed', bottom: 20, left: 240, width: 320, background: 'rgba(15,8,9,0.96)', border: '1px solid var(--border-1)', borderRadius: 10, padding: 16, zIndex: 200, backdropFilter: 'blur(10px)', boxShadow: '0 12px 32px rgba(0,0,0,0.6)' } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 } },
      React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--fg-0)' } }, 'Multiplayer'),
      React.createElement('button', { className: 'ghost', style: { fontSize: 14, padding: 2 }, onClick: () => setOpen(false) }, '✕')
    ),

    // Status row
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 10 } },
      React.createElement('span', { style: { width: 10, height: 10, borderRadius: '50%', background: status === 'connected' ? 'var(--success)' : status === 'connecting' ? 'var(--warning)' : status === 'error' ? 'var(--danger)' : 'var(--fg-3)', boxShadow: status === 'connected' ? '0 0 8px var(--success)' : 'none' } }),
      React.createElement('span', { style: { flex: 1, fontSize: 12, color: 'var(--fg-1)' } },
        status === 'connected' ? 'Live · ' + presence.length + ' connected' :
        status === 'connecting' ? 'Connecting to Firebase…' :
        status === 'error' ? 'Error: ' + (error || 'unknown') :
        'Disconnected'
      ),
      status === 'connected'
        ? React.createElement('button', { style: { fontSize: 11, padding: '3px 8px' }, onClick: disconnect }, 'Disconnect')
        : React.createElement('button', { className: 'primary', style: { fontSize: 11, padding: '3px 8px' }, disabled: status === 'connecting', onClick: connect }, 'Connect')
    ),

    // Name + color
    React.createElement('div', { style: { marginBottom: 10 } },
      React.createElement('label', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Your name'),
      React.createElement('input', {
        value: name, onChange: e => saveName(e.target.value),
        placeholder: 'How players see you', style: { marginTop: 4 },
      })
    ),
    React.createElement('div', { style: { marginBottom: 10 } },
      React.createElement('label', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Your color'),
      React.createElement('div', { style: { display: 'flex', gap: 6, marginTop: 4 } },
        MP_COLORS.map(c => React.createElement('button', {
          key: c, onClick: () => saveColor(c),
          style: { width: 24, height: 24, borderRadius: '50%', background: c, border: color === c ? '2px solid var(--fg-0)' : '1px solid var(--border-1)', padding: 0, cursor: 'pointer' },
        }))
      )
    ),

    // Sync controls (visible when connected)
    status === 'connected' && React.createElement(React.Fragment, null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '6px 0' } },
        React.createElement('label', { style: { fontSize: 12, color: 'var(--fg-1)' } }, 'Auto-sync changes'),
        React.createElement('input', { type: 'checkbox', checked: autoSync, onChange: e => toggleAutoSync(e.target.checked), style: { width: 'auto' } })
      ),
      !autoSync && React.createElement('button', { style: { width: '100%', fontSize: 12, marginBottom: 8 }, onClick: pushNow }, '↑ Push my changes now'),
      lastSyncedBy && React.createElement('div', { style: { fontSize: 11, color: 'var(--fg-3)', marginBottom: 8, fontStyle: 'italic' } }, 'Last update from: ', React.createElement('span', { style: { color: 'var(--fg-1)' } }, lastSyncedBy)),

      // Presence list
      presence.length > 0 && React.createElement('div', { style: { marginTop: 12 } },
        React.createElement('div', { style: { fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } }, 'At the table'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          presence.map(p => React.createElement('div', { key: p.userId, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'var(--bg-2)', borderRadius: 4 } },
            React.createElement('span', { style: { width: 10, height: 10, borderRadius: '50%', background: p.color || '#ff9457' } }),
            React.createElement('span', { style: { fontSize: 12, color: p.userId === window.MP.getUserId() ? 'var(--accent)' : 'var(--fg-1)' } },
              p.name, p.userId === window.MP.getUserId() ? ' (you)' : '')
          ))
        )
      ),

      // Room sharing
      React.createElement('div', { style: { marginTop: 12, padding: 10, background: 'rgba(255,148,87,0.06)', border: '1px solid rgba(255,148,87,0.2)', borderRadius: 6 } },
        React.createElement('div', { style: { fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } }, 'Room code'),
        React.createElement('div', { style: { fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--fg-0)', marginBottom: 6, wordBreak: 'break-all' } }, seed),
        React.createElement('button', { className: 'ghost', style: { fontSize: 11, width: '100%' }, onClick: copyRoomLink }, '⎘ Copy invite link')
      )
    ),

    // Help
    status !== 'connected' && React.createElement('div', { style: { marginTop: 10, padding: 10, background: 'var(--bg-2)', borderRadius: 6, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 } },
      'Connecting opens a shared Firestore room keyed to your sector seed. Anyone with the same seed sees the same campaign — players can build their own PCs and the GM can update factions live.'
    ),

    // Setup help
    React.createElement('div', { style: { marginTop: 10 } },
      React.createElement('details', { style: { fontSize: 11, color: 'var(--fg-3)' } },
        React.createElement('summary', { style: { cursor: 'pointer', color: 'var(--fg-2)' } }, 'First-time Firebase setup?'),
        React.createElement('ol', { style: { marginTop: 8, paddingLeft: 18, lineHeight: 1.6, color: 'var(--fg-2)' } },
          React.createElement('li', null, 'In ', React.createElement('a', { href: 'https://console.firebase.google.com/project/cradle-of-embers/firestore', target: '_blank', rel: 'noopener', style: { color: 'var(--accent)' } }, 'Firebase Console → Firestore'), ', click ', React.createElement('strong', null, 'Create database'), '. Pick a region, start in ', React.createElement('strong', null, 'test mode'), ' (lets writes work for 30 days).'),
          React.createElement('li', null, 'In ', React.createElement('a', { href: 'https://console.firebase.google.com/project/cradle-of-embers/authentication/providers', target: '_blank', rel: 'noopener', style: { color: 'var(--accent)' } }, 'Authentication → Sign-in method'), ', enable ', React.createElement('strong', null, 'Anonymous'), '.'),
          React.createElement('li', null, 'Click ', React.createElement('strong', null, 'Connect'), ' here. Share the invite link with players.'),
          React.createElement('li', { style: { color: 'var(--fg-3)' } }, 'For long-term use, lock Firestore Rules to authenticated users. For now, test mode is fine.')
        )
      )
    )
  );
}

window.MultiplayerPanel = MultiplayerPanel;
