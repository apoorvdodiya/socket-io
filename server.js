const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('server is up');
})

server.listen(4000);