const router = require("express").Router();
const { roll } = require("../controllers/gachaController");

router.get("/", roll);

module.exports = router;
