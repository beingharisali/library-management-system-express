const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookDetails,
} = require("../controllers/books");

const router = express.Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get('/details', getBookDetails)
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;