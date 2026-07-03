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
    const { id } = req.params;
    const { title, isbn, publish_year, author_id, publisher_id } = req.body;
    const result = await pool.query(
      `
        UPDATE books
        SET title = $1, isbn = $2, publish_year = $3, author_id = $4, publisher_id = $5
        WHERE id = $6
        RETURNING *
      `,
      [title, isbn, publish_year, author_id, publisher_id, id],
    );
    if (result.rowCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Book not found",
      });
    }
    res.status(StatusCodes.OK).json({
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
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM book_copies WHERE book_id = $1 RETURNING *`, [id])
    const result = await pool.query(
      `
        DELETE FROM books
        WHERE id = $1
        RETURNING *
      `,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Book not found",
      });
    }
    res.status(200).json({
      success: true,
      msg: "Book deleted successfully",
      book: result.rows[0],
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};
const getBookDetails = async (req, res) => {
  try {
   const result = await pool.query(`
      SELECT
        books.id,
        books.title,
        books.isbn,
        books.publish_year,
        authors.name AS author,
        publishers.name AS publisher,
        COUNT(book_copies.id) FILTER (WHERE book_copies.status = 'available') AS available_copies
        FROM books
        JOIN authors ON books.author_id = authors.id
        JOIN publishers ON books.publisher_id = publishers.id
        LEFT JOIN book_copies ON book_copies.book_id = books.id
        GROUP BY books.id, authors.name, publishers.name
        ORDER BY books.id ASC;
    `)
    res.status(StatusCodes.OK).json({
      success:true,
      book:result.rows
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { getBooks, createBook, updateBook, deleteBook, getBookDetails };
