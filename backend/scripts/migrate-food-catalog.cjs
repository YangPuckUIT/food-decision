require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const metadata = require('../src/data/food-metadata.json');
const Food = require('../src/models/food');

const MEAL_CASE = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};
const idPattern = /^[a-f\d]{24}$/i;

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env.');
  if (!Array.isArray(metadata) || metadata.length !== 100) {
    throw new Error('Expected metadata for exactly 100 existing foods. No database changes were made.');
  }

  const ids = metadata.map(item => item._id);
  if (ids.some(id => typeof id !== 'string' || !idPattern.test(id)) || new Set(ids).size !== ids.length) {
    throw new Error('Metadata contains an invalid or duplicate _id. No database changes were made.');
  }
  for (const item of metadata) {
    if (!item.name || !Food.CATEGORIES.includes(item.category) || ![0, 1, 2].includes(item.spicy) ||
        ![1, 2, 3].includes(item.fullness) || !Array.isArray(item.meal) || item.meal.length === 0 ||
        item.meal.some(meal => !Food.MEALS.includes(meal))) {
      throw new Error(`Invalid metadata for ${item.name || item._id}. No database changes were made.`);
    }
  }

  await mongoose.connect(process.env.MONGO_URI, { ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}), serverSelectionTimeoutMS: 10000 });
  const collection = Food.collection;
  console.log(`Target database: ${mongoose.connection.name}; collection: ${collection.collectionName}`);
  const actualCount = await collection.countDocuments();
  if (actualCount !== metadata.length) {
    throw new Error(`Expected exactly 100 documents in ${mongoose.connection.name}.foods; found ${actualCount}. No database changes were made.`);
  }

  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
  const existing = await collection.find({ _id: { $in: objectIds } }, { projection: { _id: 1, name: 1 } }).toArray();
  if (existing.length !== metadata.length) {
    throw new Error(`Only ${existing.length} of the 100 exported food documents were found. No database changes were made.`);
  }
  const currentById = new Map(existing.map(food => [String(food._id), food]));
  for (const item of metadata) {
    const current = currentById.get(item._id);
    if (!current || current.name !== item.name) {
      throw new Error(`Database name/_id mismatch for ${item.name}. No database changes were made.`);
    }
  }

  const now = new Date();
  const operations = metadata.map(item => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item._id) },
      update: { $set: {
        category: item.category,
        spicy: item.spicy,
        fullness: item.fullness,
        meal: item.meal,
        imageUrl: item.imageUrl,
        updatedAt: now,
      } },
    },
  }));
  const result = await collection.bulkWrite(operations, { ordered: true });
  console.log(`Updated ${result.modifiedCount} existing foods in ${mongoose.connection.name}.foods. No documents were inserted or deleted.`);
}

main()
  .catch(error => {
    console.error(error.message || 'Food catalog migration failed.');
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
