const express = require("express");
const ctrl = require("../controllers/gif");
const { multerUploads } = require("../middlewares/multer");
const { cloudinaryConfig } = require("../config/cloudinaryConfig");
const router = express.Router();

// GET all gifs
router.get("/", ctrl.getAllGif);

// GET single gif by id
router.get("/:id", ctrl.getGif);

// POST gif
router.post("/", [cloudinaryConfig, multerUploads], ctrl.postGif);

// DELETE gif
router.delete("/:id", cloudinaryConfig, ctrl.deleteGif);

module.exports = router;
