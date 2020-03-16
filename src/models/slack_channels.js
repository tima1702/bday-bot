'use strict';
module.exports = (sequelize, DataTypes) => {
  const Slack_Channels = sequelize.define(
    'Slack_Channels',
    {
      channel_id: DataTypes.STRING,
      name: DataTypes.STRING,
      name_normalized: DataTypes.STRING,
      is_channel: DataTypes.BOOLEAN,
      weather_city: DataTypes.STRING,
      creator: DataTypes.STRING,
      members: DataTypes.STRING,
    },
    {},
  );
  Slack_Channels.associate = function(models) {
    // associations can be defined here
  };
  return Slack_Channels;
};
