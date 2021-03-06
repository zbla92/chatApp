const { Server } = require("socket.io");
const { Message } = require("../models");

exports.activeConnections = {};

const getSocketIdFromUserId = (userId) => this.activeConnections[userId].id;

/**
 * @param {object} server instance of server craeted with http.createServer
 */
exports.socketIO = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		const { userId, userEmail, name, profilePicture } =
			socket.handshake.query;
		this.activeConnections[userId] = {
			id: socket.id,
			userId,
			userEmail,
			name,
			profilePicture:
				profilePicture !== "undefined" ? profilePicture : null,
			online: true,
		};

		socket.broadcast.emit("friend_connected", {
			userId,
			userEmail,
			name,
			online: true,
		});

		socket.on("disconnect", (args) => {
			delete this.activeConnections[socket.handshake.query.userId];
			socket.disconnect(0);
			socket.broadcast.emit("friend_disconnected", {
				userId: socket.handshake.query.userId,
			});
		});

		socket.on("end", (args) => {
			socket.disconnect(0);
		});

		socket.on("direct_message", async (data) => {
			const result = await Message.create({
				recipientId: data.recipientId,
				senderId: data.senderId,
				message: data.message,
			});
			console.log(result, "rezultati");

			io.to(getSocketIdFromUserId(data.recipientId)).emit(
				"direct_message",
				{
					id: data.id,
					message: data.message,
					senderId: data.senderId,
					recipientId: data.recipientId,
					edited: null,
					read: null,
					seen: null,
					time: result.createdAt,
				}
			);
		});
	});
};
