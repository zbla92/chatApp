"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Messages", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			conversationId: {
				type: Sequelize.STRING,
			},
			recipientId: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			senderId: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			message: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			edited: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			read: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			seen: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Messages");
	},
};
