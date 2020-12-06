const express = require('express');
const app = express();
const db = require('./src/models');
const bodyParser = require('body-parser');
const treasureController = require('./src/controllers/controller.js');
const httpStatusCodes = require('http-status-codes');
const constants = require('./src/utilities/constants.js');

const dependencies = {};
dependencies[constants.HTTP_STATUS_CODES] = httpStatusCodes;
global.__basedir = __dirname + '/..';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true }));

//db.sequelizedb.sync();

const treasurecontroller = new treasureController(app, dependencies);
let port = 3000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
