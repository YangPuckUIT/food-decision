const express = require("express");
const Food = require("./models/food");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Decision API is running!");
});

app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get foods"
        });
    }
});

module.exports = app;