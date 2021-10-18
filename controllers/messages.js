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
	const { recipientId, senderId, page, messagesOffset = 0 } = req.body;

	const limit = 10;
	const recalculatedMessagesOffset = messagesOffset % limit;

	const offsetPage = Math.floor(messagesOffset / limit);

	const offset = (page + offsetPage - 1) * limit + recalculatedMessagesOffset;

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
		result.currentPage = page + offsetPage;
		result.messagesOffset = recalculatedMessagesOffset;
		result.perPage = limit;

		res.json(standardizeMessages(result));
		res.status(200);
	} catch (error) {
		res.json({ error });
		res.status(500);
	}
};
