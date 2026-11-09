require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Food = require('../src/models/food');
const foods = require('../src/data/foods.json');
const { validateSeed, seedCollection } = require('../src/services/foodSeed');

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--write', '--validate'].includes(arg)) || args.length !== 1) {
    throw new Error('Use --validate or --write.');
  }
  const validated = await validateSeed(foods);
  console.log(`Validated ${validated.length} sample foods.`);
  if (args[0] === '--validate') return;
  const dbName = process.env.MONGO_DB_NAME;
  if (!process.env.MONGO_URI || !dbName || !/^[a-zA-Z0-9_-]+$/.test(dbName)) {
    throw new Error('Set MONGO_URI and an explicit MONGO_DB_NAME (letters, digits, underscore, hyphen).');
  }
  await mongoose.connect(process.env.MONGO_URI, { dbName, autoIndex: false, serverSelectionTimeoutMS: 10000 });
  console.log(`Target database: ${dbName}; collection: foods`);
  const result = await seedCollection(Food.collection, validated);
  console.log(`Inserted: ${result.inserted}; updated: ${result.updated}; unchanged: ${result.unchanged}`);
}

main().catch(error => {
  // Driver errors can contain connection strings. Only local, controlled errors are displayed.
  console.error(error.name === 'MongoServerError' || error.name === 'MongoServerSelectionError'
    ? 'Database operation failed. Check access, connection and indexes; credentials are not logged.'
    : error.safeMessage || 'Seed failed. Check arguments, dataset, connection and target database.');
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
