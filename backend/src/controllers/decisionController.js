const { normalizeCategories } = require("../config/foodCategories");
const decisionService = require("../services/decisionService");
const idPattern = /^[a-f\d]{24}$/i;
const budgetValid = value => Number.isInteger(value) && value >= 20000 && value <= 300000;
const invalid = (res, field) => res.status(400).json({ error: { code: "INVALID_INPUT", message: `Invalid input: ${field}` } });

async function recommendations(req, res) {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== "object") return invalid(res, "body");
    if (!budgetValid(body.budget)) return invalid(res, "budget");
    const categories = normalizeCategories(body.categories);
    if (categories === null) return invalid(res, "categories");
    if (![0, 1, 2].includes(body.spicy)) return invalid(res, "spicy");
    if (![1, 2, 3].includes(body.fullness)) return invalid(res, "fullness");
    return res.json({ data: await decisionService.recommend({ ...body, categories }) });
}

async function groupDecision(req, res) {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== "object") return invalid(res, "body");
    if (!Array.isArray(body.foodIds) || body.foodIds.length < 2 || body.foodIds.length > 12 ||
        !body.foodIds.every(id => typeof id === "string" && idPattern.test(id))) return invalid(res, "foodIds");
    const ids = body.foodIds.map(id => id.toLowerCase());
    if (new Set(ids).size !== ids.length) return invalid(res, "foodIds");
    if (!budgetValid(body.budget)) return invalid(res, "budget");
    const noSpicy = body.noSpicy === undefined ? false : body.noSpicy;
    const avoidCategories = normalizeCategories(body.avoidCategories === undefined ? [] : body.avoidCategories);
    if (typeof noSpicy !== "boolean") return invalid(res, "noSpicy");
    if (avoidCategories === null) return invalid(res, "avoidCategories");
    return res.json({ data: await decisionService.group(ids, { ...body, noSpicy, avoidCategories }) });
}

module.exports = { recommendations, groupDecision };
