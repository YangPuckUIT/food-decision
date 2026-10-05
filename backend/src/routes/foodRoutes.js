const express = require("express");
const Food = require("../models/food");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get foods"
        });
    }
});

module.exports = router;