const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');

router.get('/user/:id', attemptController.getUserAttempts);
router.get('/quiz/:id', attemptController.getQuizAttempts);

module.exports = router;
