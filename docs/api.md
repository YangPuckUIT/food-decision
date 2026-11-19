# Food Decision API

Reference: Backend Brief, 14 November 2026. Development base URL:
`http://localhost:3000`. All endpoints read the shared foods collection; no API
writes. See [deployment](deployment.md) for configuration.

## Compatibility decisions

The current frontend consumes `{data: ...}` and `{error: {code, message}}`.
Preserve these envelopes instead of the PDF's error string. Health returns
`{ "status": "ok" }`. Existing document fields, names, descriptions, prices and
image paths remain unchanged; an imageUrl may be empty until images are supplied.

Stored/returned categories remain slugs (including `other`). Both category input
arrays also accept the exact, case-sensitive PDF labels below. Duplicate
normalized values are invalid; empty arrays are valid.

| PDF input alias | Canonical slug |
| --- | --- |
| Noodle Soup | noodle-soup |
| Rice | rice |
| Fast Food | fast-food |
| Hotpot & Grill | hotpot-grill |
| Snacks | street-snack |

Do not rewrite the existing 100-food catalog to the proposed five-value enum.
Duck Confit at 350000 VND remains valid food data. Budget limits apply to user
inputs, not the model's price. Existing reason codes/arrays remain intact;
recommendations add explanatory `reasonDetails`. Changing error shapes, replacing
slugs/`other`, translating existing food data or replacing reason codes requires
frontend lead agreement. No frontend edits or Discord messages were made.

## Validation / errors

- Budget is an integer **number** from **20000 through 300000**, inclusive; no
  5000 step. POST numeric strings are invalid.
- IDs are 24 hexadecimal characters. Uppercase is accepted; group duplicate
  detection is case-insensitive.
- Invalid input: 400 `INVALID_INPUT`, message `Invalid input: <field>`.
- Unknown route: 404 `ROUTE_NOT_FOUND`. Malformed JSON: 400 `INVALID_INPUT`.
- JSON beyond the default 100kb body-parser limit: 413 `INVALID_INPUT`.
- Unexpected failures: 500 `INTERNAL_SERVER_ERROR`; no raw database error details.

Example: `{ "error": { "code": "INVALID_INPUT", "message": "Invalid input: budget" } }`.

## GET /api/health

200 `{ "status": "ok" }`. Liveness only; no database query. Production startup
waits for an initial MongoDB connection before listening.

## GET /api/foods

200 `{ "data": [food, ...] }`, sorted by price, then name, then ID ascending.
Empty catalog: 200 `{data: []}`. Search/filter remain in frontend; query filters
are not applied here. Food objects retain `_id`, name, price, cuisine, meal,
calories, description, tags, imageUrl, category, spicy, fullness and existing extra
document fields.

## GET /api/foods/:id

200 `{ "data": food }`. Malformed ID: 400 `INVALID_INPUT`. Well-formed but unknown
ID: 404 `FOOD_NOT_FOUND`.

## GET /api/gacha?budget=50000

Required budget query: decimal digits representing an integer in 20000–300000.
Missing, repeated, fractional, scientific-notation or out-of-range budget: 400
`INVALID_INPUT`. Select uniformly from **all** foods with `price <= budget` using
MongoDB `$match` followed by `$sample: {size: 1}`. No rarity weighting or other
filters. Success: 200 `{data: food}`. No eligible food: 404 `FOOD_NOT_FOUND`.

## GET /api/foods/random (legacy)

Existing frontend endpoint is retained separately with its original response
and validation. Success: 200 `{data: food}`; no match: 404 `FOOD_NOT_FOUND`.
Uniform selection uses the same `$sample` service. `/random` precedes `/:id`.

| Query | Behavior |
| --- | --- |
| maxPrice, maxCalories | Optional non-negative safe integers; no gacha budget bounds |
| cuisine, meal, tags | Optional repeated/comma-separated values, `$in` within each field; tags lowercased |
| excludeId | Optional valid ObjectId, excluded from selection |

Bad numeric filters: 400 `INVALID_FILTER`. Bad excludeId: 400 `INVALID_EXCLUDE_ID`.

## POST /api/recommendations

```json
{ "budget": 80000, "categories": ["Noodle Soup"], "spicy": 1, "fullness": 2 }
```

All fields required. Categories are an array; `[]` means any category. Spicy:
0/1/2; fullness: 1/2/3. Exclude over-budget and incomplete records, then score:

| Criterion | Points |
| --- | --- |
| Category matches, or categories empty | 40; otherwise 0 |
| Spicy difference 0 / 1 / 2 | 30 / 15 / 0 |
| Fullness difference 0 / 1 / 2 | 30 / 15 / 0 |

Return at most three, score descending, price ascending, name A–Z (`vi` collation),
then ID for deterministic ties. No eligible foods: **200 `{data: []}`**.

Each result is `{food, score, reasons, reasonDetails}`; food is the full document.
Example scoring fields for Phở Bò at 45000, spicy=0, fullness=2:

```json
{
  "score": 85,
  "reasons": ["WITHIN_BUDGET", "CATEGORY_MATCH", "SPICY_CLOSE", "FULLNESS_MATCH"],
  "reasonDetails": [
    { "code": "WITHIN_BUDGET", "points": 0, "message": "Within budget: 45000 VND" },
    { "code": "CATEGORY_MATCH", "points": 40, "message": "Matches your craving: noodle-soup" },
    { "code": "SPICY_CLOSE", "points": 15, "message": "Spice level close" },
    { "code": "FULLNESS_MATCH", "points": 30, "message": "Fullness just right" }
  ]
}
```

Existing reason codes: `WITHIN_BUDGET`, `CATEGORY_MATCH`, `SPICY_MATCH`,
`SPICY_CLOSE`, `FULLNESS_MATCH`, `FULLNESS_CLOSE`. Empty categories still omit
`CATEGORY_MATCH` from the legacy reasons array; `reasonDetails` explains the 40
points using `CATEGORY_ANY` / "Any category is welcome". Detail points sum to the
score. Zero-point scoring criteria are omitted; budget is always explained with
0 points. The PDF example yields Phở Bò (85), Bún Bò Huế (85), Cơm Tấm (30),
excluding Lẩu Thái because 200000 exceeds 80000.

## POST /api/group-decision

```json
{
  "foodIds": ["000000000000000000000001", "000000000000000000000004"],
  "budget": 70000,
  "noSpicy": true,
  "avoidCategories": ["Hotpot & Grill"]
}
```

Require 2–12 unique valid IDs and budget. noSpicy: boolean, default false.
avoidCategories: array, default `[]` for legacy compatibility. Well-formed IDs
not found: **400 `UNKNOWN_FOOD_ID`**, as in the existing API and PDF. Incomplete
category/spicy/fullness or invalid price data: 409 `INCOMPLETE_FOOD_DATA`.
Price >300000 alone is valid; Duck Confit is eliminated as `OVER_BUDGET`.

First matching rule wins:

| Order | Rule | Existing code | Meaning |
| --- | --- | --- | --- |
| 1 | price > budget | OVER_BUDGET | Over budget |
| 2 | noSpicy=true and spicy=2 | TOO_SPICY | Too spicy |
| 3 | category in avoidCategories | AVOIDED_CATEGORY | Group wants to avoid this category |

Spicy=1 remains eligible when noSpicy=true. Each result array preserves relative
foodIds order regardless of database return order. Response:
`{data: {finalists: [food], eliminated: [{food, reason: "OVER_BUDGET"}]}}`.
Empty finalists still returns **200**. Final random choice stays in frontend.

## Offline tests / Postman

From backend, run `npm.cmd ci --ignore-scripts`, then `npm.cmd test`. Tests use
the real Express app over loopback with disconnected model doubles, pure service
tests and schema validation. They never load `.env`, start production or connect
to MongoDB. They verify the production `$sample` pipeline, not live MongoDB's
statistical distribution or query integration.

Import `postman/Food-Decision.postman_collection.json` and
`postman/Offline.postman_environment.json`. Run `npm.cmd run test:fixture` in a
separate backend terminal, then run the collection with that environment in
Postman Collection Runner. The fixture binds **127.0.0.1:3001**, holds 12 foods
in memory including the PDF example and Duck Confit, and disables MongoDB
connections without reading `.env`. Stop with Ctrl+C. It is not a production
service; exact IDs, scores and empty-result cases target these fixtures only.

The collection covers catalog/detail, gacha normal/bounds/invalid/empty,
recommendation example/any category/invalid spicy/empty, group elimination reasons,
1/13/duplicate/invalid/unknown IDs, defaults, ordering and empty finalists.
For any approved live smoke test later, use real catalog IDs and appropriate
expectations. No live Atlas/deployment checks or screenshots are claimed here.

Verified on 15 November 2026 with Node.js 24: `npm ci --ignore-scripts` succeeded;
`npm test` passed 51 HTTP/service checks and 17 schema cases. Newman 6.2.1 ran all
37 requests and 76 assertions successfully against the offline fixture:

```powershell
npx.cmd --yes --package=newman@6.2.1 newman run postman/Food-Decision.postman_collection.json -e postman/Offline.postman_environment.json
```

`npm audit --omit=dev` reported three existing vulnerable dependencies (two high,
one moderate): body-parser, mongoose and qs. Dependency/lock versions are unchanged
in this API work. Review and patch these before production deployment; the offline
suite does not establish production security or live database connectivity.
