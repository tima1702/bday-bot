'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Slack_Channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      channel_id: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      name_normalized: {
        type: Sequelize.STRING,
      },
      is_channel: {
        type: Sequelize.BOOLEAN,
      },
      weather_city: {
        type: Sequelize.STRING,
      },
      creator: {
        type: Sequelize.STRING,
      },
      members: {
        type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Slack_Channels');
  },
};
