# Run Food Decision MVP

Use Node.js 22.12+ or 24. Start both apps in separate terminals.

## Backend

```powershell
cd backend
npm.cmd ci
```

Keep your existing `.env` and MONGO_URI. Add `MONGO_DB_NAME=food-decision-mvp` to use a separate demo database for BOTH the API and seed. Set `PORT=3000` for the frontend development proxy. Never commit `.env`.

```powershell
npm.cmd run seed
npm.cmd run dev
```

Seed upserts 24 sample meals by case-insensitive name. It does not delete the existing collection. Existing matching names are updated; unrelated records remain. It stops before writes if duplicate names exist. These are sample per-person prices and illustrative nutrition, not restaurant quotes. Actual food images are still to be supplied by the frontend team; cards show an icon when images are absent.

## Frontend (second terminal, repository root)

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:5173. Vite proxies `/api` to http://localhost:3000. For a separate hosted backend set frontend `VITE_API_BASE_URL` to its origin and backend `CLIENT_ORIGINS` to the frontend origin.

## Included flows

- Home navigation to Food Roll, Explore/detail, recommendations and group decision.
- Food Roll calls the real random endpoint; loading, retry and empty states.
- Explore loads `{data: []}`, searches and sorts on the client, fetches details by ID.
- Recommendations: budget is a hard filter; category 40 + spice 30/15/0 + fullness 30/15/0. Top three, score descending then price/name/ID. Empty categories award category points without CATEGORY_MATCH.
- Group: 2–12 unique food IDs; eliminate by budget, high spice, then avoided categories. Returns finalists and elimination reasons. Random final choice is on the client.
- Incomplete legacy records are excluded from recommendations and rejected for group decisions.

## API

All endpoints use `{data: ...}` or `{error: {code, message}}`.

- GET /api/health
- GET /api/foods
- GET /api/foods/:id
- GET /api/foods/random?maxPrice=50000 (existing filters retained)
- POST /api/recommendations: `{ "budget": 50000, "categories": [], "spicy": 0, "fullness": 2 }`
- POST /api/group-decision: `{ "foodIds": ["<id1>", "<id2>"], "budget": 50000, "noSpicy": false, "avoidCategories": [] }`

This implementation has not been run, built or tested in this change, per the requested deadline workflow. The seed has not been executed against Atlas. Frontend navigation is local state, not shareable URL routes; group selection is on one device, without realtime rooms or voting.
