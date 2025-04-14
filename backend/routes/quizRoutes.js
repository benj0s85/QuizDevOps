const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { submitQuiz } = require('../controllers/quizController');

// Créer un quiz avec questions + options
router.post('/', quizController.createQuiz);

// Récupérer tous les quiz
router.get('/', quizController.getAllQuizzes);

// Récupérer un seul quiz par ID
router.get('/:id', quizController.getQuizById);

// Mettre à jour un quiz
router.put('/:id', quizController.updateQuiz);

// Supprimer un quiz
router.delete('/:id', quizController.deleteQuiz);

router.post('/:id/submit', submitQuiz);

module.exports = router;
