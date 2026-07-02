const { StatusCodes } = require("http-status-codes");
const pool = require("../config/db");
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT books.id, books.title, books.ISBN, books.publish_year, authors.name AS author_name, publishers.name AS publisher_name FROM books
        JOIN authors ON books.author_id = authors.id JOIN publishers ON books.publisher_id = publishers.id
      `);
    res.status(StatusCodes.OK).json({
      success: true,
      count: result.rowCount,
      books: result.rows,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};
const createBook = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateBook = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteBook = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getBooks, createBook, updateBook, deleteBook };
