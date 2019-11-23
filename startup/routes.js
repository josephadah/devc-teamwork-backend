const express = require("express");
const articles = require("../routes/articles");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/v1/articles", articles);
  app.use("/api/v1/auth", auth);
};
