const { pool } = require("../config/db");

const getAllArticles = (req, res, next) => {
  try {
    pool.query(
      `SELECT * FROM articles ORDER BY "createdOn" DESC`,
      (error, results) => {
        if (error) return next(error);
        res.status(200).json({ status: "success", data: results.rows });
      }
    );
  } catch (error) {
    next(error);
  }
};

const getArticle = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    pool.query(
      `SELECT * FROM articles WHERE "articleId" = $1`,
      [id],
      (error, results) => {
        if (error) return next(error);

        const article = results.rows[0];

        if (!article)
          return res
            .status(404)
            .json({ status: "error", error: "article not found" });

        pool.query(
          `SELECT * FROM comments WHERE "articleId" = $1`,
          [id],
          (err, resp) => {
            if (err) return next(err);
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
                id: article.articleId,
                createdOn: article.createdOn,
                title: article.title,
                article: article.article,
                comments: comments
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

const postArticle = (req, res, next) => {
  try {
    const { title, article } = req.body;
    pool.query(
      `INSERT INTO articles (title, article, "userId") VALUES ($1, $2, $3) RETURNING *`,
      [title, article, req.user.userId],
      (error, result) => {
        if (error) return next(error);

        const { articleId, createdOn } = result.rows[0];
        res.status(201).json({
          status: "success",
          data: {
            message: "Article successfully posted",
            articleId,
            createdOn,
            title
          }
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

const editArticle = (req, res, next) => {
  try {
    const { title, article } = req.body;
    const id = parseInt(req.params.id, 10);

    pool.query(
      `SELECT * FROM articles WHERE "articleId" = $1`,
      [id],
      (error, results) => {
        if (error) return next(error);
        const dbArticle = results.rows[0];
        if (dbArticle.userId !== req.user.userId)
          return res
            .status(400)
            .json({ status: "error", error: "operation denied" });

        pool.query(
          `UPDATE articles SET title = $1, article = $2 WHERE "articleId" = $3`,
          [title, article, id],
          (error, result) => {
            if (error) return next(error);
            res.status(200).json({
              status: "success",
              data: {
                message: "Article successfully updated",
                title,
                article
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

const deleteArticle = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    pool.query(
      `SELECT * FROM articles WHERE "articleId" = $1`,
      [id],
      (error, results) => {
        if (error) return next(error);
        const article = results.rows[0];
        if (article) {
          if (article.userId !== req.user.userId)
            return res
              .status(400)
              .json({ status: "error", error: "operation denied" });

          pool.query(
            `DELETE FROM articles WHERE "articleId" = $1`,
            [id],
            (error, result) => {
              if (error) return next(error);
              res.status(200).json({
                status: "success",
                data: {
                  message: "Article successfully deleted"
                }
              });
            }
          );
        } else {
          res.status(404).json({ status: "error", error: "article not found" });
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
    const articleId = parseInt(req.params.id, 10);
    const authorId = req.user.userId;

    pool.query(
      `INSERT INTO comments (comment, "authorId", "articleId") VALUES ($1, $2, $3) RETURNING *`,
      [comment, authorId, articleId],
      (error, result) => {
        if (error) return next(error);

        const { createdOn } = result.rows[0];

        pool.query(
          `SELECT * FROM articles WHERE "articleId" = $1`,
          [articleId],
          (err, response) => {
            if (err) return next(err);
            const article = response.rows[0];
            res.status(201).json({
              status: "success",
              data: {
                message: "Comment successfully created",
                createdOn,
                articleTitle: article.title,
                article: article.article,
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

module.exports = {
  getAllArticles,
  getArticle,
  postArticle,
  editArticle,
  deleteArticle,
  postComment
};
