const express = require("express");
const ctrl = require("../controllers/articles");
const router = express.Router();

// GET all articles
router.get("/", ctrl.getAllArticles);

// GET single article by id
router.get("/:id", ctrl.getArticle);

// POST article
router.post("/", ctrl.postArticle);

// PATCH article
router.patch("/:id", ctrl.editArticle);

// DELETE article
router.delete("/:id", ctrl.deleteArticle);

// POST comment
router.post("/:id/comment", ctrl.postComment);

module.exports = router;
