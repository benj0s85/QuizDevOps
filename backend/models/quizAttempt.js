const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = QuizAttempt;
