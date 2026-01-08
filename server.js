'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Import mongoose
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

// 2. Connect to MongoDB
// Use 127.0.0.1 instead of localhost for Node 18+ on Mac
mongoose.connect(process.env.DB)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

fccTestingRoutes(app);
apiRoutes(app);

app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app;