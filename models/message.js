const { Model } = require("sequelize");
const { generateConversationId } = require("../utils/message-utils");

module.exports = (sequelize, DataTypes) => {
	class Message extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Message.init(
		{
			recipientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: true,
				},
			},
			senderId: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: true,
				},
			},
			conversationId: {
				type: DataTypes.STRING,
			},
			message: DataTypes.STRING,
			edited: DataTypes.BOOLEAN,
			read: DataTypes.BOOLEAN,
			seen: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "Message",
		}
	);

	Message.prototype.getConversationId = generateConversationId;

	Message.beforeSave(async (message, options) => {
		message.conversationId = message.getConversationId(
			message.recipientId,
			message.senderId
		);
	});

	return Message;
};
