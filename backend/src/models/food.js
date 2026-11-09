const mongoose = require("mongoose");

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const CATEGORIES = ["noodle-soup", "rice", "fast-food", "hotpot-grill", "street-snack"];

const isInteger = {
    validator: Number.isInteger,
    message: "{PATH} must be an integer"
};

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    meal: {
        type: [String],
        required: true,
        enum: MEALS,
        validate: {
            validator: (value) => Array.isArray(value) && value.length > 0,
            message: "meal must have at least one value"
        }
    },
    price: { type: Number, required: true, min: 20000, max: 300000, validate: isInteger },
    calories: { type: Number, required: true, min: 0, validate: isInteger },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
    imageUrl: {
        type: String,
        required: true,
        match: /^\/images\/foods\/[a-z0-9]+(?:-[a-z0-9]+)*\.png$/
    },
    category: { type: String, required: true, enum: CATEGORIES },
    spicy: { type: Number, required: true, enum: [0, 1, 2] },
    fullness: { type: Number, required: true, enum: [1, 2, 3] }
});

module.exports = mongoose.model("food", foodSchema);
module.exports.MEALS = MEALS;
module.exports.CATEGORIES = CATEGORIES;