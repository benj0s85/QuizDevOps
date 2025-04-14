const { getAttemptsByUser, getAttemptsByQuiz } = require('../services/quizAttemptService');

exports.getUserAttempts = async (req, res) => {
  try {
    const attempts = await getAttemptsByUser(req.params.id);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizAttempts = async (req, res) => {
  try {
    const attempts = await getAttemptsByQuiz(req.params.id);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
