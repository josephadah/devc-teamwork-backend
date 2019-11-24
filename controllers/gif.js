const { pool } = require("../config/db");
const { dataUri } = require("../middlewares/multer");
const { uploader} = require("../config/cloudinaryConfig");

const getAllGif = (req, res) => {
  try {
    pool.query(`SELECT * FROM gifs ORDER BY "createdOn" DESC`, (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ status: "success", data: results.rows });
    });
  } catch (error) {
    throw error;
  }
};

const getGif = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    pool.query(`SELECT * FROM gifs WHERE "gifId" = $1`, [id], (error, results) => {
      if (error) throw error;
      res.status(200).json({ status: "success", data: results.rows });
    });
  } catch (error) {
    throw error;
  }
};

const postGif = (req, res, next) => {
    try {
        if (req.file) {
            if (req.file.mimetype !== "image/gif") return res.status(400).json({"status": "error", "error": "only gif images are allowed"});
            const file = dataUri(req).content;
            return uploader.upload(file).then(result => {
                const {url, public_id } = result;
                pool.query(
                    `INSERT INTO gifs ("title", "imageUrl", "userId", "publicId") VALUES ($1, $2, $3, $4) RETURNING *`,
                    [req.body.title, url, req.user.userId, public_id],
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

const deleteGif = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    pool.query(`SELECT * FROM gifs WHERE "gifId" = $1`, [id], (error, results) => {
      if (error) throw error;
      const gif = results.rows[0];
      if (gif) {
        if (gif.userId !== req.user.userId) return res.status(400).json({"status":"error", "error": "operation denied"});
        return uploader.destroy(gif.publicId).then(response => {
          pool.query(`DELETE FROM gifs WHERE "gifId" = $1`, [id], (error, result) => {
              if (error) throw error;
              res.status(200).json({
                status: "success",
                data: {
                  message: "Gif successfully deleted"
                }
              });
            }
          );
        }).catch(err => res.status(500).json({"status":"error", "error": "server error. unable to delete gif"}))
      } else {
        res.status(404).json({ status: "error", "error": "gif not found" });
      }
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {getAllGif, postGif, getGif, deleteGif}