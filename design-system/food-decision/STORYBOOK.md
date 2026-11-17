# Storybook frontend follow-up

## Reviewed design plan

Food Decision is a Vietnamese food-choice tool for individuals and small groups.
The memorable element is a Central European market-town signboard, expressed as
original SVG Fachwerk buildings on Home. Functional screens stay readable and
quiet; they are not a collection of castle ornaments or repeated town pictures.

Palette: ivory paper #fffcf5, forest #294b3e, wine #7f3b3b, slate blue #435d69,
timber #71513c, aged brass #866522. Existing ink/contrast tokens are retained.
Newsreader remains the heading face; Roboto remains the UI/body face, both with
system fallbacks. Changing fonts again would add little product value.

Layout concept: left-aligned headings and working forms, a town signboard only
on Home, food-led result panels and a temporary Motion roll modal.

```text
Home:     [plain heading + four choices] [one Fachwerk town signboard]
Explore:  [search / category / sort] [real food journal grid] [detail dialog]
Decide:   [saved preferences or group draft] [ranked/finalist API results]
Roll:     [budget / saved real result] -> [temporary ritual overlay + Skip]
```

Self-critique before implementation: the previous numbered destinations implied
a sequence that does not exist, and repeated tracked uppercase labels plus an
italic headline fragment felt generic. Remove those treatments, keep the user's
paper/forest palette, and spend the visual detail on timber architecture. Use
wine for Oracle, slate for Explore, timber for Group and forest for Roll as small
structural accents, not whole-page monochrome themes. No invented dishes or art
URLs. Missing photos use the existing honest fallback.

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
