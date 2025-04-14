const sequelize = require('../config/database');
const Quiz = require('./quiz');
const Question = require('./question');
const Option = require('./option');

Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

Question.hasMany(Option, { onDelete: 'CASCADE' });
Option.belongsTo(Question);

module.exports = { sequelize, Quiz, Question, Option };
