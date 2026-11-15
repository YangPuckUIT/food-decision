const Food = require("../models/food");

async function randomFood(match) {
    const [food] = await Food.aggregate([
        { $match: match },
        { $sample: { size: 1 } }
    ]);
    return food;
}

module.exports = { randomFood };
