const attemptController = require('../controllers/attemptController');
const quizAttemptService = require('../services/quizAttemptService');

// Mock the service functions
jest.mock('../services/quizAttemptService');

describe('attemptController', () => {
    describe('getUserAttempts', () => {
        test('should return attempts on success', async () => {
            const mockAttempts = [{ id: 1 }, { id: 2 }];
            quizAttemptService.getAttemptsByUser.mockResolvedValue(mockAttempts);

            const req = { params: { id: '1' } };
            const res = {
                json: jest.fn(),
                status: jest.fn(() => res)
            };

            await attemptController.getUserAttempts(req, res);
            
            expect(quizAttemptService.getAttemptsByUser).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(mockAttempts);
        });

        test('should return error 500 when service fails', async () => {
            const error = new Error('Service failed');
            quizAttemptService.getAttemptsByUser.mockRejectedValue(error);

            const req = { params: { id: '1' } };
            const res = {
                json: jest.fn(),
                status: jest.fn(() => res)
            };

            await attemptController.getUserAttempts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getQuizAttempts', () => {
        test('should return quiz attempts on success', async () => {
            const mockAttempts = [{ id: 3 }, { id: 4 }];
            quizAttemptService.getAttemptsByQuiz.mockResolvedValue(mockAttempts);

            const req = { params: { id: '2' } };
            const res = {
                json: jest.fn(),
                status: jest.fn(() => res)
            };

            await attemptController.getQuizAttempts(req, res);

            expect(quizAttemptService.getAttemptsByQuiz).toHaveBeenCalledWith('2');
            expect(res.json).toHaveBeenCalledWith(mockAttempts);
        });

        test('should return error 500 when service fails', async () => {
            const error = new Error('Service failed for quiz');
            quizAttemptService.getAttemptsByQuiz.mockRejectedValue(error);

            const req = { params: { id: '2' } };
            const res = {
                json: jest.fn(),
                status: jest.fn(() => res)
            };

            await attemptController.getQuizAttempts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});