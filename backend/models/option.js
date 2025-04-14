const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Option = sequelize.define('Option', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Option;
