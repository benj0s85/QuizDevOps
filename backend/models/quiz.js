const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Quiz;
