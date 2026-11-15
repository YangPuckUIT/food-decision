# Run Food Decision MVP

For the current API contract, offline tests, Postman collection and deployment
handoff, see [backend/API.md](backend/API.md) and
[backend/DEPLOYMENT.md](backend/DEPLOYMENT.md). The existing 100-food catalog is
already provisioned: **do not run seed or migrate commands for API development**.

Use Node.js 22.12+ or 24. Start both apps in separate terminals.

## Backend

```powershell
cd backend
npm.cmd ci --ignore-scripts
npm.cmd test
```

Offline tests need no environment file or MongoDB connection. For offline Postman
testing run `npm.cmd run test:fixture` and import the collection/environment from
`backend/postman/`. See backend/API.md for instructions and verification results.

The existing 100-food catalog and metadata are already provisioned. Do not seed,
import, delete or migrate data as part of running or testing this API. Existing
food images are still to be supplied by frontend; cards use a fallback when absent.
Catalog prices and nutrition are illustrative, not restaurant quotes.

To run the real API against the existing configured catalog when authorized, keep
your private `.env` and database configuration, confirm the catalog database with
the owner, set PORT=3000 for the frontend development proxy, then run
`npm.cmd run dev`. That command opens a MongoDB connection. Never commit `.env`.
For hosting configuration use backend/DEPLOYMENT.md.

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
- GET /api/gacha?budget=50000 (strict budget 20000–300000; legacy random retained)
- GET /api/foods
- GET /api/foods/:id
- GET /api/foods/random?maxPrice=50000 (existing filters retained)
- POST /api/recommendations: `{ "budget": 50000, "categories": [], "spicy": 0, "fullness": 2 }`
- POST /api/group-decision: `{ "foodIds": ["<id1>", "<id2>"], "budget": 50000, "noSpicy": false, "avoidCategories": [] }`

The original MVP was delivered without runtime tests. The backend API completion now includes offline HTTP/service/schema tests and a Postman fixture workflow; see backend/API.md. Atlas connectivity and public deployment have not been tested in this change. Frontend navigation is local state, not shareable URL routes; group selection is on one device, without realtime rooms or voting.
