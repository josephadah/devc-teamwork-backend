const { pool } = require("../config/db");
const { dataUri } = require("../middlewares/multer");
const { uploader} = require("../config/cloudinaryConfig");

const getAllGif = (req, res) => {
  try {
    pool.query("SELECT * FROM gifs", (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ status: "success", data: results.rows });
    });
  } catch (error) {
    throw error;
  }
};

const postGif = (req, res, next) => {
    try {
        if (req.file) {
            console.log(req.file);
            if (req.file.mimetype !== "image/gif") return res.status(400).json({"status": "error", "error": "only gif images are allowed"});
            const file = dataUri(req).content;
            return uploader.upload(file).then(result => {
                const imgUrl = result.url;
                pool.query(
                    `INSERT INTO gifs ("title", "imageUrl", "userId") VALUES ($1, $2, $3) RETURNING *`,
                    [req.body.title, imgUrl, req.user.userId],
                    (error, result) => {
                      if (error) throw error;
                      const { gifId, createdOn, title, imageUrl } = result.rows[0];
                      res.status(201).json({
                        status: "success",
                        data: {
                          gifId,
                          message: "GIF image successfully posted",
                          createdOn,
                          title,
                          imageUrl
                        }
                      });
                    }
                  );
            }).catch(err => res.status(500).json({"status":"error", "error": "unable to upload gif"}));
        }

    } catch (error) {
        throw error;
    }

  }

module.exports = {getAllGif, postGif}