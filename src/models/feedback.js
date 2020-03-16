'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'Feedback',
    {
      slackUserId: DataTypes.STRING,
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      message: DataTypes.STRING,
      tags: DataTypes.STRING,
    },
    {},
  );
  Feedback.associate = function(models) {
    // associations can be defined here
  };
  return Feedback;
};
