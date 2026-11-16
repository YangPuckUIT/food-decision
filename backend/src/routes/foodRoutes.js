const router = require("express").Router();
const { random, list, detail } = require("../controllers/foodController");

router.get("/random", random);
router.get("/", list);
router.get("/:id", detail);

module.exports = router;
