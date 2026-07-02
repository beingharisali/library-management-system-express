const { StatusCodes } = require("http-status-codes");
const pool = require("../config/db");
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT books.id, books.title, books.ISBN, books.publish_year, authors.id AS author_id, authors.name AS author_name, publishers.id AS publisher_id, publishers.name AS publisher_name FROM books
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
    const { title, isbn, publish_year, author_id, publisher_id } = req.body;
    const result = await pool.query(
      `
        INSERT INTO books (title, isbn, publish_year, author_id, publisher_id) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [title, isbn, publish_year, author_id, publisher_id],
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      book: result.rows[0],
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
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
