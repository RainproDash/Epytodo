const express = require('express');
const app = express();
const verifyToken = require("./middleware/auth").verifyToken
var bcrypt = require('bcryptjs');
require('dotenv').config();
const port = process.env.PORT;
const host = process.env.MYSQL_HOST;
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  verifyToken(req, res, next);
});

require('./routes/auth/auth')(app, bcrypt);
require('./routes/user/user')(app, bcrypt);
require('./routes/todos/todos')(app, bcrypt);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Epytodo listening at http://${host}:${port}`);
});
