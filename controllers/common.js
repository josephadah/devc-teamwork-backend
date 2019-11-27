const { pool } = require("../config/db");

const getUserByEmail = async email => {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE "email" = $1`,
      [email]
    );
    return response.rows[0];
  } catch (err) {
    return;
  }
};

const getFeed = async (req, res) => {
  try {
    pool.query(`SELECT * FROM articles`, (err, results) => {
      let articles = results.rows;

      if (articles && articles.length > 0) {
        articles = articles.map(x => {
          return {
            id: x.articleId,
            createdOn: x.createdOn,
            title: x.title,
            article: x.article,
            authorId: x.userId
          };
        });
      }

      pool.query(`SELECT * FROM gifs`, (er, response) => {
        let gifs = response.rows;

        if (gifs && gifs.length > 0) {
          gifs = gifs.map(x => {
            return {
              id: x.gifId,
              createdOn: x.createdOn,
              title: x.title,
              url: x.imageUrl,
              authorId: x.userId
            };
          });
        }

        let feed = [...articles, ...gifs];
        feed = feed.sort((a, b) => b.createdOn - a.createdOn);

        res.status(200).json({ status: "success", data: feed });
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserByEmail, getFeed };
