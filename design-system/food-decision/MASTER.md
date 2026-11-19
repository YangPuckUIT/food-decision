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

Single source: [tokens.css](tokens.css), imported by frontend global CSS.

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
  full-screen night ritual (see [ROLL-ANIMATION.md](ROLL-ANIMATION.md)).
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
auth, voting or chat. Verification details live in [QA.md](QA.md) /
[STORYBOOK-QA.md](STORYBOOK-QA.md); the premium redesign report and asset list
live in [PREMIUM-REDESIGN.md](PREMIUM-REDESIGN.md).
