const express = require("express");
const cors = require("cors");
const decisionRoutes = require("./routes/decisionRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

app.use(
    cors({
        origin: (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173").split(",").map(value => value.trim()).filter(Boolean)
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Decision API is running!");
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/foods", foodRoutes);

app.use("/api", decisionRoutes);
app.use((req, res) => res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: "Route not found." } }));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const malformed = error.type === "entity.parse.failed";
    const tooLarge = error.type === "entity.too.large";
    res.status(malformed ? 400 : tooLarge ? 413 : 500).json({ error: {
        code: malformed || tooLarge ? "INVALID_INPUT" : "INTERNAL_SERVER_ERROR",
        message: malformed ? "Invalid input: JSON body" : tooLarge ? "Request body is too large." : "An unexpected server error occurred."
    } });
});

module.exports = app;
