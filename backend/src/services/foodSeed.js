const Food = require('../models/food');
const COLLATION = { locale: 'en', strength: 2 };
const nameKey = name => name.normalize('NFC').trim().toLocaleLowerCase('en');

function fail(message) {
  const error = new Error(message);
  error.safeMessage = message;
  throw error;
}

async function validateSeed(foods) {
  if (!Array.isArray(foods) || foods.length !== 24) fail('Seed must contain exactly 24 foods.');
  const seen = new Set();
  const result = [];
  for (const food of foods) {
    const document = new Food(food);
    await document.validate();
    const key = nameKey(document.name);
    if (seen.has(key)) fail('Duplicate name in seed.');
    seen.add(key);
    const value = document.toObject();
    delete value._id;
    result.push(value);
  }
  for (const category of Food.CATEGORIES) {
    if (result.filter(food => food.category === category).length < 4) fail('Each category needs at least four foods.');
  }
  for (const [field, values] of [['spicy', [0, 1, 2]], ['fullness', [1, 2, 3]]]) {
    for (const value of values) {
      if (result.filter(food => food[field] === value).length < 4) fail(`Insufficient ${field} coverage.`);
    }
  }
  for (const price of [20000, 50000, 100000, 300000]) {
    if (!result.some(food => food.price === price)) fail('Missing required price boundary.');
  }
  return result;
}

async function seedCollection(collection, foods) {
  // Read-only preflight across ALL existing foods, before creating the unique index.
  const duplicates = await collection.aggregate([
    { $group: { _id: '$name', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $limit: 1 }
  ], { collation: COLLATION }).toArray();
  if (duplicates.length) fail('Duplicate names exist in foods. Resolve them manually before seeding; no documents were written.');
  // Unique index also prevents concurrent seed runs inserting the same name.
  await collection.createIndex({ name: 1 }, { unique: true, collation: COLLATION, name: 'food_name_ci_unique' });
  const summary = { inserted: 0, updated: 0, unchanged: 0 };
  for (const food of foods) {
    const result = await collection.updateOne(
      { name: food.name }, { $set: food }, { upsert: true, collation: COLLATION }
    );
    summary.inserted += result.upsertedCount;
    summary.updated += result.modifiedCount;
    summary.unchanged += result.matchedCount - result.modifiedCount;
  }
  return summary;
}

module.exports = { validateSeed, seedCollection, COLLATION };
