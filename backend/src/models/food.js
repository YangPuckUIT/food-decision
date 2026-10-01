const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    meal: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("food", foodSchema);