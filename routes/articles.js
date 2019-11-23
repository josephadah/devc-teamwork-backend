const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/articles");

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

module.exports = router;
