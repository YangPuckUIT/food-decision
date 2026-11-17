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
in [the earlier QA](QA.md). New wine/slate/timber accents are restrained borders,
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
[asset handoff](STORYBOOK.md#assets): authentic API-matching food photos are still
needed, preferably 4:3 or 16:9 at least 960px wide, WebP/JPEG. No extra logo,
character or font is needed; the Fachwerk illustration and icons are original SVG.

## Reproduce

Start frontend locally on port 5173. Reuse existing browser tooling via
`UI_PLAYWRIGHT_PATH` and `UI_BROWSER_EXECUTABLE` as documented in [QA.md](QA.md).
From repository root run:

```powershell
node frontend/tools/check-ui.cjs
node frontend/tools/check-roll-animation.cjs
node frontend/tools/check-restoration.cjs
```

No backend process or database is required for these intercepted-browser checks.
