const { QuizAttempt, Quiz } = require('../models');

// Enregistrer une tentative
const recordAttempt = async (userId, quizId, score, total) => {
  return await QuizAttempt.create({
    UserId: userId,
    QuizId: quizId,
    score,
    total
  });
};

// Tentatives d’un utilisateur
const getAttemptsByUser = async (userId) => {
  return await QuizAttempt.findAll({
    where: { UserId: userId },
    include: [{ model: Quiz }]
  });
};

// Tentatives d’un quiz
const getAttemptsByQuiz = async (quizId) => {
  return await QuizAttempt.findAll({
    where: { QuizId: quizId },
    include: ['User']
  });
};

module.exports = {
  recordAttempt,
  getAttemptsByUser,
  getAttemptsByQuiz
};
