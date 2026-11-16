const router = require("express").Router();
const { recommendations, groupDecision } = require("../controllers/decisionController");

router.post("/recommendations", recommendations);
router.post("/group-decision", groupDecision);

module.exports = router;
