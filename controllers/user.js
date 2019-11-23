const { pool } = require("../config/db");

const getUserByEmail = async email => {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE "email" = $1`,
      [email]
    );
    return response.rows[0];
  } catch (err) {
    return;
  }
};

module.exports = { getUserByEmail };
