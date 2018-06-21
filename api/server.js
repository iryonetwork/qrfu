const app = require('./app'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3001,
    socket = require('./socket');

io.on('connection', socket.setupClient);

http.listen(port, '0.0.0.0');

console.log('api server started on: ' + port);