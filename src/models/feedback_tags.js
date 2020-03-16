'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedback_Tags = sequelize.define(
    'Feedback_Tags',
    {
      name: DataTypes.STRING,
    },
    {},
  );
  Feedback_Tags.associate = function(models) {
    // associations can be defined here
  };
  return Feedback_Tags;
};
