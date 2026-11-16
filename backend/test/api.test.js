const { test } = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const mongoose = require("mongoose");
const Food = require("../src/models/food");
const app = require("../src/app");

test("HTTP contracts with disconnected model doubles (no dotenv, server bootstrap or MongoDB)", async t => {
    assert.equal(mongoose.connection.readyState, 0);
    t.mock.method(mongoose, "connect", () => { throw new Error("Database connections are forbidden in tests"); });
    let foods = [];
    let pipeline;
    let failure = false;
    let reads = 0;
    const read = () => { reads++; if (failure) throw new Error("private database failure"); };
    t.mock.method(Food, "find", filter => {
        read();
        let result = foods.filter(food => !filter?.price || food.price <= filter.price.$lte)
            .filter(food => !filter?._id || filter._id.$in.includes(String(food._id)));
        return {
            sort(order) {
                assert.deepEqual(order, { price: 1, name: 1, _id: 1 });
                result = [...result].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
                return this;
            },
            async lean() { return result; }
        };
    });
    t.mock.method(Food, "findById", id => {
        read();
        return { async lean() { return foods.find(food => food._id === id.toLowerCase()) || null; } };
    });
    t.mock.method(Food, "aggregate", async value => {
        read();
        pipeline = value;
        const match = value[0].$match;
        // The production uniform selection is MongoDB $sample; this double only tests eligibility/shape.
        const eligible = foods.filter(food => !match.price || food.price <= match.price.$lte);
        return eligible.length ? [eligible[0]] : [];
    });
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const request = async (path, body, options = {}) => {
        const response = await fetch(base + path, { method: body === undefined ? "GET" : "POST",
            headers: { "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), ...options });
        return { status: response.status, body: await response.json(), headers: response.headers };
    };
    const makeFood = (n, changes = {}) => ({ _id: n.toString(16).padStart(24, "0"), name: `Food ${n}`, price: 45000,
        category: "noodle-soup", spicy: 0, fullness: 2, ...changes });
    const a = makeFood(10);
    const b = makeFood(11, { name: "Duck Confit", price: 350000, category: "other", spicy: 2 });
    const recommendation = { budget: 50000, categories: [], spicy: 0, fullness: 2 };
    const group = { foodIds: [a._id, b._id], budget: 50000 };

    await t.test("health, route 404 and empty catalog", async () => {
        assert.deepEqual((await request("/health")).body, { status: "ok" });
        assert.deepEqual((await request("/foods")).body, { data: [] });
        const missing = await request("/missing");
        assert.equal(missing.status, 404);
        assert.equal(missing.body.error.code, "ROUTE_NOT_FOUND");
    });
    await t.test("sorted catalog, detail, malformed ID and unknown ID", async () => {
        foods = [b, a];
        assert.deepEqual((await request("/foods")).body.data, [a, b]);
        assert.deepEqual((await request(`/foods/${a._id}`)).body, { data: a });
        assert.equal((await request(`/foods/${a._id.toUpperCase()}`)).status, 200);
        assert.equal((await request("/foods/not-an-id")).status, 400);
        assert.equal((await request(`/foods/${makeFood(99)._id}`)).status, 404);
    });
    for (const value of ["", "?budget=19999", "?budget=300001", "?budget=1.5", "?budget=no", "?budget=5e4", "?budget=-20000", "?budget=20000&budget=30000", "?budget[]=50000"]) {
        await t.test(`gacha rejects ${value || "missing budget"} without querying`, async () => {
            const before = reads;
            assert.equal((await request(`/gacha${value}`)).status, 400);
            assert.equal(reads, before);
        });
    }
    for (const budget of [20000, 20001, 50000, 300000]) {
        await t.test(`gacha includes price equal to budget ${budget} using uniform sample pipeline`, async () => {
            foods = [makeFood(1, { price: budget })];
            const result = await request(`/gacha?budget=${budget}`);
            assert.equal(result.status, 200);
            assert.deepEqual(result.body, { data: foods[0] });
            assert.deepEqual(pipeline, [{ $match: { price: { $lte: budget } } }, { $sample: { size: 1 } }]);
        });
    }
    await t.test("gacha empty is 404; legacy random keeps filters and errors", async () => {
        foods = [b];
        assert.equal((await request("/gacha?budget=300000")).status, 404);
        foods = [a];
        assert.deepEqual((await request(`/foods/random?maxPrice=50000&maxCalories=600&cuisine=Vietnamese&meal=Lunch,Dinner&tags=SOUP&excludeId=${b._id}`)).body, { data: a });
        assert.deepEqual(pipeline[0].$match, { price: { $lte: 50000 }, calories: { $lte: 600 }, cuisine: { $in: ["Vietnamese"] }, meal: { $in: ["Lunch", "Dinner"] }, tags: { $in: ["soup"] }, _id: { $ne: new mongoose.Types.ObjectId(b._id) } });
        assert.equal((await request("/foods/random?maxPrice=bad")).body.error.code, "INVALID_FILTER");
        assert.equal((await request("/foods/random?excludeId=bad")).body.error.code, "INVALID_EXCLUDE_ID");
        assert.equal((await request("/foods/random?maxPrice=0")).status, 404);
        assert.equal((await request("/foods/random")).status, 200);
    });
    for (const changes of [{ budget: "50000" }, { budget: 19999 }, { budget: 300001 }, { budget: 20000.5 }, { categories: null }, { categories: ["drink"] }, { categories: ["rice", "Rice"] }, { spicy: 5 }, { spicy: "0" }, { fullness: 0 }, { fullness: 2.5 }]) {
        await t.test(`recommendation rejects ${JSON.stringify(changes)}`, async () => {
            const before = reads;
            const result = await request("/recommendations", { ...recommendation, ...changes });
            assert.equal(result.status, 400);
            assert.equal(result.body.error.code, "INVALID_INPUT");
            assert.equal(reads, before);
        });
    }
    await t.test("recommendation aliases, empty categories, scoring explanations and no matches", async () => {
        foods = [a, b];
        const any = await request("/recommendations", recommendation);
        assert.equal(any.body.data[0].score, 100);
        assert.equal(any.body.data[0].reasonDetails.reduce((sum, r) => sum + r.points, 0), 100);
        assert.equal((await request("/recommendations", { ...recommendation, categories: ["Noodle Soup"] })).body.data[0].score, 100);
        assert.equal((await request("/recommendations", { ...recommendation, categories: ["other"] })).body.data[0].score, 60);
        foods = [b];
        assert.deepEqual((await request("/recommendations", recommendation)).body, { data: [] });
    });
    const invalidGroups = [{ foodIds: [a._id] }, { foodIds: Array.from({ length: 13 }, (_, i) => makeFood(i)._id) },
        { foodIds: [a._id, a._id.toUpperCase()] }, { foodIds: [a._id, "bad"] }, { foodIds: [a._id, 2] },
        { budget: 19999 }, { budget: "50000" }, { budget: 300001 }, { noSpicy: "true" }, { noSpicy: null },
        { avoidCategories: "rice" }, { avoidCategories: ["drink"] }, { avoidCategories: ["Rice", "rice"] }];
    for (const changes of invalidGroups) {
        await t.test(`group rejects ${JSON.stringify(changes)}`, async () => {
            const before = reads;
            const result = await request("/group-decision", { ...group, ...changes });
            assert.equal(result.status, 400);
            assert.equal(result.body.error.code, "INVALID_INPUT");
            assert.equal(reads, before);
        });
    }
    await t.test("group default flags, uppercase IDs, missing and incomplete data", async () => {
        foods = [b, a];
        const result = await request("/group-decision", { ...group, foodIds: [a._id.toUpperCase(), b._id] });
        assert.equal(result.status, 200);
        assert.deepEqual(result.body.data, { finalists: [a], eliminated: [{ food: b, reason: "OVER_BUDGET" }] });
        foods = [a];
        assert.equal((await request("/group-decision", group)).body.error.code, "UNKNOWN_FOOD_ID");
        foods = [a, { ...b, category: undefined }];
        assert.equal((await request("/group-decision", group)).status, 409);
    });
    await t.test("group accepts 12 IDs; category aliases; zero finalists and input ordering", async () => {
        foods = Array.from({ length: 12 }, (_, i) => makeFood(i + 1));
        const ids = foods.map(f => f._id).reverse();
        const result = await request("/group-decision", { foodIds: ids, budget: 50000 });
        assert.equal(result.status, 200);
        assert.deepEqual(result.body.data.finalists.map(f => f._id), ids);
        const eliminated = await request("/group-decision", { foodIds: ids, budget: 50000, avoidCategories: ["Noodle Soup"] });
        assert.deepEqual(eliminated.body.data.finalists, []);
        assert.deepEqual(eliminated.body.data.eliminated.map(f => f.food._id), ids);
        assert.ok(eliminated.body.data.eliminated.every(f => f.reason === "AVOIDED_CATEGORY"));
    });
    await t.test("all POST routes validate missing, array and malformed JSON bodies", async () => {
        for (const path of ["/recommendations", "/group-decision"]) {
            assert.equal((await request(path, [])).status, 400);
            assert.equal((await request(path, undefined, { method: "POST" })).status, 400);
            assert.equal((await request(path, {}, { body: "{" })).body.error.code, "INVALID_INPUT");
            assert.equal((await request(path, {}, { body: JSON.stringify({ padding: "x".repeat(110000) }) })).status, 413);
        }
    });
    await t.test("database failures use stable envelopes and never leak raw errors", async () => {
        failure = true;
        for (const [path, body] of [["/foods"], [`/foods/${a._id}`], ["/foods/random"], ["/gacha?budget=50000"], ["/recommendations", recommendation], ["/group-decision", group]]) {
            const result = await request(path, body);
            assert.equal(result.status, 500);
            assert.equal(result.body.error.code, "INTERNAL_SERVER_ERROR");
            assert.ok(!JSON.stringify(result.body).includes("private"));
        }
        failure = false;
        assert.equal(mongoose.connection.readyState, 0);
    });
});
