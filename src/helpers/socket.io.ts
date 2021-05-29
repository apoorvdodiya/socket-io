import DBService from '../db/db.service';
import { Socket, Server } from 'socket.io';
import * as crypto from 'crypto';

type ExtendedSocket = Socket & any;

export const userSocketIO = (server: ExtendedSocket) => {
    const io: Server = require('socket.io')(server, {
        cors: {
            origin: '*'
        }
    });

    io.use((socket: ExtendedSocket, next) => {
        console.log('socket.handshake.auth ', socket.handshake.auth);
        
        if (socket.handshake.auth.sessionId) {
            socket.sessionId = socket.handshake.auth.sessionId;
            socket.userId = DBService.getSession(socket.handshake.auth.sessionId)
            socket.UserName = DBService.getUser(socket.userId)
            next();
        }
        if (socket.handshake.auth.userId) {
            let sid = crypto.randomBytes(8).toString('hex');
            DBService.setSession(
                sid,
                socket.handshake.auth.userId,
                socket.handshake.auth.userName
            );
            socket.sessionId = sid;
            socket.userId = socket.handshake.auth.userId;
            socket.userName = socket.handshake.auth.userName;
            next();
        }
    })
    io.on('connection', (socket: ExtendedSocket) => {
        console.log('socket', socket.sessionId);
        socket.emit('session', {
            sessionId: socket.sessionId,
            userId: socket.userId,
            userName: socket.userName,
        });
        socket.on('new message', (message: any) => {
            console.log('message ', message);
        });
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });

}