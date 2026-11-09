const express = require("express");
const Food = require("../models/food");
const { completeFood, rankFoods, decideGroup } = require("../services/decision");
const router = express.Router();
const idPattern = /^[a-f\d]{24}$/i;
const budgetValid = value => Number.isInteger(value) && value >= 20000 && value <= 300000;
const categoriesValid = value => Array.isArray(value) && new Set(value).size === value.length && value.every(item => typeof item === "string" && Food.CATEGORIES.includes(item));
const invalid = (res, field) => res.status(400).json({ error: { code: "INVALID_INPUT", message: `Invalid input: ${field}` } });

router.post("/recommendations", async (req, res) => {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== "object") return invalid(res, "body");
    if (!budgetValid(body.budget)) return invalid(res, "budget");
    if (!categoriesValid(body.categories)) return invalid(res, "categories");
    if (![0, 1, 2].includes(body.spicy)) return invalid(res, "spicy");
    if (![1, 2, 3].includes(body.fullness)) return invalid(res, "fullness");
    const foods = await Food.find({ price: { $lte: body.budget } }).lean();
    return res.json({ data: rankFoods(foods, body) });
});

router.post("/group-decision", async (req, res) => {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== "object") return invalid(res, "body");
    if (!Array.isArray(body.foodIds) || body.foodIds.length < 2 || body.foodIds.length > 12 ||
        !body.foodIds.every(id => typeof id === "string" && idPattern.test(id))) return invalid(res, "foodIds");
    const ids = body.foodIds.map(id => id.toLowerCase());
    if (new Set(ids).size !== ids.length) return invalid(res, "foodIds");
    if (!budgetValid(body.budget)) return invalid(res, "budget");
    const noSpicy = body.noSpicy === undefined ? false : body.noSpicy;
    const avoidCategories = body.avoidCategories === undefined ? [] : body.avoidCategories;
    if (typeof noSpicy !== "boolean") return invalid(res, "noSpicy");
    if (!categoriesValid(avoidCategories)) return invalid(res, "avoidCategories");
    const foods = await Food.find({ _id: { $in: ids } }).lean();
    if (foods.length !== ids.length) return res.status(400).json({ error: { code: "UNKNOWN_FOOD_ID", message: "One or more foods no longer exist." } });
    if (foods.some(food => !completeFood(food))) return res.status(409).json({ error: { code: "INCOMPLETE_FOOD_DATA", message: "Some selected foods need category, spicy and fullness data before group selection." } });
    const byId = new Map(foods.map(food => [String(food._id), food]));
    return res.json({ data: decideGroup(ids.map(id => byId.get(id)), { ...body, noSpicy, avoidCategories }) });
});

module.exports = router;
