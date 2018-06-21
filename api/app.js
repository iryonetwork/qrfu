var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3001,
    bodyParser = require('body-parser'),
    socket = require('./socket');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/exif-js/'));
app.use('/scripts', express.static(__dirname + '/node_modules/cropperjs/dist'));

var routes = require('./routes/routes');
routes(app);

io.on('connection', socket.setupClient);

http.listen(port, '0.0.0.0');

console.log('api server started on: ' + port);

module.exports = app; // for testing