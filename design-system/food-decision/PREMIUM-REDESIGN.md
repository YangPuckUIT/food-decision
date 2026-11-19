# Premium fairy-tale redesign — report

Branch: `feat/fe-premium-fairy-tale-redesign` (from latest `main` @ d05d355).
Scope: `frontend/` + `design-system/food-decision/` only. Backend, Atlas,
MongoDB, seed data, `.env` untouched. API contract per `backend/API.md`
unchanged. No new runtime dependencies (`motion` 14 was already installed).

## What changed

- **Tokens** (`tokens.css`, rewritten): parchment/paper reading surfaces,
  deep night zones, forest/wine/slate/timber/brass accents, sparse
  stained-glass accents, Cormorant Garamond + Be Vietnam Pro (Vietnamese
  subsets), 4px spacing scale, radius 4/8/14, paper/lift/dialog shadows.
- **Shell** (`index.html`, `index.css`, `MvApp.css`, `storybook.css`): crest
  brand badge, persistent nav with active state, skip link, dark night
  footer, per-screen night page banner with brass dotted texture and a
  per-destination accent bar, skeleton shimmer, restored-note, one primary
  button style (forest), global `prefers-reduced-motion` kill switch.
- **Home**: new hand-drawn SVG kingdom map (`KingdomMapScene.jsx`) — forest,
  river, cobblestone road, market houses, compass, title cartouche — with
  four staggered landmark pins (`KingdomMap.jsx`) and pointer parallax
  (fine pointers only, disabled under reduced motion). Mobile: vertical list.
- **Food Roll**: overlay is now a full-screen astronomical-tower ritual
  (`FoodRollOverlay.jsx/.css`): starfield, counter-rotating brass rings,
  crest emblem, meteor streak, warm wash (~2.5s), then keyed result card.
  Skip semantics unchanged (skips animation only, never re-requests; pending
  request still shows waiting; reduced motion < 1s). Dark intro + brass
  budget card on the page (`FoodRollPage.css`, `BudgetPanel.css`).
- **Explore** (`Codex.jsx/.css`): slate filter panel, editorial borderless
  journal grid, entrance motion, detail dialog unchanged (native, focus
  trap, Escape).
- **Decide** (`DecisionPanel.jsx/.css`): wine/timber accent form panels,
  step markers, candidate chips, ranked results with `/100 điểm`, keyed
  entrance motion for busy/error/result states.
- **Cards** (`FoodCard.css`, `Icon.jsx`): hover lift, brass category
  eyebrow; added `crest` + `moon` icons.
- Removed unused `TownSignboard.jsx`; extracted `SPOTS` to
  `src/state/kingdomSpots.js` (react-refresh lint).
- Docs synced: [MASTER.md](MASTER.md), [STORYBOOK.md](STORYBOOK.md),
  [ROLL-ANIMATION.md](ROLL-ANIMATION.md).

## Principles adopted (and how they were translated)

- **design-taste-frontend skill**: quiet hover lift/zoom micro-interactions,
  equal edges, no scroll-triggered fades, reduced-motion rest, no violet, no
  captions on images. → hover `translateY(-2px)` + shadow on cards, spring
  route transitions, CSS reduced-motion kill switch.
- **motion skill + `motion` package**: transform/opacity only, springs for
  entrances, `useAnimate` keyframes for the ritual, `MotionConfig
  reducedMotion="user"` + `useReducedMotion` everywhere spatial.
- **ui-ux-pro-max** (local `search.py`, style domain): Vintage Analog warmth,
  Editorial Grid hierarchy — adopted as inspiration, not verbatim output.
- **awesome-design-md** (only 2 of max 3 readable; Starbucks fetch timed out
  and was not used): theverge's editorial type contrast + tracked uppercase
  labels → Cormorant Garamond display vs Be Vietnam Pro UI + brass eyebrows;
  bugatti's radical restraint / whitespace as luxury / strict type roles →
  one primary button, short measures, restrained accents. No brand assets,
  colors or logos copied.
- **impeccable**: config present; used for direction critique passes.
- **motion-plus / 21st MCP**: require OAuth, unavailable in this session —
  not used, not claimed.

## Refresh / loading / network / animation / a11y handling

- Refresh keeps page/step/filters/drafts via URL query + versioned
  sessionStorage (`food-decision:v2:`, 24h TTL); never restores loading as
  running; blocked/corrupt storage falls back safely; restored results are
  labelled "Kết quả lần trước" and editable.
- API adapter unchanged contract: 15s timeout + AbortController, stale-token
  guards, retry/abort on unmount, error envelopes rendered honestly.
- Skeletons shape-matched and delayed; empty/error/retry operable.
- Roll: one request per attempt, ref-lock anti double-click, Skip idempotent,
  no fake dishes, pending request shows waiting state.
- a11y: `lang="vi"`, semantic landmarks, labels, visible focus (3px,
  AA contrast), focus trap + Escape in dialogs, aria-live regions, 44px
  targets, no color-only signals, responsive 375–1440 without horizontal
  scroll, WCAG 2.2 AA text contrast (>=4.5:1 normal, >=3:1 controls/focus).

## Assets the user must supply

- Real food photos matching the API `imageUrl` values (licensed/owned),
  4:3 or 16:9, >= 960px wide, WebP/JPEG. They plug into existing FoodCard /
  detail unchanged. Everything else (map, landmarks, icons, crest) is
  code-native SVG — no other art needed. No fake food photos are bundled.

## Check results (honest)

- `npm.cmd run lint` — **PASS** (after extracting SPOTS; 0 errors).
- `npm.cmd run build` — **PASS**: 477 modules, CSS 34.92 kB (gzip 7.23 kB),
  JS 436.54 kB (gzip 139.66 kB), built in 598ms.
- `node frontend/tools/check-ui.cjs` and `check-roll-animation.cjs` —
  **NOT RUNNABLE here**: `playwright-core` is not installed and no
  Chrome/Edge binary exists in this environment. Run on a machine with a
  browser via `UI_PLAYWRIGHT_PATH` / `UI_BROWSER_EXECUTABLE` (see QA.md).
  No UI-harness pass is claimed.
- No backend started; no DB touched; no deploy/merge performed.

## GitHub issue + PR (gh CLI unavailable here — text for the user)

```bash
gh issue create --title "feat(fe): premium Central-European fairy-tale redesign" \
  --body "Premium redesign of the Food Decision frontend: parchment + night-zone
palette, hand-drawn SVG kingdom map with 4 landmark pins + parallax, full-screen
astronomical-tower Food Roll ritual, Motion transitions throughout, WCAG 2.2 AA.
All flows, API contract, persistence and roll semantics preserved.
See design-system/food-decision/PREMIUM-REDESIGN.md."
gh issue checkout <n>   # then branch feat/fe-<n>-premium-fairy-tale-redesign
# ... commits ...
gh pr create --base main --title "feat(fe): premium fairy-tale redesign" \
  --body "Closes #<n>

Redesign per design-system/food-decision/PREMIUM-REDESIGN.md.
- lint: PASS; build: PASS (gzip JS 139.66 kB)
- UI harnesses (check-ui/check-roll-animation) not runnable in CI-less env here;
  run locally with UI_PLAYWRIGHT_PATH per QA.md."
```
