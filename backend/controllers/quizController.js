const { Quiz, Question, Option } = require('../models');

// Create quiz with question and options
exports.createQuiz = async (req, res) => {
  const { theme, questions } = req.body;

  if (!theme || !questions || questions.length < 3 || questions.length > 10) {
    return res.status(400).json({ error: 'Le quiz doit avoir entre 3 et 10 questions et un thème.' });
  }

  try {
    const newQuiz = await Quiz.create({ theme });

    for (const q of questions) {
      if (!q.options || q.options.length < 3 || q.options.length > 5) {
        return res.status(400).json({ error: 'Chaque question doit avoir entre 3 et 5 options.' });
      }

      const correctOptions = q.options.filter(opt => opt.isCorrect === true);
      if (correctOptions.length !== 1) {
        return res.status(400).json({ error: 'Chaque question doit avoir UNE SEULE bonne réponse.' });
      }

      const newQuestion = await Question.create({
        questionText: q.questionText,
        QuizId: newQuiz.id
      });

      for (const opt of q.options) {
        await Option.create({
          text: opt.text,
          isCorrect: opt.isCorrect,
          QuestionId: newQuestion.id
        });
      }
    }

    res.status(201).json({ message: 'Quiz créé avec succès', quizId: newQuiz.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création du quiz" });
  }
};

// Récupérer tous les quiz
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: {
        model: Question,
        include: [Option]
      }
    });

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des quizs" });
  }
};

// Récupérer un seul quiz
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: {
        model: Question,
        include: [Option]
      }
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du quiz" });
  }
};

// Mettre à jour un quiz
exports.updateQuiz = async (req, res) => {
    const { theme, questions } = req.body;
  
    try {
      const quiz = await Quiz.findByPk(req.params.id, {
        include: {
          model: Question,
          include: [Option]
        }
      });
  
      if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' });
  
      // Update du thème du quiz
      await quiz.update({ theme });
  
      // Supprimer les anciennes questions + options
      for (const question of quiz.Questions) {
        await Option.destroy({ where: { QuestionId: question.id } });
        await Question.destroy({ where: { id: question.id } });
      }
  
      // Créer les nouvelles questions + options
      for (const q of questions) {
        if (!q.options || q.options.length < 3 || q.options.length > 5) {
          return res.status(400).json({ error: 'Chaque question doit avoir entre 3 et 5 options.' });
        }
  
        const correctOptions = q.options.filter(opt => opt.isCorrect === true);
        if (correctOptions.length !== 1) {
          return res.status(400).json({ error: 'Chaque question doit avoir UNE SEULE bonne réponse.' });
        }
  
        const newQuestion = await Question.create({
          questionText: q.questionText,
          QuizId: quiz.id
        });
  
        for (const opt of q.options) {
          await Option.create({
            text: opt.text,
            isCorrect: opt.isCorrect,
            QuestionId: newQuestion.id
          });
        }
      }
  
      res.json({ message: 'Quiz mis à jour avec succès' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  };  

// Supprimer un quiz et ses dépendances
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' });

    await quiz.destroy();
    res.json({ message: 'Quiz supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
