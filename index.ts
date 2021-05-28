import http from 'http';
import express from 'express'
import { userSocketIO } from './src/helpers/socket.io';

const app = express();

const server = http.createServer(app);
server.listen(4001, () => {
    console.log('listening server on 4001');
});

userSocketIO(server);
