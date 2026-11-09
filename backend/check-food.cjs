const assert = require("node:assert/strict");
const Food = require("./src/models/food");

const validFood = {
    name: "Phở bò",
    cuisine: "Vietnamese",
    meal: ["Lunch"],
    price: 45000,
    calories: 450,
    description: "Phở bò nóng.",
    tags: ["soup"],
    imageUrl: "/images/foods/pho-bo.png",
    category: "noodle-soup",
    spicy: 0,
    fullness: 2
};

const cases = [
    ["Dữ liệu hợp lệ", {}, null],
    ["Giá biên 20000", { price: 20000 }, null],
    ["Giá biên 300000", { price: 300000 }, null],
    ["Category lạ", { category: "drink" }, "category"],
    ["Spicy vượt giới hạn", { spicy: 3 }, "spicy"],
    ["Spicy số lẻ", { spicy: 1.5 }, "spicy"],
    ["Fullness sai", { fullness: 0 }, "fullness"],
    ["Meal sai", { meal: ["brunch"] }, "meal"],
    ["Meal rỗng", { meal: [] }, "meal"],
    ["Giá quá thấp", { price: 19999 }, "price"],
    ["Giá quá cao", { price: 300001 }, "price"],
    ["Giá số lẻ", { price: 45000.5 }, "price"],
    ["Calories âm", { calories: -1 }, "calories"],
    ["Calories số lẻ", { calories: 450.5 }, "calories"],
    ["Đường dẫn ảnh sai", { imageUrl: "/img/a.jpg" }, "imageUrl"],
    ["Thiếu ảnh", { imageUrl: undefined }, "imageUrl"]
];

async function main() {
    let failed = 0;

    for (const [label, changes, expectedField] of cases) {
        const food = new Food({ ...validFood, ...changes });
        let error;

        try {
            await food.validate();
        } catch (err) {
            error = err;
        }

        try {
            if (expectedField === null) {
                assert.equal(error, undefined);
            } else {
                const fields = Object.keys(error?.errors ?? {});
                assert.ok(
                    fields.some(
                        (field) =>
                            field === expectedField ||
                            field.startsWith(`${expectedField}.`)
                    ),
                    `Phải có lỗi ở field ${expectedField}`
                );
            }

            console.log(`PASS: ${label}`);
        } catch (err) {
            failed++;
            console.error(`FAIL: ${label} — ${err.message}`);
        }
    }

    console.log(`\nKết quả: ${cases.length - failed}/${cases.length} đạt.`);
    process.exitCode = failed ? 1 : 0;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});