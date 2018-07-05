import io from 'socket.io-client';

export default class Socket {
    constructor() {
        if (!this.socket) {
            this.socket = io(process.env.REACT_APP_QR_URL || '127.0.0.1:3001');
        }
    }

    join(uid, ratio, filetype, multiple, onDisconnect, onReconnect) {
        const self = this;

		this.socket.on('connect', () => self.socket.emit('join', uid, ratio, filetype, multiple));

        this.socket.on('disconnect', onDisconnect);
    
        this.socket.on('reconnect', onReconnect);
        
        this.socket.emit('join', uid, ratio, filetype, multiple);
    }

    receive(callback) {
        this.socket.on('messages', callback);
    }

    disconnect() {
        this.socket.disconnect();
    }
}