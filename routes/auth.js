const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth");

// Create user
router.post("/create-user", ctrl.postUser);

// Signin user
router.post("/signin", ctrl.signIn);

module.exports = router;
