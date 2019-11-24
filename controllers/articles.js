const { pool } = require("../config/db");

const getAllArticles = (req, res) => {
  try {
    pool.query("SELECT * FROM articles", (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ status: "success", data: results.rows });
    });
  } catch (error) {
    throw error;
  }
};

const getArticle = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    pool.query(`SELECT * FROM articles WHERE "articleId" = $1`, [id],
      (error, results) => {
        if (error) throw error;
        res.status(200).json({ status: "success", data: results.rows });
      }
    );
  } catch (err) {
    throw err;
  }
};

const postArticle = (req, res) => {
  try {
    const { title, article } = req.body;
    pool.query(
      `INSERT INTO articles (title, article, "userId") VALUES ($1, $2, $3) RETURNING *`,
      [title, article, req.user.userId],
      (error, result) => {
        if (error) {
          throw error;
        }
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
    throw err;
  }
};

const editArticle = (req, res) => {
  try {
    const { title, article } = req.body;
    const id = parseInt(req.params.id, 10);

    pool.query(`SELECT * FROM articles WHERE "articleId" = $1`, [id],
      (error, results) => {
        if (error) throw error;
        const dbArticle =results.rows[0];
        if (dbArticle.userId !== req.user.userId) return res.status(400).json({"status":"error", "error": "operation denied"});
        
        pool.query(
          `UPDATE articles SET title = $1, article = $2 WHERE "articleId" = $3`,
          [title, article, id],
          (error, result) => {
            if (error) throw error;
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
    throw err;
  }
};

const deleteArticle = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    pool.query(`SELECT * FROM articles WHERE "articleId" = $1`, [id], (error, results) => {
      if (error) throw error;
      const article = results.rows[0];
      if (article) {
        if (article.userId !== req.user.userId) return res.status(400).json({"status":"error", "error": "operation denied"});
        
        pool.query(`DELETE FROM articles WHERE "articleId" = $1`, [id], (error, result) => {
            if (error) throw error;
            res.status(200).json({
              status: "success",
              data: {
                message: "Article successfully deleted"
              }
            });
          }
        );
      } else {
        res.status(404).json({ status: "error", "error": "article not found" });
      }
    }
  );

  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllArticles,
  getArticle,
  postArticle,
  editArticle,
  deleteArticle
};
