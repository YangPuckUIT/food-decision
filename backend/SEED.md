# Food seed — issue #22

Run from `backend/` on Windows PowerShell:

```powershell
npm ci
npm test
npm run seed:validate
Copy-Item .env.example .env
# Edit .env locally: MONGO_URI and SEED_DB_NAME must target your intended database.
npm run seed
```

`seed:validate` and tests work offline. `seed` explicitly writes to the database named
by `SEED_DB_NAME`, overriding the database in the URI. It logs that database, the
`foods` collection, and inserted/updated/unchanged counts. Never commit `.env`.

The 24 records in `src/data/foods.json` are **sample product data**, not verified
restaurant prices or nutritional advice. Prices refer to one person's portion,
including the explicitly named individual hotpot/grill portions. Calories, spice
and fullness are illustrative values for developing the decision features.
Do not infer these values for unrelated existing Atlas records.

Every category has at least four foods, every spicy/fullness level at least four,
and the dataset includes exact prices 20,000 / 50,000 / 100,000 / 300,000 VND.
Image paths follow `/images/foods/<slug>.png`; image files are not included.
Frontend FoodCard's existing fallback handles missing images.

## Safety and repeat runs

1. Validate all records and distribution constraints before connecting/writing.
2. Scan **all** existing names using MongoDB collation `{locale: 'en', strength: 2}`.
   Case-insensitive duplicates abort before writes. Inspect and resolve duplicates
   manually; the script never removes or merges documents automatically.
3. Create `food_name_ci_unique` with the same collation. This is a persistent
   collection-wide index: future writes cannot insert names differing only by case.
   Missing/null duplicate names or incompatible existing indexes may prevent creation;
   inspect the database manually rather than dropping indexes automatically.
4. Upsert by name using that same collation. Matching seed records receive all sample
   fields and retain their IDs. Other fields and unrelated records are preserved.
   No `deleteMany`, collection drop, or automatic legacy migration is performed.

Back up a shared database and review sample values before choosing it as the target.
The script intentionally does not run automatically at server startup.
Writes are sequential, not transactional: an interrupted run can leave partial progress;
fix the problem and rerun. The unique index protects concurrent inserts; if a competing
upsert produces a duplicate-key error, rerun after the other run completes.
Upserting these 24 names does **not** repair remaining legacy documents.

API envelopes and frontend source are unchanged. Database reads can return extra
legacy foods and those records may still lack the new fields.

## Verification boundary

`npm test` runs existing schema checks plus seed validation and an in-memory driver
contract test for duplicate aborts, matching collation, repeat runs, ID preservation
and preservation of unrelated records. These are not MongoDB integration tests.
Before using a shared Atlas database, run twice against a disposable database and
confirm the second run reports 0 inserted, 0 updated, 24 unchanged. Also verify that
an existing duplicate name causes an abort before index creation or food writes.
