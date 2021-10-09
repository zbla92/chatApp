const { Message } = require("../models");
const {
	generateConversationId,
	standardizeMessages,
} = require("../utils/message-utils");

exports.postMessage = async (req, res) => {
	const { recipientId, senderId, content } = req.body;

	try {
		const result = await Message.create({
			recipientId,
			senderId,
			content,
		});

		res.json({ data: result });
		res.status(200);
	} catch (error) {
		res.json({ error });
		res.status(500);
	}
};

exports.getMessages = async (req, res) => {
	const { recipientId, senderId, page } = req.body;

	const limit = 10;
	const offset = (page - 1) * limit;

	try {
		const result = await Message.findAndCountAll({
			where: {
				conversationId: generateConversationId(recipientId, senderId),
			},
			limit,
			offset,
			order: [["id", "DESC"]],
		});

		result.maxPage = Math.ceil(result.count / limit);

		res.json({ data: standardizeMessages(result) });
		res.status(200);
	} catch (error) {
		res.json({ error });
		res.status(500);
	}
};
