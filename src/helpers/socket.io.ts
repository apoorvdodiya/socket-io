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
        if (socket.handshake.auth.sessionId) {
            if (!DBService.getSession(socket.handshake.auth.sessionId)) {
                socket.sessionId = null;
                socket.emit('error', 'user does not exists');
                
                return next();
            }
            socket.sessionId = socket.handshake.auth.sessionId;
            socket.userId = DBService.getSession(socket.handshake.auth.sessionId)
            socket.userName = DBService.getUser(socket.userId)
            return next();
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
            return next();
        }
    })
    io.on('connection', (socket: ExtendedSocket) => {
        socket.emit('session', {
            sessionId: socket.sessionId,
            userId: socket.userId,
            userName: socket.userName,
        });
        socket.on('message', (message: any) => {
            console.log('message ', message);
            DBService.addMessage(message);
            socket.broadcast.emit('new message', message);
        });
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });

}