'use strict';

const http = require('http');
const { Server } = require('socket.io');
const gofEvents = require('./events/gof.event');

// Servidor HTTP con Socket.IO; el frontend corre en localhost:3000
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', gofEvents);

module.exports = { server };
