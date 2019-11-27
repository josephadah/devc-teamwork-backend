const { pool } = require("../config/db");
const { dataUri } = require("../middlewares/multer");
const { uploader } = require("../config/cloudinaryConfig");

const getAllGif = (req, res, next) => {
  try {
    pool.query(
      `SELECT * FROM gifs ORDER BY "createdOn" DESC`,
      (error, results) => {
        if (error) return next(error);
        res.status(200).json({ status: "success", data: results.rows });
      }
    );
  } catch (error) {
    next(error);
  }
};

const getGif = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    pool.query(
      `SELECT * FROM gifs WHERE "gifId" = $1`,
      [id],
      (error, results) => {
        if (error) return next(error);

        const gif = results.rows[0];

        if (!gif)
          return res
            .status(404)
            .json({ status: "error", error: "gif not found" });

        pool.query(
          `SELECT * FROM comments WHERE "gifId" = $1`,
          [id],
          (err, resp) => {
            if (err) return next(error);
            const comments = resp.rows.map(x => {
              return {
                commentId: x.commentId,
                comment: x.comment,
                authorId: x.authorId
              };
            });

            res.status(200).json({
              status: "success",
              data: {
                id: gif.gifId,
                createdOn: gif.createdOn,
                title: gif.title,
                url: gif.imageUrl,
                comments: comments
              }
            });
          }
        );
      }
    );
  } catch (error) {
    next(error);
  }
};

const postGif = (req, res, next) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== "image/gif")
        return res
          .status(400)
          .json({ status: "error", error: "only gif images are allowed" });
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(result => {
          const { url, public_id } = result;
          pool.query(
            `INSERT INTO gifs ("title", "imageUrl", "userId", "publicId") VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.body.title, url, req.user.userId, public_id],
            (error, result) => {
              if (error) return next(error);
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
        })
        .catch(err =>
          res
            .status(500)
            .json({ status: "error", error: "unable to upload gif" })
        );
    }
  } catch (error) {
    next(error);
  }
};

const deleteGif = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    pool.query(
      `SELECT * FROM gifs WHERE "gifId" = $1`,
      [id],
      (error, results) => {
        if (error) return next(error);
        const gif = results.rows[0];
        if (gif) {
          if (gif.userId !== req.user.userId)
            return res
              .status(400)
              .json({ status: "error", error: "operation denied" });
          return uploader
            .destroy(gif.publicId)
            .then(response => {
              pool.query(
                `DELETE FROM gifs WHERE "gifId" = $1`,
                [id],
                (error, result) => {
                  if (error) return next(error);
                  res.status(200).json({
                    status: "success",
                    data: {
                      message: "Gif successfully deleted"
                    }
                  });
                }
              );
            })
            .catch(err =>
              res.status(500).json({
                status: "error",
                error: "server error. unable to delete gif"
              })
            );
        } else {
          res.status(404).json({ status: "error", error: "gif not found" });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const postComment = (req, res, next) => {
  try {
    const { comment } = req.body;
    const gifId = parseInt(req.params.id, 10);
    const authorId = req.user.userId;

    pool.query(
      `INSERT INTO comments (comment, "authorId", "gifId") VALUES ($1, $2, $3) RETURNING *`,
      [comment, authorId, gifId],
      (error, result) => {
        if (error) return next(error);

        const { createdOn } = result.rows[0];

        pool.query(
          `SELECT * FROM gifs WHERE "gifId" = $1`,
          [gifId],
          (err, response) => {
            if (err) return next(err);
            const gif = response.rows[0];
            res.status(201).json({
              status: "success",
              data: {
                message: "Comment successfully created",
                createdOn,
                gifTitle: gif.title,
                comment
              }
            });
          }
        );
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllGif, postGif, getGif, deleteGif, postComment };
