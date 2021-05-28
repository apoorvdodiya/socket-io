import { Server } from "http";

export const userSocketIO = (server: Server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket: any) => {
        console.log('user connected');
        socket.on('new message', (message: any) => {
            console.log('message ', message);
        });
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });

}