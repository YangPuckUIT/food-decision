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
