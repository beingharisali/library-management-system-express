// src/routes/bookRoutes.js
const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books");

const router = express.Router();

router.get("/", getBooks);
router.post("/", createBook);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;