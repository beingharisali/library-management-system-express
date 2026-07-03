const express = require("express");
const { getMemberHistory } = require("../controllers/members.js");

const router = express.Router();

router.get("/:id/history", getMemberHistory);

module.exports = router;