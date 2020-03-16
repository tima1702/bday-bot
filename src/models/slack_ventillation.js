'use strict';
module.exports = (sequelize, DataTypes) => {
  const Slack_Ventillation = sequelize.define(
    'Slack_Ventillation',
    {
      channel_id: DataTypes.STRING,
      notification_type: DataTypes.STRING,
      time_hour: DataTypes.NUMBER,
      time_minute: DataTypes.NUMBER,
      duration_minute: DataTypes.NUMBER,
      week_day_monday: DataTypes.BOOLEAN,
      week_day_tuesday: DataTypes.BOOLEAN,
      week_day_wednesday: DataTypes.BOOLEAN,
      week_day_thursday: DataTypes.BOOLEAN,
      week_day_friday: DataTypes.BOOLEAN,
      week_day_saturday: DataTypes.BOOLEAN,
      week_day_sunday: DataTypes.BOOLEAN,
    },
    {},
  );
  Slack_Ventillation.associate = function(models) {
    // associations can be defined here
  };
  return Slack_Ventillation;
};
