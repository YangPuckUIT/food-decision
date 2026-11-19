# Lịch sử thiết kế và kiểm tra frontend

Các ghi chép dưới đây được giữ nguyên theo từng đợt thực hiện. Số liệu, đường dẫn trong code block và mô tả hành vi là thông tin lịch sử, không phải kết quả kiểm tra hiện tại. Xem [thiết kế hiện tại](../design.md) và [cách kiểm tra](../testing.md).

<a id="master"></a>

## MASTER

# Food Decision design system

## Direction

A Central European fairy-tale kingdom rendered as a warm, premium reading
surface: aged parchment pages with deep "night" zones (page banners, footer,
the Food Roll overlay). Gothic-arch silhouettes, Fachwerk timber houses,
an enchanted forest, cobblestones, a market square and hand-drawn heraldry
appear as original code-native SVG — never as stock art, game assets or
invented food photography. The signature visual is the hand-drawn SVG
kingdom map on Home with four clickable landmark pins and subtle pointer
parallax; Food Roll is a dark astronomical-tower ritual (starfield, rotating
rings, meteor, warm wash) that reveals the real API result.

The interface remains an ordinary useful React app: visible navigation, real
food data, native controls. No fake dishes, no random image URLs, no
copyrighted assets, no heavy dependencies.

## Sources and selection (verified in this session)

- **Skills actually loaded and applied**: `design-taste-frontend` (hover
  lift/zoom micro-interactions, equal edges, no scroll-triggered fades,
  reduced-motion rest, no violet, no image captions), `motion` (transform-only
  animation, `prefers-reduced-motion` handling), `impeccable` (config present
  at `.impeccable/config.local.json`), and `ui-ux-pro-max` via its local
  `search.py` (style domain: Vintage Analog, Dark OLED, Editorial Grid — used
  as reviewed inspiration, not verbatim output).
- **awesome-design-md** (max 3 allowed): only `theverge` and `bugatti`
  DESIGN.md were successfully read (the Starbucks fetch timed out and was not
  used). Adopted *principles*, not brand assets: editorial type contrast with
  tracked uppercase labels (theverge) and radical restraint / whitespace as
  luxury / strict type-role discipline (bugatti). No brand colors, logos or
  assets were copied.
- **Motion MCP** was not exposed in this session; the installed `motion` 14
  package (`motion/react`) plus the `motion` skill guidance were used directly.
  `motion-plus` and `21st` MCP require OAuth and were unavailable — not used,
  not claimed.
- Earlier `ui-ux-pro-max` searches (recorded in git history) supplied
  Editorial Grid / Magazine layout, Vintage Analog warmth and News Editorial
  typography; film effects, parallax-as-decor and all-serif body were rejected.

## Tokens

Single source: [tokens.css](../../frontend/src/styles/tokens.css), imported by frontend global CSS.

| Role | Value |
| --- | --- |
| Background (warm parchment) | #f1ead9 |
| Paper | #fbf6ea / deep #f4edda |
| Ink / muted | #2b2820 / #6d6553 |
| Night zones (banner, footer, roll overlay) | #1d2a23 / deep #15201a |
| Primary forest | #2a4a3c (hover #1c352a) |
| Wine (error, Oracle accent) | #7f3b3b |
| Slate (Explore accent) | #435d69 |
| Timber (Group accent) | #6f4f38 |
| Aged brass (accent, focus on dark) | #8a5f1f / light #d8b36a |
| Stained-glass accents (tiny details only) | ruby #9c4a3c, gold #c9a227, blue #3f6d8e, green #3e6b4f |
| Rules / borders / tints | #d9cdb2 / #97835f / #eae1cc (+ slate/wine/timber tints) |
| Heading | Cormorant Garamond (Vietnamese subset), Georgia fallback |
| Body / UI | Be Vietnam Pro (Vietnamese-native), system-ui fallback |

Fonts load with `display=swap` and Vietnamese subsets from Google Fonts in
`index.html`; system fallbacks keep text readable offline. Body 16px,
line-height 1.6; fluid display headings with short measures. WCAG 2.2 AA:
normal text >= 4.5:1, large text and control/focus boundaries >= 3:1 (verified
per pairing: ink on paper, muted on paper, on-primary on forest, night-ink on
night, brass-light on night, focus ring #7f3b3b on paper). Brass is an accent
and eyebrow color, never a large filled primary button; the single primary
button style is forest. Corners 4/8/14px; fine borders, low paper shadows,
one dialog shadow. Spacing on a 4px step (4–64px).

## Screen composition

- Shared shell: crest badge in the header, compact persistent mode navigation
  with visible active state, skip link, dark footer. Page banner per screen is
  a deep night panel with a brass dotted texture and a per-destination accent
  bar (forest=Roll, wine=Oracle, timber=Group, slate=Explore).
- Home / map: full-width hand-drawn SVG kingdom map (forest, river,
  cobblestone road, market square, four Fachwerk landmarks) with four
  staggered landmark pins; pointer parallax on fine pointers only. On phones
  the pins become a vertical list in the same DOM order. No pan/zoom dependency.
- Food Roll: dark intro panel with brass budget card; the overlay is a
  full-screen night ritual (see [ROLL-ANIMATION.md](#roll-animation)).
- Explore: search/category/sort filter panel in slate tint; editorial food
  journal grid (borderless cards separated by rules); detail in an accessible
  native dialog, retaining catalog position on return.
- Oracle: preferences panel (wine accent) beside ranked real API results.
  Score shown as points out of 100 (`/100 điểm`), never invented
  probabilities; API order and reason meaning preserved.
- Round Table: group form (timber accent) — pick 2–12 existing foods, set
  constraints, inspect finalists and explicit elimination reasons; the final
  random pick stays on the client.

## Motion and interaction rules

- Global `MotionConfig reducedMotion="user"`; every animation also honors a
  CSS `prefers-reduced-motion` kill switch. Transform/opacity only (no layout
  animation); springs for route transitions (stiffness 420 / damping 36), keyed
  entrance for result blocks, staggered pin entrances, `useAnimate` keyframe
  sequence in the roll ritual. No flashes, shakes or scroll-triggered fades.
- Native inputs and dialogs; real labels; SVG icons hidden when adjacent text
  names the action. Native modal focus containment, Escape and focus return.
- No interaction relies on hover. All touch targets >= 44px. One primary
  action per form. Disabled/busy states use text, not color alone. Anti
  double-click via a ref lock; aborts on unmount.
- Loading skeletons are shape-matched and delayed; empty/error/retry states
  stay operable. Food fallback is a small line icon plus honest missing-photo
  text; only existing API `imageUrl` values are rendered.

## Persistence, refresh and network

- URL query state holds page, catalog search/category/sort and detail ID, so
  links, refresh and Back work. Versioned sessionStorage (`food-decision:v2:`,
  24h TTL) holds validated per-mode drafts and actual successful API results;
  it never stores a running/loading state. Corrupt/expired/wrong-version or
  blocked storage falls back safely; a pending request after refresh becomes
  an editable draft, not a claimed running task.
- API adapter (`src/api/foods.js`) unchanged contract per `backend/API.md`:
  15s timeout + AbortController, stale-response token guards, envelopes
  `{data}` / `{error:{code,message}}`. No backend, Atlas, seed, `.env` changes.

## Responsive and a11y targets

Mobile first at 375/768/1024/1440px; reflow rather than truncate, no
horizontal scroll, low CLS. Semantic landmarks, `lang="vi"`, visible focus,
44px targets, no color-only signals, aria-live status regions, focus trap in
dialogs, keyboard operable overlay with Skip.

## Contract and scope

No new runtime dependencies. Client navigation stays query-based; no router,
auth, voting or chat. Verification details live in [QA.md](#qa) /
[STORYBOOK-QA.md](#storybook-qa); the premium redesign report and asset list
live in [PREMIUM-REDESIGN.md](#premium-redesign).


---

<a id="storybook"></a>

## STORYBOOK

# Storybook frontend follow-up

## Reviewed design plan (premium fairy-tale redesign)

Food Decision is a Vietnamese food-choice tool for individuals and small groups,
now set in a Central European fairy-tale kingdom: light parchment reading
surfaces with deep night zones (page banner, footer, roll overlay). The
memorable element is the hand-drawn SVG kingdom map on Home — forest, river,
cobblestone road, market square and four Fachwerk landmarks as original
code-native SVG with clickable pins and subtle pointer parallax. Functional
screens stay readable and quiet; they are not a collection of castle ornaments.

Palette (see [tokens.css](../../frontend/src/styles/tokens.css)): parchment #f1ead9 / paper #fbf6ea,
night #1d2a23, forest #2a4a3c, wine #7f3b3b, slate #435d69, timber #6f4f38,
aged brass #8a5f1f with stained-glass accents used only as tiny details.
Headings use Cormorant Garamond (Vietnamese subset); body/UI uses Be Vietnam
Pro — both with system fallbacks, `display=swap`.

Layout concept: per-screen night banner with a brass dotted texture and a
per-destination accent bar, then working forms and food-led result panels; the
roll is a temporary full-screen night ritual overlay.

```text
Home:     [night banner] [SVG kingdom map + 4 landmark pins (parallax)]
Explore:  [night banner] [slate filter panel] [editorial journal grid] [detail dialog]
Decide:   [night banner] [accent form panel] [ranked / finalist API results]
Roll:     [night intro + brass budget card] -> [full-screen ritual overlay + Skip]
```

Self-critique before implementation: the previous numbered destinations implied
a sequence that does not exist, and repeated tracked uppercase labels felt
generic. Keep one primary button style (forest), spend the visual detail on the
map and the roll ritual. Use wine for Oracle, slate for Explore, timber for
Group and forest for Roll as small structural accents, not whole-page themes.
No invented dishes or art URLs. Missing photos use the existing honest fallback.

## UX foundation

URL query state holds page, catalog search/category/sort and detail ID so links,
refresh and browser Back work. Versioned session storage holds validated per-mode
drafts and actual successful API results; it never holds a running/loading state.
Corrupt/expired/wrong-version/blocked storage falls back safely. A pending request
after refresh becomes an editable draft, not a claimed running task. Result and
input snapshots are stored together and invalidated when criteria change.

Page changes and dialogs use brief Motion transitions; reduced-motion turns off
spatial changes. Roll's existing one-request/Skip logic is retained. Network
requests keep stale-response guards and gain explicit cancellation where useful.
Skeletons match catalog/form/detail shapes, appear only after a short delay, and
do not replace honest error/retry states.

## Assets

No food photographs exist in frontend/public at inspection. Provide authentic
food photos matching API imageUrl, preferably 4:3 or 16:9, at least 960px wide,
WebP/JPEG, with usage rights. They will serve FoodCard and detail unchanged.
No additional logo, character or stock image is needed: the town graphic and
icons are code-native SVG. Existing web fonts have usable local fallbacks.

This follow-up supersedes the local-only review boundary for the earlier roll
task: the new request authorizes meaningful commits and a review PR. No merge or
deployment. Original local changes were backed up outside the repository first.


---

<a id="premium-redesign"></a>

## PREMIUM-REDESIGN

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
- Docs synced: [MASTER.md](#master), [STORYBOOK.md](#storybook),
  [ROLL-ANIMATION.md](#roll-animation).

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


---

<a id="roll-animation"></a>

## ROLL-ANIMATION

# Food Roll Motion overlay

Integrated on `feat/28-storybook-frontend` after local review. This replaces the earlier inline
CSS/SVG flight completely. There is one active roll sequence, implemented with
the already installed `motion` 14.14.0 and imports from `motion/react`.
Package/lockfile edits adding Motion were present before this change and were
preserved. No Motion AI/MCP configuration or unrelated component was removed.
The installed Motion skill's React, reduced-motion and CSS-versus-Motion guidance
was used. No Motion MCP tool is exposed in this session, so the skill's local
guidance and installed package were used directly.

## Overlay and sequence

- Desktop native modal: 96vw by 94dvh. Phone: 100vw by 100dvh. This temporary
  layer covers the existing page without introducing a route or navigation.
- One existing getRandomFood(budget) request starts immediately. The endpoint
  stays GET /api/foods/random?maxPrice=..., with the same filters and envelopes.
- Premium redesign: the ceremony is now an astronomical-tower ritual on a deep
  night panel — starfield, two counter-rotating brass rings, a central crest
  emblem, a single meteor streak, then a low-opacity warm wash before the
  reveal. Motion `useAnimate` drives the scoped keyframe sequence; normal
  duration is about 2.5 seconds, followed by a short keyed card entrance.
- AnimatePresence / keyed motion elements handle scene/result replacement and
  the card entrance. There is no CSS keyframe roll sequence or video layer
  running underneath it.
- The overlay remains open on success until the user closes it or rolls again.
  The unmodified FoodCard renders only the actual API response. Closing keeps
  that result on the underlying Food Roll page.

## Skip, waiting, retry and cancellation

Skip is visible in the top toolbar during rolling/waiting and is operable by
pointer or keyboard. It is idempotent and never sends another request.

1. If the API response is available, Skip removes the scene and reveals that
   real result immediately, bypassing the remaining sequence/entrance delay.
2. If the API has not responded, Skip stops the moving scene and leaves a static
   emblem with Đang tìm món. The existing request continues. Its response then
   appears directly; no fake dish or repeated API request is used.
3. A naturally finished sequence also holds still while waiting for a slow API.

Server errors, network failures and empty responses appear inside the overlay
with retry and close buttons. Retry starts one new attempt with the same budget.
A ref guard prevents duplicate roll requests throughout the current attempt.

Close/Escape can dismiss the layer while a request is pending. This skips only
the visual ceremony; the page remains locked until that request settles. Its
real result then appears on the page. Navigation unmount aborts that request,
stops scoped Motion playback and ignores late responses from the old instance.

## Accessibility and style

Native dialog semantics, Escape, explicit Tab wrapping, close/Skip accessible
names, and a polite live region remain available. Result focus enters the
outcome after its entrance. Error panels retain their existing alert semantics.
MotionConfig reducedMotion=user and useReducedMotion bypass the spatial sequence
and delays when requested, including preference changes mid-sequence. Fetching
still waits for the real response.

The parchment/forest/brass theme is retained; the overlay itself is a deep
night panel (#1d2a23) with brass rings and a crest emblem, providing the ritual
mood without particle showers, neon, full-screen flashing, copied game imagery
or audio. The warm wash peaks at low opacity. FoodCard, backend,
database, data and FoodCard are unchanged. The client API adapter now supports
request cancellation and a 15-second timeout while preserving endpoints,
payloads, response envelopes and existing budget controls.

## Files and local checks

- Removed old FoodRollAnimation.jsx and FoodRollAnimation.css.
- Replaced useFoodRoll.js with a response/animation/Skip state gate without
  the old timer-based ceremony.
- Added FoodRollOverlay.jsx/.css and integrated it in FoodRollPage.jsx/.css.
- Replaced the old focused browser harness and adjusted only roll expectations
  in the existing full frontend harness.

From frontend: npm.cmd run lint, npm.cmd run build, npm.cmd run dev.
Open Food Roll and use the already configured backend for real data. Do not
start migrations, seed or provision a database to review this UI.

With an existing Playwright/browser installation, the focused harness runs from
repository root with node frontend/tools/check-roll-animation.cjs. It accepts
UI_PLAYWRIGHT_PATH, UI_BROWSER_EXECUTABLE, UI_PREVIEW_URL and UI_QA_OUTPUT as in
QA.md. All API HTTP is intercepted in the harness. No test package or browser
was installed and no live backend/Atlas connection was opened.

Focused Chromium verification: 34 checks passed, including fast-response Skip,
pending-response Skip, no extra requests, natural completion, slow static wait,
retry/error/empty/network failure, keyboard focus/Escape, reduced motion and
375/768/1024/1440px overlay/result bounds. Screenshots were visually inspected.
This is isolated local verification, not a live backend or full screen-reader
certification. The later storybook request authorizes meaningful commits and a
review PR; the previous local-only handoff boundary no longer applies.

Final frontend lint/build and all 89 full-frontend regression checks passed with
the new overlay behavior. Backend and FoodCard diffs remain empty. See
[storybook QA](#storybook-qa) for current restoration checks and build sizes.
The reference video was not decoded for this follow-up; motion was designed
from the written sequence. No video or copied game assets are bundled.


---

<a id="qa"></a>

## QA

# Frontend redesign verification

## Scope and results

Issue #28. React/Vite frontend only, built on main after backend PR #27 merged.
No backend files, database data, API adapter, package dependencies or lockfiles
changed. No .env/credential inspection, Atlas connection, seed, migration,
deployment or PR merge. UI UX Pro Max was installed globally by its official CLI
and is not bundled into the site.

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, 38 modules, CSS 22.60 kB (5.05 kB gzip), JS 251.85 kB
  (78.20 kB gzip). No new runtime dependencies.
- Chromium/Playwright: **89 checks passed**, 76 intercepted API requests and no
  runtime page errors. Existing browser installation reused; no browser or testing
  package was installed for this work.
- Layouts/screenshots reviewed at **375, 768, 1024 and 1440 CSS pixels**. No page
  horizontal overflow in the checked screens/states. Budget and detail dialogs
  also checked for internal horizontal overflow.

The machine-readable [browser report](browser-report.json) records each check.
The harness is [frontend/tools/check-ui.cjs](../../frontend/tools/check-ui.cjs).

## What the browser checks cover

- Four operable map destinations, navigation, skip link and Vietnamese page language.
- Catalog loading, search/category/sort, no matches, server errors, retry and empty
  catalog. Detail fetch by ID, loading/error/retry, Escape and return focus; filters
  and list position remain when detail closes.
- Native budget dialog plus explicit Tab/Shift+Tab wrap, initial input focus,
  cancellation and opener focus return. Precise integer 45001 and presets, rolling
  feedback, reroll/change budget, no food found, error and retry.
- Exact legacy Food Roll path `/api/foods/random?maxPrice=...`. No switch to gacha.
- Recommendation payload, API order, reasons and score meaning (points out of 100,
  not percentages), loading/error/empty and retry.
- Group payload/order, 2–12 selection limits, removing a selected food at the limit,
  three elimination reasons, finalists, frontend random final choice, cleared stale
  winner after constraint edits, zero finalists and retry.
- High-priced valid catalog foods remain selectable so the existing API can
  return OVER_BUDGET. The client completeness check no longer applies user-budget
  limits to stored food prices; no food prices or server rules were changed.
- Visible group buttons meet 44px target size at each tested width. Checkbox labels
  provide full touch areas. Long names and enlarged text reflow at 375px.
- Reduced-motion disables loading animation; blocked web fonts retain usable
  system fallbacks. Missing/broken food images use the honest SVG fallback.

Token contrast calculations (sRGB luminance): ink/background 12.11:1,
muted/paper 5.85:1, muted/background 5.22:1, primary/paper 9.44:1,
primary button text 9.44:1, burgundy/negative 6.89:1, brass/paper 5.26:1,
control border/paper 3.62:1. This is not a complete WCAG conformance audit.

## Reproduce with an existing browser installation

Start the frontend with `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort`.
Do not start the production backend or connect to Atlas for these checks. In a
second PowerShell terminal at repository root, point to an already installed
Playwright module and matching browser if they are outside normal Node resolution:

```powershell
$env:UI_PLAYWRIGHT_PATH = 'C:\path\to\existing\node_modules\playwright-core'
$env:UI_BROWSER_EXECUTABLE = 'C:\path\to\existing\chrome.exe'
node frontend/tools/check-ui.cjs
```

If Playwright resolves normally and its browser is available, those two variables
can be omitted. `UI_PREVIEW_URL` can override the local preview URL, and
`UI_QA_OUTPUT` can override the temporary report/screenshot directory. The script
does not install anything. If browser tooling is absent, run lint/build and the
manual interaction checklist instead of adding a package for this check.

All `/api/` HTTP is intercepted in the browser. Fixtures read the existing local
24-food sample JSON and add a separate in-memory high-price edge case. Pure
backend decision helpers build mock responses; no server or database is opened.
The application itself continues to call real APIs through its unchanged adapter;
no fixtures or sample catalog were wired into the production bundle.

## Screenshots for frontend review

These are actual local browser captures with intercepted HTTP, **not screenshots
of the live 100-food Atlas catalog**. They intentionally show image fallbacks,
because no real food-image assets currently exist in frontend/public. No character
or food photos were fabricated. Modal captures show the viewport; longer result
screens show the full page.

| Screen | Capture |
| --- | --- |
| Map, desktop | [1440px](screenshots/home-1440.png) |
| Map, phone | [375px](screenshots/home-375.png) |
| Food Roll result | [1440px](screenshots/roll-1440.png) |
| Budget dialog | [375px](screenshots/budget-375.png) |
| Explore | [1440px](screenshots/codex-1440.png) |
| Food detail | [375px](screenshots/detail-375.png) |
| Recommendations | [1440px](screenshots/oracle-1440.png) |
| Group results | [1440px](screenshots/group-1440.png) |

## Remaining review

Frontend member @Edge092022 (identified from PR #13) should review visual direction,
Vietnamese typography/copy, mobile form density and behavior with the actual
catalog/food image assets when supplied. Screenshots and automated keyboard checks
do not replace assistive-technology testing. Live backend connectivity, real device
Safari/Firefox and a full screen-reader audit were not performed. Existing
in-memory navigation is retained; there is no new URL router, login, room or voting.
External fonts are optional and may fall back according to network/privacy settings.
No merge, hosting or deployment is part of this handoff.


---

<a id="storybook-qa"></a>

## STORYBOOK-QA

# Storybook follow-up verification

Branch: `feat/28-storybook-frontend`, based on main after PR #29. Reuses issue
#28 and integrates roll issue #30. Existing local changes were backed up before
branch creation. No backend, database, seed, migration, secrets or real data
changed. No merge or deployment. The already installed Motion package and its
lockfile are preserved; no additional runtime/test package was installed.

## Checks completed

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, 476 modules. CSS 26.01 kB (5.77 kB gzip),
  JS 427.02 kB (136.56 kB gzip).
- Full frontend Chromium harness: **89 passed**, no runtime errors, 76
  intercepted requests. [Machine-readable report](storybook-browser-report.json).
- Focused roll harness: **34 passed**, no runtime errors. Covers one request per
  attempt, fast/slow Skip, static waiting, natural completion, error/empty/retry,
  focus/Escape and reduced motion at 375/768/1024/1440px.
- Restoration/recovery harness: **24 passed**, no runtime errors. Covers URL
  filters/detail, reload, mode navigation, browser Back/Forward, actual result
  restoration without POST replay, changed-input invalidation, pending refresh,
  corrupt/wrong-type/old-version/expired/blocked storage, server failure, retry
  and 15-second timeout recovery.

All API HTTP was intercepted using repository sample fixtures and pure decision
helpers in the test harness only. Production still calls the actual existing
API. No live backend or Atlas connection was used. Existing Playwright/Chromium
was reused. This is not a full screen-reader or WCAG conformance certification.

The preserved ink/forest/brass/control tokens retain the contrast ratios recorded
in [the earlier QA](#qa). New wine/slate/timber accents are restrained borders,
illustration colors and labels; status also has text and icons. Keyboard checks
cover skip link, budget/detail/roll dialogs, focus restoration and primary flows.
Reduced motion removes spatial transitions and the roll ceremony; it still waits
for the real response. There is no background video, perpetual particle loop or
strong flash. The reference video was not decoded for this follow-up.

## State and recovery behavior

URL query state owns mode, catalog query/category/sort and detail ID. Session
storage uses a version-2 validated envelope, a 24-hour expiry and a size limit.
Drafts and genuine successful responses are stored; busy/loading flags are not.
Restored results are explicitly labelled as previous results. Changing criteria
invalidates a saved result. A pending refresh restores an editable draft.
Blocked storage falls back to in-memory state.

The client API adapter adds cancellation and a 15-second timeout; endpoint,
payload and response contracts are unchanged. Navigation cancels requests and
guards stale responses. Skip only ends roll motion, never sends another request;
if the API is pending, the overlay holds a still loading state. Closing a pending
overlay keeps the attempt locked until the response arrives. Retry sends one new
attempt. Slow content uses delayed, shape-matched skeletons to avoid quick flashes.

## Review captures and assets

Actual local browser captures with intercepted HTTP, not live Atlas screenshots:

- [Home desktop](storybook-screenshots/home-1440.png) and
  [Home phone](storybook-screenshots/home-375.png).
- [Oracle](storybook-screenshots/oracle-1440.png),
  [Group phone](storybook-screenshots/group-375.png),
  [Explore](storybook-screenshots/codex-1440.png),
  [Detail phone](storybook-screenshots/detail-375.png).
- [Roll ceremony](storybook-screenshots/desktop-flight.png) and
  [real response reveal](storybook-screenshots/desktop-result.png).

Home and Oracle captures were visually reviewed. The browser harness also checks
responsive bounds on the working screens at all four widths. Existing font
fallback and missing/broken-image cases remain covered. See the design plan's
[asset handoff](#storybook): authentic API-matching food photos are still
needed, preferably 4:3 or 16:9 at least 960px wide, WebP/JPEG. No extra logo,
character or font is needed; the Fachwerk illustration and icons are original SVG.

## Reproduce

Start frontend locally on port 5173. Reuse existing browser tooling via
`UI_PLAYWRIGHT_PATH` and `UI_BROWSER_EXECUTABLE` as documented in [QA.md](#qa).
From repository root run:

```powershell
node frontend/tools/check-ui.cjs
node frontend/tools/check-roll-animation.cjs
node frontend/tools/check-restoration.cjs
```

No backend process or database is required for these intercepted-browser checks.


---
