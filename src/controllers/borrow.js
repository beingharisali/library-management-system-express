const { StatusCodes } = require("http-status-codes");
const pool = require("../config/db");
const borrowBook = async (req, res) => {
  const client = await pool.connect();
  try {
    const { member_id, book_copy_id, due_date } = req.body;
    if (!member_id || !book_copy_id || !due_date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "member id, book copy id, due date are required",
      });
    }
    await client.query("BEGIN");
    const memberResult = await client.query(
      `SELECT id, name FROM members WHERE id = $1`,
      [member_id],
    );
    if (memberResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Member not found",
      });
    }
    const copyResult = await client.query(
      `SELECT id, status FROM book_copies WHERE id = $1`,
      [book_copy_id],
    );
    if (copyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Book copy not found",
      });
    }
    const bookCopy = copyResult.rows[0];
    if (bookCopy.status !== "available") {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Book copy is not available",
      });
    }

    const borrowResult = await client.query(
      `
                INSERT INTO borrow_record (member_id, book_copy_id, due_date)
                VALUES($1, $2, $3)
                RETURNING *
            `,
      [member_id, book_copy_id, due_date],
    );

    await client.query(
      `
                UPDATE book_copies
                SET status = 'borrowed'
                WHERE id = $1
            `,
      [book_copy_id],
    );
    await client.query("COMMIT");
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Book borrowed successfully",
      borrow: borrowResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};
module.exports = { borrowBook };
