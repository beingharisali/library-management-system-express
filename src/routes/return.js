const express = require("express");
const router = express.Router();
const { returnBook } = require("../controllers/return");

router.post("/", returnBook);

module.exports = router;
