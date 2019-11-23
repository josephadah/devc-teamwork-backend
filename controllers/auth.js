const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const userController = require("../controllers/user");

const postUser = async (req, res) => {
  try {
    const {firstName, lastName, email, password, gender, jobRole, department, address } = req.body;

    const user = await userController.getUserByEmail(email);

    if (user)
      return res.status(400).json({
        status: "error",
        data: { message: `User with email: ${email} already exist` }
      });

    const salt = await bcrypt.genSalt(10);
    const saltedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users ("firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [firstName, lastName, email, saltedPassword, gender, jobRole, department, address]
    );

    const newUser = result.rows[0];

    const token = generateToken(newUser);

    res.status(201).json({
      status: "success",
      data: {
        message: "User account successfully created",
        token,
        userId: newUser.userId
      }
    });
  } catch (err) {
    throw err;
  }
};

const signIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await userController.getUserByEmail(email);
    if (!user) return res.status(400).json({"status": "error", "data": {"message": "Invalid login credential/s"}});

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({"status": "error", "data": {"message": "Invalid login credential/s"}});

    const token = generateToken(user);
    res.status(200).json({"status": "success", "data": {"token": token, "userId": user.userId}});
  } catch (error) {
    throw error;
  }
}

const generateToken = user => {
  try {
    return jwt.sign(
      {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.jobRole === "admin"
      },
      process.env.JWT_PRIVATE_KEY
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postUser,
  signIn
};
