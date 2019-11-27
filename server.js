const express = require("express");
var bodyParser = require('body-parser');
const config = require("config");
const cors = require('cors');
const dotenv = require("dotenv");
const { resolve } = require("path");

const app = express();

dotenv.config();
app.use(express.static(resolve(__dirname, 'src/public')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

require("./startup/routes")(app);

// Global error handling
app.use((err, req, res, next) => {
  if (!err) next();
  console.log("Error: ", err.message);
  res.status(500).json({status: "error", error: "Unexpected server error."});
});

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
