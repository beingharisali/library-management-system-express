const pool = require("../config/db");
const { StatusCodes } = require("http-status-codes");

const returnBook = async (req, res) => {
  const client = await pool.connect();

  try {
    const { book_copy_id } = req.body;

    if (!book_copy_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "book_copy_id is required",
      });
    }

    await client.query("BEGIN");

    const copyResult = await client.query(
      `
      SELECT id, status
      FROM book_copies
      WHERE id = $1
      `,
      [book_copy_id]
    );

    if (copyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Book copy not found",
      });
    }

    const activeBorrowResult = await client.query(
      `
      SELECT id, book_copy_id, member_id, borrow_date, due_date, return_date
      FROM borrow_record
      WHERE book_copy_id = $1
      AND return_date IS NULL
      `,
      [book_copy_id]
    );

    if (activeBorrowResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This book copy is not currently borrowed",
      });
    }

    const activeBorrow = activeBorrowResult.rows[0];

    const updatedBorrowResult = await client.query(
      `
      UPDATE borrow_record
      SET return_date = CURRENT_DATE
      WHERE id = $1
      RETURNING *
      `,
      [activeBorrow.id]
    );

    const updatedCopyResult = await client.query(
      `
      UPDATE book_copies
      SET status = 'available'
      WHERE id = $1
      RETURNING *
      `,
      [book_copy_id]
    );

    await client.query("COMMIT");

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Book returned successfully",
      borrow_record: updatedBorrowResult.rows[0],
      book_copy: updatedCopyResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = { returnBook };