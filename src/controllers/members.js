const { StatusCodes } = require("http-status-codes");
const pool = require("../config/db");

const getMemberHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        members.name AS member_name,
        books.title,
        book_copies.copy_number,
        borrow_record.borrow_date,
        borrow_record.due_date,
        borrow_record.return_date
        FROM borrow_record
        JOIN members ON borrow_record.member_id = members.id
        JOIN book_copies ON borrow_record.book_copy_id = book_copies.id
        JOIN books ON book_copies.book_id = books.id
        WHERE members.id = $1
        ORDER BY borrow_record.borrow_date DESC;
    `, [id]);
    res.status(StatusCodes.OK).json({
      success: true,
      book: result.rows,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { getMemberHistory };
