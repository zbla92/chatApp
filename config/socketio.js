const { Server } = require('socket.io');

const activeConnections = {};

/**
 * @param {object} server instance of server craeted with http.createServer
 */
exports.socketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(socket.id, 'connected ');

    const { userId, userEmail } = socket.handshake.query;
    activeConnections[userId] = { id: socket.id, userEmail };

    socket.on('chat', (args) => {
      console.log(args); // world

      socket.emit('testBruh', { who: activeConnections });
    });

    socket.on('disconnect', (args) => {
      delete activeConnections[socket.handshake.query.userId];
    });
  });
};
