import io from 'socket.io-client';

export default class Socket {
    join(url, uid, ratio, filetype, multiple, onDisconnect, onReconnect) {
        if (!this.socket) {
            this.socket = io(url);
        }

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