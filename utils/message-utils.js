/**
 * standardizeMessage - Standardizes message and strips unnecessary data
 * @param   {Object}  user  Full user object
 * @returns {Object}        Stripped down message object
 */
exports.standardizeMessage = (message) => ({
	id: message.id || null,
	message: message.message || null,
	senderId: message.senderId || null,
	recipientId: message.recipientId || null,
	edited: message.edited || null,
	read: message.read || null,
	seen: message.seen || null,
	time: message.createdAt || null,
});

exports.standardizeMessages = (data) => {
	const { rows, maxPage, count, currentPage, messagesOffset } = data;

	return {
		count: count || 0,
		maxPage: maxPage || 0,
		currentPage: currentPage || 0,
		messagesOffset: messagesOffset || 0,
		messages: rows
			.map((message) => this.standardizeMessage(message))
			.reverse(),
	};
};

exports.generateConversationId = (recipientId, senderId) => {
	if (recipientId && senderId) {
		const higher = recipientId >= senderId ? recipientId : senderId;
		const lower = recipientId < senderId ? recipientId : senderId;
		return `${higher}n${lower}`;
	}
};
