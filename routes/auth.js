const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth");

// POST article
router.post("/create-user", ctrl.postUser);

module.exports = router;
