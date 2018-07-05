var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/exif-js/'));
app.use('/scripts', express.static(__dirname + '/node_modules/cropperjs/dist'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
    next();
});

var routes = require('./routes/routes');
routes(app);

module.exports = app;