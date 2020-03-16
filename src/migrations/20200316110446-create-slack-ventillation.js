'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Slack_Ventillations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      channel_id: {
        type: Sequelize.STRING,
      },
      notification_type: {
        type: Sequelize.STRING,
      },
      time_hour: {
        type: Sequelize.NUMBER,
      },
      time_minute: {
        type: Sequelize.NUMBER,
      },
      duration_minute: {
        type: Sequelize.NUMBER,
      },
      week_day_monday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_tuesday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_wednesday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_thursday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_friday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_saturday: {
        type: Sequelize.BOOLEAN,
      },
      week_day_sunday: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('Slack_Ventillations');
  },
};
