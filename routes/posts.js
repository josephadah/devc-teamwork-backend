const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/posts");

// GET: All posts
router.get("/", ctrl.getAllPosts);

module.exports = router;
