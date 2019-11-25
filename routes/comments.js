const express = require("express");
const ctrl = require("../controllers/comments");
const router = express.Router();

// GET all comments
router.get("/", ctrl.getAllArticles);

// GET single comment by id
router.get("/:id", ctrl.getArticle);

// POST comment
router.post("/", ctrl.postArticle);

// PATCH comment
router.patch("/:id", ctrl.editArticle);

// DELETE comment
router.delete("/:id", ctrl.deleteArticle);

module.exports = router;
