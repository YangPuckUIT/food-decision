const Food = require("../models/food");

async function randomFood(match) {
    const [food] = await Food.aggregate([
        { $match: match },
        { $sample: { size: 1 } }
    ]);
    return food;
}

function listFoods() {
    return Food.find().sort({ price: 1, name: 1, _id: 1 }).lean();
}

function getFood(id) {
    return Food.findById(id).lean();
}

module.exports = { randomFood, listFoods, getFood };
