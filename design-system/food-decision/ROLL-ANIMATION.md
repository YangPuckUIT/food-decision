# Food Roll Motion overlay

Local review on `feat/30-food-roll-animation`. This replaces the earlier inline
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
- Motion useAnimate drives a scoped sequence: book emblem opacity/scale, one
  restrained directional star, then a low-opacity warm paper transition. Normal
  sequence duration is about 2.3 seconds, followed by a short card entrance.
- AnimatePresence handles scene/result replacement, Motion handles the surface
  entrance, card opacity/scale and layout positioning. There is no CSS keyframe
  roll sequence or video layer running underneath it.
- The overlay remains open on success until the user closes it or rolls again.
  The unmodified FoodCard renders only the actual API response. Closing keeps
  that result on the underlying Food Roll page.

## Skip, waiting, retry and cancellation

Skip is visible in the top toolbar during rolling/waiting and is operable by
pointer or keyboard. It is idempotent and never sends another request.

1. If the API response is available, Skip removes the scene and reveals that
   real result immediately, bypassing the remaining sequence/entrance delay.
2. If the API has not responded, Skip stops the moving scene and leaves a static
   book with Đang tìm món. The existing request continues. Its response then
   appears directly; no fake dish or repeated API request is used.
3. A naturally finished sequence also holds still while waiting for a slow API.

Server errors, network failures and empty responses appear inside the overlay
with retry and close buttons. Retry starts one new attempt with the same budget.
A ref guard prevents duplicate roll requests throughout the current attempt.

Close/Escape can dismiss the layer while a request is pending. This skips only
the visual ceremony; the page remains locked until that request settles. Its
real result then appears on the page. Navigation unmount stops scoped Motion
playback and ignores late responses from the previous component instance.

## Accessibility and style

Native dialog semantics, Escape, explicit Tab wrapping, close/Skip accessible
names, and a polite live region remain available. Result focus enters the
outcome after its entrance. Error panels retain their existing alert semantics.
MotionConfig reducedMotion=user and useReducedMotion bypass the spatial sequence
and delays when requested, including preference changes mid-sequence. Fetching
still waits for the real response.

The paper/forest/brass theme is retained. A single emblem and star provide the
ritual mood without particle showers, neon, full-screen flashing, copied game
imagery or audio. The warm wash peaks at opacity 0.14. FoodCard, backend,
database, data, API adapter and budget controls are unchanged.

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
certification. No new commit/push/PR, merge or deployment is part of this handoff.

Final frontend lint/build and all 89 full-frontend regression checks passed with
the new overlay behavior. Backend, API adapter and FoodCard diffs remain empty.
