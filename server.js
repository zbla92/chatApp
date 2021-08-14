const express = require('express');
const path = require('path');
const cors = require('cors');

const bcrypt = require('bcrypt');
const { User } = require('./models');

const userRouter = require('./routes/user');

const app = express();
var http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// server-side
io.on('connection', (socket) => {
  socket.on('chat', (arg) => {
    console.log(arg); // world
  });
});

// setTimeout(function () {
//   console.log('Saying hello');
//   socket.emit('ping', { message: 'Hello from server ' + Date.now() });
// }, 1000);

app.use('/user', userRouter);

server.listen(PORT, console.log(`Server running at port ${PORT}`));
