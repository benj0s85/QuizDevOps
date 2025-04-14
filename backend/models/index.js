const sequelize = require('../config/database');
const Quiz = require('./quiz');
const Question = require('./question');
const Option = require('./option');
const User = require('./user'); // Ajout du modèle User

Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

Question.hasMany(Option, { onDelete: 'CASCADE' });
Option.belongsTo(Question);

const models = { Quiz, Question, Option, User };

if (User.associate) {
    User.associate(models);
}

module.exports = { sequelize, ...models };