# Cradle of Embers — Stars Without Number Campaign Hub

A browser-based GM tool + player view for running Stars Without Number campaigns. Pure static HTML/JS — no build step. Works offline; multiplayer state syncs through **PocketBase** (self-hosted).

## Architecture at a glance

- **`index.html`** — the only page. Loads React 18, Three.js, the PocketBase SDK, Babel (in-browser JSX), and all our scripts via `<script>` tags.
- **`app.jsx`** — root React component. Owns `sector`, `party`, `missions`, `encounters`, `gmLog`, the **role/intro gate**, and **GM mode**. Hosts the sidebar nav, the view router, the breadcrumbs, search, tweaks panel, the dice roller, and the multiplayer panel.
- **`data/`** — pure-JS data layer:
  - `swn-tables.js` — SWN tables (atmospheres, biospheres, world tags, faction names, NPC skills/gear, tooltip text). Exposed as `window.SWN`.
  - `swn-equipment.js` — armor / weapons / foci (`window.SWN_EQUIP`); consumed by the character sheet.
  - `swn-character.js` — character-creation reference (`window.SWN_CHARGEN`): the 6 attributes, standard array, 4 classes, 20 official backgrounds (free/quick skills), the skill list, a curated focus set, and starting equipment packages. Mechanical facts follow the SWN Revised free edition; all blurbs are paraphrased in plain language. Drives the guided builder.
  - `swn-rules-data.js` — psionic disciplines/powers (`window.SWN_PSI`). Used by the character sheet's psionics panel and the builder's psionics step.
  - `swn-ships.js` — ship stat blocks (`window.SWN_SHIPS`). **Loaded but not yet surfaced in any view** (WIP).
  - `sector-gen.js` — seeded procedural generation: systems, planets, factions, NPCs, hooks, timeline, trade routes, `sectorLore`.
- **`utils/`** — pure-JS helpers:
  - `rng.js` — seeded RNG (`mulberry32`); deterministic sectors per seed string.
  - `planet-texture.js` — value-noise + FBM texture generation for the 3D planets, per biome.
  - `claude.js` — `window.askClaude` / `window.askClaudeJSON` wrappers around `window.claude.complete`. Used for AI brainstorm / mission gen / encounter gen.
  - `firebase.js` — **(name kept for history; now PocketBase, not Firebase)** `window.MP` namespace: `init()`, `saveCampaign()`, `subscribeCampaign()`, `startPresence()`, `subscribePresence()`. Talks to a PocketBase server (`PB_URL` constant) with `campaigns` + `presence` collections.
- **`components/`** — React components, all JSX loaded via Babel:
  - `intro-screen.jsx` — cinematic landing / **role gate**. Drifting ember particles, sector lore, "Enter as Player" / "Enter as GM" CTAs. Calls `onEnter('player'|'gm')`.
  - `dice-roller.jsx` — floating dice tool (`window.DiceRoller`) + `window.rollDice(expr, label, mod)` global used by the character sheet.
  - `starfield.jsx` — animated canvas backdrop with parallax stars + nebula blobs.
  - `sector-map.jsx` — pan/zoom hex grid of star systems with trade-route overlay.
  - `system-view.jsx` — orbit diagram for one system.
  - `planet-view.jsx` — Three.js 3D planet (procedural texture/bump/clouds/atmosphere/ring/moons) + full character sheet on the right. **NOTE: WebGLRenderer is created with `preserveDrawingBuffer: true` — required for the planet to appear (without it, the canvas reads as transparent after composite).**
  - `lists-views.jsx` — Factions / NPCs / Hooks / Timeline / Routes.
  - `combat.jsx` — tactical grid (paint terrain, drag tokens, initiative tracker).
  - `gm-turn.jsx` — SWN faction-turn screen with AI brainstorm.
  - `forge-views.jsx` — Mission Forge + Encounter Forge + **full SWN Character Sheets** (attributes, AC/BAB/strain/saves, armor + weapons from `SWN_EQUIP`, psionics from `SWN_PSI` for psychic classes, inline dice rolls). Also holds the **guided 4-step `CharacterBuilder`** modal and **per-player ownership** logic (see below).
  - `multiplayer-panel.jsx` — PocketBase connection UI, presence, room sharing.
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
- **localStorage** global (not per-seed): `coe-role` (`player`|`gm`), `swn-gm-hash` (SHA-256 of the GM password), `coe-intro-seen`.
- **PocketBase** record per seed: `campaigns/<seed>` (`data` JSON field) plus `presence` records. See `utils/firebase.js` (`PB_URL`). Record IDs are a 15-char hash of the seed (`seedToId`).
- URL param `?seed=<id>` overrides the seed on load — invite links.
- Export / Import (sidebar footer) round-trips the campaign to JSON.

## Roles & GM mode

The **intro screen** (`intro-screen.jsx`) is the entry point for everyone and gates by role:

- **Enter as Player** → `role='player'`, GM Tools nav section is **not rendered** at all.
- **Enter as GM** → prompts for the GM password (first GM ever sets it; SHA-256 stored in `swn-gm-hash`). On success `role='gm'`, `isGM=true`, and GM Tools (GM Turn / Mission Forge / Encounter Forge) appear.

Role is remembered per browser and re-shown on load only if no role is stored. Replay the intro via the brand logo (top-left). The sidebar footer has a role control: GM sees "switch to Player" + a ⚙ change-password button; players see "Enter GM Mode". All GM logic lives in `app.jsx` (`role`, `isGM`, `submitGMPassword`, `onGMAuthSuccess`, `tryGMView`, `sha256`). A defense-in-depth `useEffect` also bounces a non-GM off any GM view. **This gating is client-side only** — see Multiplayer security.

## Character ownership

Each character in the shared `party` array carries an optional `ownerId` + `ownerName`. Identity comes from `getPlayerIdentity()` in `app.jsx` (`me = {id, name}`): the id is `mp-user-id` (shared with presence) or a persisted `coe-player-id` fallback; the name is `mp-name`.

- **Players** can edit/delete only characters where `ownerId === me.id`; the **GM** edits everyone's (`canEdit()` in `forge-views.jsx`).
- The Party roster splits into **MY CHARACTER** / **OTHERS (read-only)** for players; the GM sees one flat list. A non-owned sheet renders inside a `pointer-events:none` wrapper with a read-only banner; **unclaimed** legacy characters (no `ownerId`) show a **Claim as mine** button.
- New characters are made via the **guided educational builder** (`CharacterBuilder` in `forge-views.jsx`, reads `window.SWN_CHARGEN`): a card-based flow for first-timers — Start → Attributes → Background → Class → Skills → Focus → (Psionics if psychic) → Gear → Review. Each step explains the choice in plain language. Skills default to the background's Quick Skills (with optional customize); equipment uses starting packages. Derives hp/ac/bab/saves per the rules and stamps `ownerId/ownerName`.
- Ownership syncs for free — it's just fields inside `party`, already persisted to PocketBase. Like the role gate, enforcement is **client-side only**.

## Adding a new view

1. Write a new `components/your-view.jsx` exposing a component on `window`.
2. Add it to `index.html`'s script list AND the readiness check in the mount IIFE.
3. In `app.jsx`: add it to `NAV_ICONS`, the sidebar nav `<NavItem>` list, the `crumbs` labels map, and a new `currentView === 'your-view'` branch in the view router.
4. If it needs persisted state, add to `campaignState`, `applyRemoteCampaign`, and `saveCampaign` patches.

## SWN content tables

`data/swn-tables.js` is the single source of truth for in-game content (atmospheres, world tags, etc.) — extend it there, the rest of the app reads from `window.SWN`.

## Git workflow (for Claude sessions)

**Always work off up-to-date `main`.** Past Claude sessions were spawned on stale branches and couldn't find files that already existed on `main`. At the START of every session: `git fetch origin && git merge origin/main` into your working branch before doing anything else. At the END of every session (or whenever a piece of work is complete): push your branch AND merge it back into `main`, then push `main` — never leave finished work stranded on a session branch. The user has standing permission for this merge-to-main flow.

## Campaign content — where things live

- **`sessions/session-NN-*.md`** — full GM session docs (plan + post-session "as played" addendum recording deviations, now-canon rulings, and live state). One file per session. **This is the canonical campaign record.**
- **`handouts/`** — player-facing docs: character backgrounds and spoiler-free session recaps (`session-N-recap.md`). Never put GM secrets here.
- **`data/gm-lore.js`** — the campaign bible surfaced in the app's GM Notes view (factions, NPCs, timeline, session dashboards). Keep it in sync with the `sessions/` docs when canon changes.
- The app's live campaign state (party, edits, gmLog) syncs to PocketBase and is NOT in the repo — if content referenced by the user is missing from the repo, ask them to paste it rather than assuming it doesn't exist.

## Multiplayer security

PocketBase collections (`campaigns`, `presence`) are currently open for read/write — fine for a trusted table. **The Player/GM split is a UI gate only:** a player with the room link can't *see* GM tools, but GM data still syncs to their browser. For real enforcement you'd move GM-only fields to a separate collection / record with PocketBase API rules. Acceptable for now given the trusted-group use case.

## Known constraints / gotchas

- **Three.js renderer**: `preserveDrawingBuffer: true` is required. See `planet-view.jsx` PlanetCanvas useEffect.
- **Babel in browser**: every JSX file's `styles` / `useEffect` / etc. shadows other files' globals unless renamed. Component file globals are intentionally scoped (`useGMt`, `useMGs` aliases) to avoid collisions across `<script type="text/babel">` blocks.
- **Claude AI calls** (`window.claude.complete`) are rate-limited per user and use a fixed model (`claude-haiku-4-5`) with a 1024-token cap. No key needed; works in deployed artifacts under the viewer's quota.
- **`<deck-stage>` etc.** — not used; not a deck.
