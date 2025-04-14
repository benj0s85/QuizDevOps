const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuiz
  } = require('../services/quizService');
  
  
  // Créer un quiz
  exports.createQuiz = async (req, res) => {
    try {
      const { theme, questions } = req.body;
      const quiz = await createQuiz(theme, questions);
      res.status(201).json({ message: 'Quiz créé avec succès', quizId: quiz.id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Obtenir tous les quiz
  exports.getAllQuizzes = async (req, res) => {
    try {
      const quizzes = await getAllQuizzes();
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Obtenir un quiz
  exports.getQuizById = async (req, res) => {
    try {
      const quiz = await getQuizById(req.params.id);
      res.json(quiz);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  
  // Mettre à jour un quiz
  exports.updateQuiz = async (req, res) => {
    try {
      const { theme, questions } = req.body;
      await updateQuiz(req.params.id, theme, questions);
      res.json({ message: 'Quiz mis à jour avec succès' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Supprimer un quiz
  exports.deleteQuiz = async (req, res) => {
    try {
      await deleteQuiz(req.params.id);
      res.json({ message: 'Quiz supprimé avec succès' });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  
  exports.submitQuiz = async (req, res) => {
    try {
      const quizId = req.params.id;
      const answers = req.body.answers;
      const userId = req.userId;
      const result = await submitQuiz(quizId, answers, userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };