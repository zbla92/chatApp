const express = require("express");
const cors = require("cors");
const http = require("http");

const { socketIO } = require("./config/socketio");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const friendsRouter = require("./routes/friends");
const messagesRouter = require("./routes/message");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

socketIO(server);

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/friends", friendsRouter);
app.use("/messages", messagesRouter);

server.listen(PORT, console.log(`Server running at port ${PORT}`));
