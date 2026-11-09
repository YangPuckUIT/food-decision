const { test } = require('node:test');
const assert = require('node:assert/strict');
const foods = require('../src/data/foods.json');
const { validateSeed, seedCollection, COLLATION } = require('../src/services/foodSeed');

test('complete 24-food dataset passes schema and distribution checks', async () => {
  const validated = await validateSeed(foods);
  assert.equal(validated.length, 24);
  assert.ok(validated.every(food => !food._id));
});

test('invalid final record prevents whole-dataset validation', async () => {
  const invalid = structuredClone(foods);
  invalid[23].price = 19999;
  await assert.rejects(validateSeed(invalid));
});

test('duplicate names, incomplete categories and missing boundary prices are rejected', async () => {
  const duplicate = structuredClone(foods);
  duplicate[1].name = '  PHỞ BÒ  ';
  await assert.rejects(validateSeed(duplicate), /Duplicate/);
  const category = structuredClone(foods);
  category.filter(food => food.category === 'hotpot-grill')[0].category = 'rice';
  await assert.rejects(validateSeed(category), /category/);
  const price = structuredClone(foods);
  price.find(food => food.price === 300000).price = 299000;
  await assert.rejects(validateSeed(price), /boundary/);
});

test('duplicate preflight stops before index creation or writes', async () => {
  const collection = {
    aggregate: () => ({ toArray: async () => [{ _id: 'duplicate', count: 2 }] }),
    createIndex: () => assert.fail('must not create index'),
    updateOne: () => assert.fail('must not write')
  };
  await assert.rejects(seedCollection(collection, foods), /Duplicate names/);
});

test('repeat runs preserve IDs/unrelated records and update only matching sample foods', async () => {
  // In-memory driver contract test; real MongoDB collation/index behavior needs integration verification.
  const records = [{ _id: 'existing', name: 'PHỞ BÒ', price: 30000 }, { _id: 'unrelated', name: 'Món cũ' }];
  let indexed = false;
  const collection = {
    aggregate: (_pipeline, options) => {
      assert.deepEqual(options.collation, COLLATION);
      return { toArray: async () => [] };
    },
    createIndex: async (keys, options) => {
      assert.deepEqual(keys, { name: 1 });
      assert.equal(options.unique, true);
      assert.deepEqual(options.collation, COLLATION);
      indexed = true;
    },
    updateOne: async (filter, update, options) => {
      assert.ok(indexed);
      assert.equal(options.upsert, true);
      assert.deepEqual(options.collation, COLLATION);
      const existing = records.find(food => food.name.toLowerCase() === filter.name.toLowerCase());
      if (!existing) {
        records.push({ _id: `new-${records.length}`, ...update.$set });
        return { upsertedCount: 1, modifiedCount: 0, matchedCount: 0 };
      }
      const modified = Object.keys(update.$set).some(key => JSON.stringify(existing[key]) !== JSON.stringify(update.$set[key]));
      Object.assign(existing, update.$set);
      return { upsertedCount: 0, modifiedCount: Number(modified), matchedCount: 1 };
    }
  };
  const validated = await validateSeed(foods);
  assert.deepEqual(await seedCollection(collection, validated), { inserted: 23, updated: 1, unchanged: 0 });
  assert.deepEqual(await seedCollection(collection, validated), { inserted: 0, updated: 0, unchanged: 24 });
  assert.equal(records[0]._id, 'existing');
  assert.deepEqual(records[1], { _id: 'unrelated', name: 'Món cũ' });
  assert.equal(records.length, 25);
});
