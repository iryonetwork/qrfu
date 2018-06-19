import io from 'socket.io-client';

export default class Socket {
    constructor() {
        if (!this.socket) {
            this.socket = io();
        }
    }

    join(uid, ratio, filetype, multiple) {
        const self = this;

		this.socket.on('connect', function() {
			self.socket.emit('join', uid, ratio, filetype, multiple);
        });
        
        this.socket.emit('join', uid, ratio, filetype, multiple);
    }

    receive(func) {
        this.socket.on('messages', func);
    }

    disconnect() {
        this.socket.disconnect();
    }
}