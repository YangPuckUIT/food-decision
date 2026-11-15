const CATEGORIES = ["noodle-soup", "rice", "fast-food", "hotpot-grill", "street-snack", "other"];
const ALIASES = new Map([
    ["Noodle Soup", "noodle-soup"],
    ["Rice", "rice"],
    ["Fast Food", "fast-food"],
    ["Hotpot & Grill", "hotpot-grill"],
    ["Snacks", "street-snack"]
]);

function normalizeCategories(value) {
    if (!Array.isArray(value)) return null;
    const categories = value.map(item => ALIASES.get(item) ?? item);
    if (!categories.every(item => typeof item === "string" && CATEGORIES.includes(item)) ||
        new Set(categories).size !== categories.length) return null;
    return categories;
}

module.exports = { CATEGORIES, normalizeCategories };
