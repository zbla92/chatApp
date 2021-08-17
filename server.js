const express = require('express');
const cors = require('cors');
var http = require('http');

const { socketIO } = require('./config/socketio');
const userRouter = require('./routes/user');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

socketIO(server);

app.use('/user', userRouter);

server.listen(PORT, console.log(`Server running at port ${PORT}`));
