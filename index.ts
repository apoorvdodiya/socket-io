import http from 'http';
import express from 'express'

const app = express();

const server = http.createServer(app);
server.listen(4001, () => {
    console.log('listening server on 4001');
});
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket: any) => {
    console.log('user connected ', socket);
    socket.on('new message', (message: any) => {
        console.log('message ', message);
    });
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});
