var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3001,
    bodyParser = require('body-parser');

clients = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/exif-js/'));

var routes = require('./routes/routes');
routes(app);

io.on('connection', function(client){
    client.on('join', function(id) {
        console.log(`${id} joined`);
        client.uid = id;
        var test = {socket: client.id, uid: id}
        clients[id] = client;
    });

    client.on('disconnect', function () {
        delete clients[client.uid];
        console.log("user disconnected");
    });
});

http.listen(port, '0.0.0.0');

console.log('api server started on: ' + port);
