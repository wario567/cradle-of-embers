# Cradle of Embers — Stars Without Number Campaign Hub

A browser-based GM tool + player view for running Stars Without Number campaigns. Pure static HTML/JS — no build step. Works offline; multiplayer state syncs through Firebase Firestore.

## Architecture at a glance

- **`index.html`** — the only page. Loads React 18, Three.js, Firebase, Babel (in-browser JSX), and all our scripts via `<script>` tags.
- **`app.jsx`** — root React component. Owns `sector`, `party`, `missions`, `encounters`, `gmLog`. Hosts the sidebar nav, the view router, the breadcrumbs, search, tweaks panel, and the multiplayer panel.
- **`data/`** — pure-JS data layer:
  - `swn-tables.js` — SWN tables (atmospheres, biospheres, world tags, faction names, NPC skills/gear, tooltip text).
  - `sector-gen.js` — seeded procedural generation: systems, planets, factions, NPCs, hooks, timeline, trade routes.
- **`utils/`** — pure-JS helpers:
  - `rng.js` — seeded RNG (`mulberry32`); deterministic sectors per seed string.
  - `planet-texture.js` — value-noise + FBM texture generation for the 3D planets, per biome.
  - `claude.js` — `window.askClaude` / `window.askClaudeJSON` wrappers around `window.claude.complete`. Used for AI brainstorm / mission gen / encounter gen.
  - `firebase.js` — `window.MP` namespace: `init()`, `saveCampaign()`, `subscribeCampaign()`, `startPresence()`, `subscribePresence()`. Uses Firebase compat builds via CDN.
- **`components/`** — React components, all JSX loaded via Babel:
  - `starfield.jsx` — animated canvas backdrop with parallax stars + nebula blobs.
  - `sector-map.jsx` — pan/zoom hex grid of star systems with trade-route overlay.
  - `system-view.jsx` — orbit diagram for one system.
  - `planet-view.jsx` — Three.js 3D planet (procedural texture/bump/clouds/atmosphere/ring/moons) + full character sheet on the right. **NOTE: WebGLRenderer is created with `preserveDrawingBuffer: true` — required for the planet to appear (without it, the canvas reads as transparent after composite).**
  - `lists-views.jsx` — Factions / NPCs / Hooks / Timeline / Routes.
  - `combat.jsx` — tactical grid (paint terrain, drag tokens, initiative tracker).
  - `gm-turn.jsx` — SWN faction-turn screen with AI brainstorm.
  - `forge-views.jsx` — Mission Forge + Encounter Forge + Character Sheets (party).
  - `multiplayer-panel.jsx` — Firestore connection UI, presence, room sharing.
  - `tooltip.jsx` — reusable `<Tooltip>` with portal-rendered floating content.
- **`tweaks-panel.jsx`** — design-tool tweaks scaffold; safe to ignore or repurpose.
- **`styles/theme.css`** — single stylesheet. Ember palette defined as CSS custom props (`--accent`, `--bg-0` … `--bg-4`, `--fg-0` … `--fg-4`).

## Build / run

There is no build. Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx http-server .
# or
python3 -m http.server 8000
```

To deploy: drop the whole folder on Netlify / Vercel / Firebase Hosting / GitHub Pages. No transpile step required.

For a single-file artifact (e.g. for archive or simple hosting), `cradle-of-embers.html` is a self-contained bundle of the whole app. Regenerate after changes by re-bundling.

## State + persistence

- **localStorage** per seed: `swn-edits-<seed>` (sector edits) and `swn-campaign-<seed>` (party, missions, encounters, gmLog).
- **Firestore** doc per seed: `campaigns/<seed>` with the same shape, merged on remote updates. Presence subdocs at `campaigns/<seed>/presence/<userId>`.
- URL param `?seed=<id>` overrides the seed on load — invite links.
- Export / Import (sidebar footer) round-trips the campaign to JSON.

## Adding a new view

1. Write a new `components/your-view.jsx` exposing a component on `window`.
2. Add it to `index.html`'s script list AND the readiness check in the mount IIFE.
3. In `app.jsx`: add it to `NAV_ICONS`, the sidebar nav `<NavItem>` list, the `crumbs` labels map, and a new `currentView === 'your-view'` branch in the view router.
4. If it needs persisted state, add to `campaignState`, `applyRemoteCampaign`, and `saveCampaign` patches.

## SWN content tables

`data/swn-tables.js` is the single source of truth for in-game content (atmospheres, world tags, etc.) — extend it there, the rest of the app reads from `window.SWN`.

## Multiplayer security

Currently using **Firestore test-mode rules** (open reads/writes for 30 days from creation). For production, lock down: only authenticated users can read/write `campaigns/<seed>` where they're listed in a `members` array, etc. The data path layout is forward-compatible — clients only touch `campaigns/<seed>` and its `presence` subcollection.

## Known constraints / gotchas

- **Three.js renderer**: `preserveDrawingBuffer: true` is required. See `planet-view.jsx` PlanetCanvas useEffect.
- **Babel in browser**: every JSX file's `styles` / `useEffect` / etc. shadows other files' globals unless renamed. Component file globals are intentionally scoped (`useGMt`, `useMGs` aliases) to avoid collisions across `<script type="text/babel">` blocks.
- **Claude AI calls** (`window.claude.complete`) are rate-limited per user and use a fixed model (`claude-haiku-4-5`) with a 1024-token cap. No key needed; works in deployed artifacts under the viewer's quota.
- **`<deck-stage>` etc.** — not used; not a deck.
