const { CATEGORIES } = require("../config/foodCategories");

const completeFood = food => Number.isSafeInteger(food.price) && food.price >= 0 &&
    CATEGORIES.includes(food.category) && [0, 1, 2].includes(food.spicy) && [1, 2, 3].includes(food.fullness);

function scoreFood(food, input) {
    const reasons = ["WITHIN_BUDGET"];
    const reasonDetails = [{ code: "WITHIN_BUDGET", points: 0, message: `Within budget: ${food.price} VND` }];
    let score = 0;
    if (!input.categories.length || input.categories.includes(food.category)) {
        score += 40;
        if (input.categories.length) reasons.push("CATEGORY_MATCH");
        reasonDetails.push({
            code: input.categories.length ? "CATEGORY_MATCH" : "CATEGORY_ANY",
            points: 40,
            message: input.categories.length ? `Matches your craving: ${food.category}` : "Any category is welcome"
        });
    }
    for (const field of ["spicy", "fullness"]) {
        const gap = Math.abs(food[field] - input[field]);
        score += gap === 0 ? 30 : gap === 1 ? 15 : 0;
        if (gap < 2) {
            const code = `${field.toUpperCase()}_${gap === 0 ? "MATCH" : "CLOSE"}`;
            reasons.push(code);
            reasonDetails.push({ code, points: gap === 0 ? 30 : 15, message: `${field === "spicy" ? "Spice level" : "Fullness"} ${gap === 0 ? "just right" : "close"}` });
        }
    }
    return { food, score, reasons, reasonDetails };
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
