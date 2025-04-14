const request = require('supertest');
const express = require('express');
const quizRoutes = require('../routes/quizRoutes');
const quizController = require('../controllers/quizController');

jest.mock('../controllers/quizController');

describe('Routes Quiz', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/quiz', quizRoutes);
        jest.clearAllMocks();
    });

    describe('POST /quiz', () => {
        it('devrait créer un quiz et retourner 201 avec l\'id du quiz', async () => {
            quizController.createQuiz.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Quiz créé', quizId: 1 });
            });

            const res = await request(app)
                .post('/quiz')
                .send({ title: 'Quiz Exemple', questions: [] });

            expect(quizController.createQuiz).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'Quiz créé', quizId: 1 });
        });
    });

    describe('GET /quiz', () => {
        it('devrait retourner tous les quizzes', async () => {
            quizController.getAllQuizzes.mockImplementation((req, res) => {
                res.json([{ id: 1, title: 'Quiz Exemple' }]);
            });

            const res = await request(app).get('/quiz');

            expect(quizController.getAllQuizzes).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, title: 'Quiz Exemple' }]);
        });
    });

    describe('GET /quiz/:id', () => {
        it('devrait retourner un quiz spécifique par id', async () => {
            quizController.getQuizById.mockImplementation((req, res) => {
                res.json({ id: req.params.id, title: 'Quiz Spécifique' });
            });

            const res = await request(app).get('/quiz/1');

            expect(quizController.getQuizById).toHaveBeenCalledTimes(1);
            expect(quizController.getQuizById.mock.calls[0][0].params.id).toBe('1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: '1', title: 'Quiz Spécifique' });
        });
    });

    describe('PUT /quiz/:id', () => {
        it('devrait mettre à jour un quiz et retourner les données mises à jour', async () => {
            quizController.updateQuiz.mockImplementation((req, res) => {
                res.json({ message: 'Quiz mis à jour', updated: req.body });
            });

            const updatedData = { title: 'Quiz Mis à Jour' };
            const res = await request(app)
                .put('/quiz/1')
                .send(updatedData);

            expect(quizController.updateQuiz).toHaveBeenCalledTimes(1);
            expect(quizController.updateQuiz.mock.calls[0][0].params.id).toBe('1');
            expect(quizController.updateQuiz.mock.calls[0][0].body).toEqual(updatedData);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Quiz mis à jour', updated: updatedData });
        });
    });

    describe('DELETE /quiz/:id', () => {
        it('devrait supprimer un quiz et retourner un message de confirmation', async () => {
            quizController.deleteQuiz.mockImplementation((req, res) => {
                res.json({ message: 'Quiz supprimé' });
            });

            const res = await request(app).delete('/quiz/1');

            expect(quizController.deleteQuiz).toHaveBeenCalledTimes(1);
            expect(quizController.deleteQuiz.mock.calls[0][0].params.id).toBe('1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Quiz supprimé' });
        });
    });
});
