const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/routes');

const app = express();

mongoose.Promise = global.Promise;

// console.log(`[${process.env.NODE_ENV}]`);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/muber')
    .then(() => console.log('Database connected...'))
    .catch(e => console.log('Database connection error: ', e));
}

//
// middleware must be called before our application
//
app.use(bodyParser.json());

// this is our app
//
// we have to call next() in our route controllers if there is any error
// otherwise, the following error handling middleware won't get called
//
routes(app);

// error handling middleware
//
app.use((err, req, res, next) => {
  // console.log('******** ', err);
  res.status(422).send({ error: err.message });
});

module.exports = app;
