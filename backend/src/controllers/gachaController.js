const { randomFood } = require("../services/foodService");

async function roll(req, res) {
    const value = req.query.budget;
    const budget = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
    if (!Number.isInteger(budget) || budget < 20000 || budget > 300000) {
        return res.status(400).json({ error: { code: "INVALID_INPUT", message: "Invalid input: budget" } });
    }
    const food = await randomFood({ price: { $lte: budget } });
    if (!food) {
        return res.status(404).json({ error: { code: "FOOD_NOT_FOUND", message: "No foods match the selected budget." } });
    }
    return res.json({ data: food });
}

module.exports = { roll };
