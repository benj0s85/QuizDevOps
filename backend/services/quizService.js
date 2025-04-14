const { Quiz, Question, Option } = require('../models');
const { recordAttempt } = require('./quizAttemptService');

// Créer un quiz
const createQuiz = async (theme, questions) => {
    if (!theme || !questions || questions.length < 3 || questions.length > 10) {
      throw new Error('Le quiz doit avoir entre 3 et 10 questions et un thème.');
    }
  
    for (const q of questions) {
      if (!q.options || q.options.length < 3 || q.options.length > 5) {
        throw new Error('Chaque question doit avoir entre 3 et 5 options.');
      }
  
      const correctOptions = q.options.filter(opt => opt.isCorrect === true);
      if (correctOptions.length !== 1) {
        throw new Error('Chaque question doit avoir UNE SEULE bonne réponse.');
      }
    }
  
    const newQuiz = await Quiz.create({ theme });
  
    for (const q of questions) {
      const newQuestion = await Question.create({
        questionText: q.questionText,
        QuizId: newQuiz.id,
      });
  
      for (const opt of q.options) {
        await Option.create({
          text: opt.text,
          isCorrect: opt.isCorrect,
          QuestionId: newQuestion.id,
        });
      }
    }
  
    return newQuiz;
  };  

// Obtenir tous les quiz
const getAllQuizzes = async () => {
  return await Quiz.findAll({
    include: {
      model: Question,
      include: [Option],
    },
  });
};

// Obtenir un quiz par ID
const getQuizById = async (id) => {
  const quiz = await Quiz.findByPk(id, {
    include: {
      model: Question,
      include: [Option],
    },
  });

  if (!quiz) throw new Error('Quiz non trouvé');
  return quiz;
};

// Mettre à jour un quiz
const updateQuiz = async (id, theme, questions) => {
  const quiz = await Quiz.findByPk(id, {
    include: {
      model: Question,
      include: [Option],
    },
  });

  if (!quiz) throw new Error('Quiz non trouvé');
  await quiz.update({ theme });

  for (const question of quiz.Questions) {
    await Option.destroy({ where: { QuestionId: question.id } });
    await Question.destroy({ where: { id: question.id } });
  }

  for (const q of questions) {
    if (!q.options || q.options.length < 3 || q.options.length > 5) {
      throw new Error('Chaque question doit avoir entre 3 et 5 options.');
    }

    const correctOptions = q.options.filter(opt => opt.isCorrect === true);
    if (correctOptions.length !== 1) {
      throw new Error('Chaque question doit avoir UNE SEULE bonne réponse.');
    }

    const newQuestion = await Question.create({
      questionText: q.questionText,
      QuizId: quiz.id,
    });

    for (const opt of q.options) {
      await Option.create({
        text: opt.text,
        isCorrect: opt.isCorrect,
        QuestionId: newQuestion.id,
      });
    }
  }

  return quiz;
};

// Supprimer un quiz
const deleteQuiz = async (id) => {
  const quiz = await Quiz.findByPk(id);
  if (!quiz) throw new Error('Quiz non trouvé');
  await quiz.destroy();
};

const submitQuiz = async (quizId, answers, userId) => {
  const quiz = await Quiz.findByPk(quizId, {
    include: {
      model: Question,
      include: [Option],
    },
  });

  if (!quiz) throw new Error('Quiz non trouvé');

  let score = 0;
  const results = [];

  for (const userAnswer of answers) {
    const question = quiz.Questions.find(q => q.id === userAnswer.questionId);
    if (!question) continue;

    const correctOption = question.Options.find(opt => opt.isCorrect);
    const isCorrect = correctOption?.text === userAnswer.selectedOption;
    if (isCorrect) score++;

    results.push({
      questionId: question.id,
      isCorrect,
      correctAnswer: correctOption?.text,
      userAnswer: userAnswer.selectedOption
    });
  }

  await recordAttempt(userId, quizId, score, quiz.Questions.length);

  return {
    score,
    total: quiz.Questions.length,
    results
  };
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz
};
