const Food = require("../models/food");
const { completeFood, rankFoods, decideGroup } = require("./decision");
const ApiError = require("../utils/ApiError");

async function recommend(input) {
    const foods = await Food.find({ price: { $lte: input.budget } }).lean();
    return rankFoods(foods, input);
}

async function group(ids, input) {
    const foods = await Food.find({ _id: { $in: ids } }).lean();
    if (foods.length !== ids.length) {
        throw new ApiError(400, "UNKNOWN_FOOD_ID", "One or more foods no longer exist.");
    }
    if (foods.some(food => !completeFood(food))) {
        throw new ApiError(409, "INCOMPLETE_FOOD_DATA", "Some selected foods need category, spicy and fullness data before group selection.");
    }
    const byId = new Map(foods.map(food => [String(food._id), food]));
    return decideGroup(ids.map(id => byId.get(id)), input);
}

module.exports = { recommend, group };
