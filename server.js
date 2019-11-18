const express = require("express");
const { Pool } = require("pg");
const config = require("config");

const app = express();

require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");

// const pool = new Pool({
//   user: "josephadah",
//   host: "localhost",
//   database: "testing",
//   password: "password",
//   port: "5432"
// });

// pool.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
