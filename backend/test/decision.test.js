const { test } = require("node:test");
const assert = require("node:assert/strict");
const { scoreFood, rankFoods, decideGroup, completeFood } = require("../src/services/decision");

const food = (name, price, category = "noodle-soup", spicy = 0, fullness = 2) =>
    ({ _id: name, name, price, category, spicy, fullness });
const input = { budget: 80000, categories: ["noodle-soup"], spicy: 1, fullness: 2 };

test("Brief example ranks Pho, Bun Bo Hue, Com Tam and excludes expensive hotpot", () => {
    const foods = [food("Lẩu Thái", 200000, "hotpot-grill", 2, 3), food("Cơm Tấm", 40000, "rice", 0, 3),
        food("Bún Bò Huế", 50000, "noodle-soup", 2), food("Phở Bò", 45000)];
    const ranked = rankFoods(foods, input);
    assert.deepEqual(ranked.map(item => [item.food.name, item.score]), [["Phở Bò", 85], ["Bún Bò Huế", 85], ["Cơm Tấm", 30]]);
    assert.deepEqual(ranked[0].reasons, ["WITHIN_BUDGET", "CATEGORY_MATCH", "SPICY_CLOSE", "FULLNESS_MATCH"]);
});

test("all spicy/fullness gaps score 30, 15 or 0 and every awarded point is explained", () => {
    for (const spicy of [0, 1, 2]) for (const fullness of [1, 2, 3]) {
        const result = scoreFood(food("A", 20000, "rice", spicy, fullness), { ...input, categories: [], spicy: 0, fullness: 1 });
        assert.equal(result.score, 40 + [30, 15, 0][spicy] + [30, 15, 0][fullness - 1]);
        assert.equal(result.reasonDetails.reduce((sum, reason) => sum + reason.points, 0), result.score);
        assert.ok(result.reasonDetails.every(reason => typeof reason.message === "string" && reason.message.length));
        assert.equal(result.reasonDetails[1].code, "CATEGORY_ANY");
        assert.ok(!result.reasons.includes("CATEGORY_MATCH"));
    }
    assert.equal(scoreFood(food("A", 20000, "rice", 1, 2), input).score, 60);
});

test("ties use price then name then ID and return at most three", () => {
    const foods = [food("Z", 50000), food("B", 40000), { ...food("A", 40000), _id: "2" }, { ...food("A", 40000), _id: "1" }];
    assert.deepEqual(rankFoods(foods, input).map(item => item.food._id), ["1", "2", "B"]);
});

test("budget boundaries include equality and exclude incomplete data", () => {
    const foods = [food("low", 20000), food("edge", 300000), food("Duck Confit", 350000), { ...food("legacy", 20000), spicy: undefined }];
    assert.equal(completeFood(foods[2]), true);
    assert.deepEqual(rankFoods(foods, { ...input, budget: 300000 }).map(item => item.food.name), ["low", "edge"]);
    assert.deepEqual(rankFoods(foods, { ...input, budget: 20000 }).map(item => item.food.name), ["low"]);
    assert.deepEqual(rankFoods([foods[2], foods[3]], input), []);
});

test("group preserves input order and applies budget, spicy, category precedence", () => {
    const foods = [food("first", 45000), food("Duck Confit", 350000, "other", 2), food("hot", 45000, "rice", 2),
        food("second", 20000), food("avoided", 45000, "rice", 1)];
    const result = decideGroup(foods, { budget: 50000, noSpicy: true, avoidCategories: ["rice", "other"] });
    assert.deepEqual(result.finalists.map(item => item.name), ["first", "second"]);
    assert.deepEqual(result.eliminated.map(item => [item.food.name, item.reason]), [["Duck Confit", "OVER_BUDGET"], ["hot", "TOO_SPICY"], ["avoided", "AVOIDED_CATEGORY"]]);
    assert.equal(decideGroup([foods[4]], { budget: 50000, noSpicy: true, avoidCategories: [] }).finalists.length, 1);
    assert.deepEqual(decideGroup([foods[1]], { budget: 300000, noSpicy: false, avoidCategories: [] }).finalists, []);
});
