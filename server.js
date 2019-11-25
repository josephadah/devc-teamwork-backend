const express = require("express");
var bodyParser = require('body-parser');
const config = require("config");
const cors = require('cors');
const dotenv = require("dotenv");
const { resolve } = require("path");
const { pool } = require("./config/db");

const app = express();

dotenv.config();
app.use(express.static(resolve(__dirname, 'src/public')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

require("./startup/routes")(app);



// just for test
const getBooks = (request, response) => {
    pool.query('SELECT * FROM books', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const addBook = (request, response) => {
    const { author, title } = request.body
  
    pool.query('INSERT INTO books (author, title) VALUES ($1, $2)', [author, title], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Book added.' })
    })
  }
  
  app
    .route('/books')
    // GET endpoint
    .get(getBooks)
    // POST endpoint
    .post(addBook)



const port = process.env.PORT || config.get("port");

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
