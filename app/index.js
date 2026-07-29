"use strict";

try {
  const events = require("./events/gof.event");
  // Creamos el servidor
  const server = require("http").createServer();
  // Instanciamos el socket
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", events);

  module.exports = { server };
} catch (_error) {
  console.error("Error trycatch index", _error);
}
