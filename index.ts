import http from 'http';
import express from 'express'

const app = express();
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// });
const server = http.createServer(app);
server.listen(4000, () => {
    console.log('listening server on 4000');
});
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket: any) => {
    console.log('user connected ');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});
io.on('message', (message: any) => {
    console.log('user connected ', message);
});


// server.listen(4000, () => {
//     console.log('listening server on 4000');
// });