const pool = require("../config/db");
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(`
SELECT
    b.id,
    b.title,
    b.isbn,
    a.name AS author,
    p.name AS publisher,
    COUNT(bc.id) FILTER (WHERE bc.status = 'available') AS available_copies
  FROM books b
  JOIN authors a ON b.author_id = a.id
  JOIN publishers p ON b.publisher_id = p.id
  LEFT JOIN book_copies bc ON bc.book_id = b.id
  GROUP BY b.id, a.name, p.name
  ORDER BY b.id ASC
`);
    res.status(200).json({
      success: true,
      books: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getBooks };
