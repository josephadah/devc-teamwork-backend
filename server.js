const express = require("express");
var bodyParser = require('body-parser');
const config = require("config");
const dotenv = require("dotenv");
const { resolve } = require("path");

const app = express();

dotenv.config();
app.use(express.static(resolve(__dirname, 'src/public')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
