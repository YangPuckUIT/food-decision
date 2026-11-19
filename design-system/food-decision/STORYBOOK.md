# Storybook frontend follow-up

## Reviewed design plan (premium fairy-tale redesign)

Food Decision is a Vietnamese food-choice tool for individuals and small groups,
now set in a Central European fairy-tale kingdom: light parchment reading
surfaces with deep night zones (page banner, footer, roll overlay). The
memorable element is the hand-drawn SVG kingdom map on Home — forest, river,
cobblestone road, market square and four Fachwerk landmarks as original
code-native SVG with clickable pins and subtle pointer parallax. Functional
screens stay readable and quiet; they are not a collection of castle ornaments.

Palette (see [tokens.css](tokens.css)): parchment #f1ead9 / paper #fbf6ea,
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
