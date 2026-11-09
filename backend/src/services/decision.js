const { CATEGORIES } = require("../models/food");

const completeFood = food => Number.isInteger(food.price) && food.price >= 20000 && food.price <= 300000 &&
    CATEGORIES.includes(food.category) && [0, 1, 2].includes(food.spicy) && [1, 2, 3].includes(food.fullness);

function scoreFood(food, input) {
    const reasons = ["WITHIN_BUDGET"];
    let score = 0;
    if (!input.categories.length || input.categories.includes(food.category)) {
        score += 40;
        if (input.categories.length) reasons.push("CATEGORY_MATCH");
    }
    for (const field of ["spicy", "fullness"]) {
        const gap = Math.abs(food[field] - input[field]);
        score += gap === 0 ? 30 : gap === 1 ? 15 : 0;
        if (gap < 2) reasons.push(`${field.toUpperCase()}_${gap === 0 ? "MATCH" : "CLOSE"}`);
    }
    return { food, score, reasons };
}

function rankFoods(foods, input) {
    return foods.filter(food => completeFood(food) && food.price <= input.budget)
        .map(food => scoreFood(food, input))
        .sort((a, b) => b.score - a.score || a.food.price - b.food.price || a.food.name.localeCompare(b.food.name, "vi") || String(a.food._id).localeCompare(String(b.food._id)))
        .slice(0, 3);
}

function decideGroup(foods, input) {
    const finalists = [];
    const eliminated = [];
    for (const food of foods) {
        const reason = food.price > input.budget ? "OVER_BUDGET"
            : input.noSpicy && food.spicy === 2 ? "TOO_SPICY"
            : input.avoidCategories.includes(food.category) ? "AVOIDED_CATEGORY" : null;
        if (reason) eliminated.push({ food, reason });
        else finalists.push(food);
    }
    return { finalists, eliminated };
}

module.exports = { completeFood, scoreFood, rankFoods, decideGroup };
