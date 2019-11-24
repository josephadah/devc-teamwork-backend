const express = require("express");
const authenticate = require("../middlewares/authenticate");
const admin = require("../middlewares/admin");
const ctrl = require("../controllers/auth");
const router = express.Router();

// Create user
router.post("/create-user",  [authenticate, admin], ctrl.postUser);

// Signin user
router.post("/signin", ctrl.signIn);

module.exports = router;
