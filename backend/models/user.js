const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
        type: DataTypes.ENUM('joueur', 'createur', 'administrateur'),
        defaultValue: 'joueur'
      }
});

 User.associate = (models) => {
   User.hasMany(models.Quiz, {
     foreignKey: 'UserId',
     as: 'quizzes'
   });
 };

module.exports = User;