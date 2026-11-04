const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/food");

const router = express.Router();

const getQueryValues = (value) => {
    if (value === undefined) {
        return [];
    }

    const values = Array.isArray(value) ? value : [value];

    return values
        .flatMap((item) => String(item).split(","))
        .map((item) => item.trim())
        .filter(Boolean);
};

const parseNonNegativeInteger = (value) => {
    if (value === undefined) {
        return undefined;
    }

    const text = String(value);

    if (!/^\d+$/.test(text)) {
        return null;
    }

    const number = Number(text);

    return Number.isSafeInteger(number) ? number : null;
};

router.get("/random", async (req, res) => {
    try {
        const match = {};

        const cuisines = getQueryValues(req.query.cuisine);
        const meals = getQueryValues(req.query.meal);
        const tags = getQueryValues(req.query.tags).map((tag) =>
            tag.toLowerCase()
        );

        if (cuisines.length > 0) {
            match.cuisine = { $in: cuisines };
        }

        if (meals.length > 0) {
            match.meal = { $in: meals };
        }

        if (tags.length > 0) {
            match.tags = { $in: tags };
        }

        const maxPrice = parseNonNegativeInteger(req.query.maxPrice);
        const maxCalories = parseNonNegativeInteger(req.query.maxCalories);

        if (maxPrice === null || maxCalories === null) {
            return res.status(400).json({
                error: {
                    code: "INVALID_FILTER",
                    message: "maxPrice and maxCalories must be non-negative integers."
                }
            });
        }

        if (maxPrice !== undefined) {
            match.price = { $lte: maxPrice };
        }

        if (maxCalories !== undefined) {
            match.calories = { $lte: maxCalories };
        }

        const excludeId = req.query.excludeId;

        if (excludeId !== undefined) {
            if (
                Array.isArray(excludeId) ||
                !mongoose.Types.ObjectId.isValid(excludeId)
            ) {
                return res.status(400).json({
                    error: {
                        code: "INVALID_EXCLUDE_ID",
                        message: "excludeId must be a valid food ID."
                    }
                });
            }

            match._id = {
                $ne: new mongoose.Types.ObjectId(excludeId)
            };
        }

        const [food] = await Food.aggregate([
            { $match: match },
            { $sample: { size: 1 } }
        ]);

        if (!food) {
            return res.status(404).json({
                error: {
                    code: "FOOD_NOT_FOUND",
                    message: "No foods match the selected filters."
                }
            });
        }

        return res.status(200).json({ data: food });
    } catch (error) {
        console.error("Failed to get random food:", error.message);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to get a random food."
            }
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const foods = await Food.find();
        return res.json(foods);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get foods"
        });
    }
});

module.exports = router;