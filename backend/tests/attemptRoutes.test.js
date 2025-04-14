const request = require('supertest');
const express = require('express');
const attemptController = require('../controllers/attemptController');

// Remplacez les méthodes du contrôleur AVANT d'importer le router
attemptController.getUserAttempts = jest.fn((req, res) => {
    res.status(200).send('User Attempts');
});
attemptController.getQuizAttempts = jest.fn((req, res) => {
    res.status(200).send('Quiz Attempts');
});

// Maintenant, importez le router qui utilisera les méthodes modifiées
const router = require('../routes/attemptRoutes');

// Set up express app using the router
const app = express();
app.use(router);

describe('attemptRoutes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /user/:id calls getUserAttempts and returns expected response', async () => {
        const response = await request(app).get('/user/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('User Attempts');
        expect(attemptController.getUserAttempts).toHaveBeenCalled();
    });

    test('GET /quiz/:id calls getQuizAttempts and returns expected response', async () => {
        const response = await request(app).get('/quiz/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Quiz Attempts');
        expect(attemptController.getQuizAttempts).toHaveBeenCalled();
    });
});