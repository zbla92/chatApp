/**
 * standardizeMessage - Standardizes message and strips unnecessary data
 * @param   {Object}  user  Full user object
 * @returns {Object}        Stripped down message object
 */
exports.standardizeMessage = (message) => ({
	message: message.message || null,
	senderId: message.senderId || null,
	recipientId: message.recipientId || null,
	edited: message.edited || null,
	read: message.read || null,
	seen: message.seen || null,
	time: message.createdAt || null,
});

exports.standardizeMessages = (data) => {
	const { rows, maxPage, count } = data;

	return {
		count: count || null,
		maxPage: maxPage || null,
		messages: rows.map((message) => this.standardizeMessage(message)),
	};
};

exports.generateConversationId = (recipientId, senderId) => {
	if (recipientId && senderId) {
		const higher = recipientId >= senderId ? recipientId : senderId;
		const lower = recipientId < senderId ? recipientId : senderId;
		return `${higher}n${lower}`;
	}
};
