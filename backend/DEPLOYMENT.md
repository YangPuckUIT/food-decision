# Backend configuration and deployment handoff

Use Node.js 22.12+ or 24 and npm. Routes bind paths → controllers validate HTTP
inputs → services perform reads/decision logic → models define MongoDB data.
`config/foodCategories.js` holds slugs and input aliases. `app.js` imports without
connecting; `server.js` loads environment and opens MongoDB before listening.

## Offline development

```powershell
cd backend
npm.cmd ci --ignore-scripts
npm.cmd test
npm.cmd run test:fixture
```

The last command is optional for Postman; see [API.md](API.md). It binds only to
loopback. Production starts with `npm start`, which opens a database connection
and is intentionally excluded from offline verification.

## Environment

Use `.env.example` as a template. Supply secrets privately through the host's UI;
never put real values in source, logs, tickets, screenshots or PRs.

| Variable | Purpose |
| --- | --- |
| PORT | Hosting port, defaults to 3000; accept provider-injected value |
| MONGO_URI | Private Atlas URI supplied by project owner |
| MONGO_DB_NAME | Existing catalog database, confirmed by owner |
| CLIENT_ORIGINS | Comma-separated exact frontend origins with scheme/port, no trailing slash |
| NODE_ENV | production on the host |

The example database name is a placeholder, not authorization to create a new
database. The existing 100-food catalog is already provisioned. **Do not run seed,
migrate, import or delete commands.** No database preparation step is needed.

## Render / Railway handoff (owner executes)

1. Review and merge the PR when ready. Configure a Node web service with root
   directory `backend` on the reviewed branch.
2. Install/build: `npm ci --omit=dev --ignore-scripts`. Start: `npm start`. No
   compilation, seed or migration step.
3. Configure the variables above in the hosting UI. Owner confirms the intended
   Atlas database, credentials and appropriate network access for the host.
   No service, credential or Atlas settings were created/changed in this task.
4. Health check: `/api/health`. Startup waits for MongoDB (10-second selection
   timeout); initial failure exits with a sanitized configuration message.
   Health thereafter indicates liveness, not continuous database readiness.
5. Set CLIENT_ORIGINS to the deployed frontend origin. Frontend team sets its
   existing VITE_API_BASE_URL to the public backend origin at build time. No
   frontend changes are included. Local Vite proxy expects backend port 3000.
6. After deployment authorization, check public HTTPS `/api/health`, `/api/foods`,
   `/api/gacha?budget=50000`, a known detail ID and the documented POST requests.
   Gacha 404 is valid if no food is affordable. These API calls only read data.
   Offline Postman IDs do not identify the live catalog.

Rollback uses the host's previous reviewed deployment/commit; no migration needed.
Public URL, hosting configuration, uptime and live Atlas connectivity remain for
the owner to configure and verify. This work does not deploy the API.
