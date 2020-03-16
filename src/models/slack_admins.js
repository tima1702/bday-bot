'use strict';
module.exports = (sequelize, DataTypes) => {
  const Slack_Admins = sequelize.define(
    'Slack_Admins',
    {
      channel_id: DataTypes.STRING,
      admin_id: DataTypes.STRING,
    },
    {},
  );
  Slack_Admins.associate = function(models) {
    // associations can be defined here
  };
  return Slack_Admins;
};
