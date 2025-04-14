const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { models } = require('../models/');

const Quiz = sequelize.define('Quiz', {
  theme: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Quiz.associate = (models) => {
  Quiz.belongsTo(models.User, {
    foreignKey: 'UserId',
    as: 'creator'
  });
};

module.exports = Quiz;
