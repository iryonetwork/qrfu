var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/exif-js/'));
app.use('/scripts', express.static(__dirname + '/node_modules/cropperjs/dist'));

var routes = require('./routes/routes');
routes(app);

module.exports = app;