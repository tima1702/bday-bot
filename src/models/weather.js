'use strict';
module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define(
    'Weather',
    {
      city_name: DataTypes.STRING,
      temp: DataTypes.NUMBER,
      temp_feels_like: DataTypes.NUMBER,
      wind_speed: DataTypes.NUMBER,
      wind_deg: DataTypes.NUMBER,
      dt: DataTypes.NUMBER,
      last_update: DataTypes.NUMBER,
    },
    {},
  );
  Weather.associate = function(models) {
    // associations can be defined here
  };
  return Weather;
};
