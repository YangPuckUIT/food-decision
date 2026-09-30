const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Food Decision API is running!");
});

module.exports = app;