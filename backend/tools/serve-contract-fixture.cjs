// Local-only Postman fixture. Never load .env or the production server bootstrap.
const mongoose = require("mongoose");
const Food = require("../src/models/food");
const app = require("../src/app");

mongoose.connect = () => { throw new Error("MongoDB connections are disabled in the contract fixture"); };
const makeFood = (number, name, price, category, spicy, fullness) => ({
    _id: number.toString(16).padStart(24, "0"), name, price, category, spicy, fullness,
    cuisine: "Vietnamese", meal: ["Lunch"], calories: 450, tags: [], imageUrl: "", description: "Offline contract fixture."
});
const foods = [
    makeFood(1, "Phở Bò", 45000, "noodle-soup", 0, 2),
    makeFood(2, "Bún Bò Huế", 50000, "noodle-soup", 2, 2),
    makeFood(3, "Cơm Tấm", 40000, "rice", 0, 3),
    makeFood(4, "Lẩu Thái", 200000, "hotpot-grill", 2, 3),
    makeFood(5, "Duck Confit", 350000, "other", 0, 3),
    ...Array.from({ length: 7 }, (_, i) => makeFood(i + 6, `Fixture ${i + 6}`, 100000, "other", 1, 2))
];

Food.find = filter => {
    let result = foods.filter(food => !filter?.price || food.price <= filter.price.$lte)
        .filter(food => !filter?._id || filter._id.$in.includes(food._id));
    return {
        sort() { result = [...result].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, "vi")); return this; },
        async lean() { return result; }
    };
};
Food.findById = id => ({ async lean() { return foods.find(food => food._id === id.toLowerCase()) || null; } });
Food.aggregate = async pipeline => {
    const match = pipeline[0].$match;
    const eligible = foods.filter(food => (!match.price || food.price <= match.price.$lte) &&
        (!match.calories || food.calories <= match.calories.$lte) &&
        (!match.cuisine || match.cuisine.$in.includes(food.cuisine)) &&
        (!match.meal || food.meal.some(value => match.meal.$in.includes(value))) &&
        (!match.tags || food.tags.some(value => match.tags.$in.includes(value))) &&
        (!match._id || food._id !== String(match._id.$ne)));
    return eligible.length ? [eligible[Math.floor(Math.random() * eligible.length)]] : [];
};

const server = app.listen(3001, "127.0.0.1", () => {
    console.log("Offline contract fixture: http://127.0.0.1:3001 (12 in-memory foods, MongoDB disabled)");
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
