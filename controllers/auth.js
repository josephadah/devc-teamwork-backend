const { pool } = require("../config/db");

const postUser = (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      jobRole,
      department,
      address
    } = req.body;

    pool.query(
      `INSERT INTO users ("firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        firstName,
        lastName,
        email,
        password,
        gender,
        jobRole,
        department,
        address
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        const { userId } = result.rows[0];
        res.status(201).json({
          status: "success",
          data: {
            message: "User account successfully created",
            token: "token here",
            userId
          }
        });
      }
    );
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postUser
};
