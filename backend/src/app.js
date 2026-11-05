const express = require("express");
const cors = require("cors");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Decision API is running!");
});

app.use("/api/foods", foodRoutes);

module.exports = app;