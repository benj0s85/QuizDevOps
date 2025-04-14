const sequelize = require('../config/database');
const Quiz = require('./quiz');
const Question = require('./question');
const Option = require('./option');
const User = require('./user');
const QuizAttempt = require('./quizAttempt');

Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

Question.hasMany(Option, { onDelete: 'CASCADE' });
Option.belongsTo(Question);

Quiz.belongsTo(User, { foreignKey: 'UserId', as: 'creator' });

User.hasMany(QuizAttempt, { foreignKey: 'UserId' });
QuizAttempt.belongsTo(User, { foreignKey: 'UserId' });

Quiz.hasMany(QuizAttempt, { foreignKey: 'QuizId' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'QuizId' });


const models = { Quiz, Question, Option, User, QuizAttempt };

if (User.associate) {
    User.associate(models);
}

module.exports = { sequelize, ...models };