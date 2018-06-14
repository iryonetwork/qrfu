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
app.use('/scripts', express.static(__dirname + '/node_modules/cropperjs/dist'));

var routes = require('./routes/routes');
routes(app);

io.on('connection', function(client){
    client.on('join', function(id, ratio, filetype, multiple) {
        console.log(`${id} joined`);

        const data = {
            uid: id,
            ratio: ratio,
            filetype: filetype,
            multiple: multiple,
            socket: client,
        };

        clients[id] = data;
    });

    client.on('disconnect', function () {
        // there can be multiple users on one socket, make sure all are removed
        var keys = Object.keys(clients).filter( k => clients[k].socket.id === client.id );

        for (var i = 0; i < keys.length; i++) {
            delete clients[keys[i]];
            console.log(`${keys[i]} disconnected`);
        }
    });
});

http.listen(port, '0.0.0.0');

console.log('api server started on: ' + port);
