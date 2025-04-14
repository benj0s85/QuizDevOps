const { recordAttempt } = require('../services/quizAttemptService');
const { QuizAttempt } = require('../models');

jest.mock('../models', () => {
    return {
        QuizAttempt: {
            create: jest.fn()
        },
        Quiz: {} // could be extended if needed
    };
});

describe('quizAttemptService - recordAttempt', () => {
    beforeEach(() => {
        QuizAttempt.create.mockReset();
    });

    test('should call QuizAttempt.create with the correct parameters and return the created attempt', async () => {
        const mockAttempt = { id: 1, UserId: 1, QuizId: 2, score: 8, total: 10 };
        // Set up the mock to return a resolved promise with the mockAttempt
        QuizAttempt.create.mockResolvedValue(mockAttempt);

        const userId = 1;
        const quizId = 2;
        const score = 8;
        const total = 10;

        const result = await recordAttempt(userId, quizId, score, total);

        // Ensure QuizAttempt.create was called with the correct arguments
        expect(QuizAttempt.create).toHaveBeenCalledWith({
            UserId: userId,
            QuizId: quizId,
            score,
            total
        });
        
        // Ensure recordAttempt returns what QuizAttempt.create returns
        expect(result).toEqual(mockAttempt);
    });
});