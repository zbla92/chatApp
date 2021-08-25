const { Server } = require('socket.io');

const activeConnections = {};

const getSocketIdFromUserId = (userId) => {
  return activeConnections[userId].id;
};

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
    socket.emit('online_friends', {
      friends: Object.values(activeConnections),
    });

    const { userId, userEmail, name, profilePicture } = socket.handshake.query;
    activeConnections[userId] = {
      id: socket.id,
      userId,
      userEmail,
      name,
      profilePicture: profilePicture !== 'undefined' ? profilePicture : null,
    };

    setInterval(() => {
      socket.emit('online_friends', {
        friends: Object.values(activeConnections),
      });
    }, 5000);

    socket.on('disconnect', (args) => {
      delete activeConnections[socket.handshake.query.userId];
      socket.disconnect(0);
    });

    socket.on('end', (args) => {
      socket.disconnect(0);
    });

    socket.on('direct_message', (data) => {
      io.to(getSocketIdFromUserId(data.toUserId)).emit('direct_message', {
        message: data.message,
        from: data.fromUserId,
      });
    });
  });
};
