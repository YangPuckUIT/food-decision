const express = require("express");
const foodRoutes = require("./routes/foodRoutes");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Decision API is running!");
});

app.use("/api/foods", foodRoutes);

module.exports = app;