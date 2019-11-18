const { pool } = require("../config/db");

const getAllPosts = (req, res) => {
  pool.query("SELECT * FROM customers", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getAllPosts
};
