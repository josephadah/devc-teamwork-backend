const multer = require("multer");
const path = require("path");
const Datauri = require("datauri");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
const dUri = new Datauri();

/**
* @description This function converts the buffer to data url
* @param {Object} req containing the field object
* @returns {String} The data url from the string buffer
*/
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = { multerUploads, dataUri };