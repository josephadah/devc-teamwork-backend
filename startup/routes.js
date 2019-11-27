const authenticate = require("../middlewares/authenticate");
const articles = require("../routes/articles");
const gif = require("../routes/gif");
const auth = require("../routes/auth");
const ctrl = require("../controllers/common");

module.exports = function(app) {
  app.get("/api/v1/feed", authenticate, ctrl.getFeed);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/gifs", authenticate, gif);
  app.use("/api/v1/articles", authenticate, articles);
};
