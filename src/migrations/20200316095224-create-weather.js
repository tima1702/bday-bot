'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Weather', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      city_name: {
        type: Sequelize.STRING,
      },
      temp: {
        type: Sequelize.NUMBER,
      },
      temp_feels_like: {
        type: Sequelize.NUMBER,
      },
      wind_speed: {
        type: Sequelize.NUMBER,
      },
      wind_deg: {
        type: Sequelize.NUMBER,
      },
      dt: {
        type: Sequelize.NUMBER,
      },
      last_update: {
        type: Sequelize.NUMBER,
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
    return queryInterface.dropTable('Weather');
  },
};
