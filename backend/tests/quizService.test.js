const quizService = require('../services/quizService');
const { Quiz, Question, Option } = require('../models');

jest.mock('../models', () => ({
    Quiz: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Question: {
        create: jest.fn(),
        destroy: jest.fn(),
    },
    Option: {
        create: jest.fn(),
        destroy: jest.fn(),
    },
    QuizAttempt: {
        create: jest.fn(),
    },
}));

describe('quizService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createQuiz', () => {
        const validTheme = "Culture générale";
        const validQuestions = [
            {
                questionText: "Première question ?",
                options: [
                    { text: "Option 1", isCorrect: true },
                    { text: "Option 2", isCorrect: false },
                    { text: "Option 3", isCorrect: false },
                ],
            },
            {
                questionText: "Deuxième question ?",
                options: [
                    { text: "Option A", isCorrect: false },
                    { text: "Option B", isCorrect: true },
                    { text: "Option C", isCorrect: false },
                ],
            },
            {
                questionText: "Troisième question ?",
                options: [
                    { text: "Choix 1", isCorrect: false },
                    { text: "Choix 2", isCorrect: false },
                    { text: "Choix 3", isCorrect: true },
                ],
            },
        ];

        it('devrait lever une erreur lorsque le thème est manquant', async () => {
            await expect(quizService.createQuiz(null, validQuestions))
                .rejects
                .toThrow('Le quiz doit avoir entre 3 et 10 questions et un thème.');
        });

        it('devrait lever une erreur lorsque le nombre de questions est inférieur à 3', async () => {
            await expect(quizService.createQuiz(validTheme, validQuestions.slice(0, 2)))
                .rejects
                .toThrow('Le quiz doit avoir entre 3 et 10 questions et un thème.');
        });

        it("devrait lever une erreur lorsqu'une question comporte un nombre d'options invalide", async () => {
            const questionsInvalidOptions = JSON.parse(JSON.stringify(validQuestions));
            questionsInvalidOptions[0].options = [{ text: "Only option", isCorrect: true }];
            await expect(quizService.createQuiz(validTheme, questionsInvalidOptions))
                .rejects
                .toThrow('Chaque question doit avoir entre 3 et 5 options.');
        });

        it("devrait lever une erreur lorsqu'une question ne comporte pas exactement une réponse correcte", async () => {
            const questionsBadCorrect = JSON.parse(JSON.stringify(validQuestions));
            questionsBadCorrect[1].options[0].isCorrect = true;
            await expect(quizService.createQuiz(validTheme, questionsBadCorrect))
                .rejects
                .toThrow('Chaque question doit avoir UNE SEULE bonne réponse.');
        });

        it('devrait créer un quiz ainsi que ses questions et options avec succès', async () => {
            const fakeQuiz = { id: 1 };
            Quiz.create.mockResolvedValue(fakeQuiz);
            Question.create.mockResolvedValueOnce({ id: 11 });
            Question.create.mockResolvedValueOnce({ id: 12 });
            Question.create.mockResolvedValueOnce({ id: 13 });
            Option.create.mockResolvedValue({});

            const result = await quizService.createQuiz(validTheme, validQuestions);
            expect(Quiz.create).toHaveBeenCalledWith({ theme: validTheme });
            expect(Question.create).toHaveBeenCalledTimes(3);
            expect(Option.create).toHaveBeenCalledTimes(9);
            expect(result).toEqual(fakeQuiz);
        });
    });

    describe('getAllQuizzes', () => {
        it('devrait retourner tous les quiz', async () => {
            const fakeQuizzes = [{ id: 1 }, { id: 2 }];
            Quiz.findAll.mockResolvedValue(fakeQuizzes);
            const result = await quizService.getAllQuizzes();
            expect(Quiz.findAll).toHaveBeenCalledWith({
                include: {
                    model: expect.anything(),
                    include: [Option],
                },
            });
            expect(result).toEqual(fakeQuizzes);
        });
    });

    describe('getQuizById', () => {
        it('devrait lever une erreur lorsque le quiz n\'est pas trouvé', async () => {
            Quiz.findByPk.mockResolvedValue(null);
            await expect(quizService.getQuizById(99))
                .rejects
                .toThrow('Quiz non trouvé');
        });

        it('devrait retourner un quiz lorsqu\'il est trouvé', async () => {
            const fakeQuiz = { id: 1 };
            Quiz.findByPk.mockResolvedValue(fakeQuiz);
            const result = await quizService.getQuizById(1);
            expect(Quiz.findByPk).toHaveBeenCalledWith(1, {
                include: {
                    model: expect.anything(),
                    include: [Option],
                },
            });
            expect(result).toEqual(fakeQuiz);
        });
    });

    describe('updateQuiz', () => {
        const validTheme = "Nouveau thème";
        const validQuestions = [
            {
                questionText: "Question mise à jour 1 ?",
                options: [
                    { text: "Réponse 1", isCorrect: true },
                    { text: "Réponse 2", isCorrect: false },
                    { text: "Réponse 3", isCorrect: false },
                ],
            },
            {
                questionText: "Question mise à jour 2 ?",
                options: [
                    { text: "Réponse A", isCorrect: false },
                    { text: "Réponse B", isCorrect: true },
                    { text: "Réponse C", isCorrect: false },
                ],
            },
            {
                questionText: "Question mise à jour 3 ?",
                options: [
                    { text: "Option X", isCorrect: false },
                    { text: "Option Y", isCorrect: false },
                    { text: "Option Z", isCorrect: true },
                ],
            },
        ];
        let fakeQuiz;

        beforeEach(() => {
            fakeQuiz = {
                id: 1,
                Questions: [
                    { id: 101 },
                    { id: 102 },
                ],
                update: jest.fn().mockResolvedValue(true),
            };
        });

        it('devrait lever une erreur lorsque le quiz n\'est pas trouvé', async () => {
            Quiz.findByPk.mockResolvedValue(null);
            await expect(quizService.updateQuiz(99, validTheme, validQuestions))
                .rejects
                .toThrow('Quiz non trouvé');
        });

        it('devrait mettre à jour le quiz et recréer questions et options avec succès', async () => {
            Quiz.findByPk.mockResolvedValue(fakeQuiz);
            Option.destroy.mockResolvedValue(true);
            Question.destroy.mockResolvedValue(true);
            Question.create.mockResolvedValue({ id: 201 });
            Option.create.mockResolvedValue({});

            const result = await quizService.updateQuiz(1, validTheme, validQuestions);
            expect(Quiz.findByPk).toHaveBeenCalledWith(1, {
                include: {
                    model: expect.anything(),
                    include: [Option],
                },
            });
            expect(fakeQuiz.update).toHaveBeenCalledWith({ theme: validTheme });
            expect(Option.destroy).toHaveBeenCalledTimes(fakeQuiz.Questions.length);
            expect(Question.destroy).toHaveBeenCalledTimes(fakeQuiz.Questions.length);
            expect(Question.create).toHaveBeenCalledTimes(validQuestions.length);
            expect(Option.create).toHaveBeenCalledTimes(validQuestions.length * 3);
            expect(result).toEqual(fakeQuiz);
        });
    });

    describe('deleteQuiz', () => {
        it('devrait lever une erreur lorsque le quiz n\'est pas trouvé', async () => {
            Quiz.findByPk.mockResolvedValue(null);
            await expect(quizService.deleteQuiz(50))
                .rejects
                .toThrow('Quiz non trouvé');
        });

        it('devrait supprimer un quiz avec succès', async () => {
            const fakeQuiz = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true),
            };
            Quiz.findByPk.mockResolvedValue(fakeQuiz);
            await quizService.deleteQuiz(1);
            expect(Quiz.findByPk).toHaveBeenCalledWith(1);
            expect(fakeQuiz.destroy).toHaveBeenCalled();
        });
    });

    describe('submitQuiz', () => {
        const fakeQuiz = {
            id: 1,
            Questions: [
                {
                    id: 101,
                    Options: [
                        { text: "A", isCorrect: true },
                        { text: "B", isCorrect: false },
                    ],
                },
                {
                    id: 102,
                    Options: [
                        { text: "C", isCorrect: false },
                        { text: "D", isCorrect: true },
                    ],
                },
            ],
        };
    
        it('devrait lever une erreur lorsque le quiz n\'est pas trouvé', async () => {
            Quiz.findByPk.mockResolvedValue(null);
            await expect(quizService.submitQuiz(99, [
                { questionId: 101, selectedOption: "A" }
            ])).rejects.toThrow('Quiz non trouvé');
        });
    
        it('devrait calculer et retourner le score correct ainsi que les résultats', async () => {
            Quiz.findByPk.mockResolvedValue(fakeQuiz);
            const answers = [
                { questionId: 101, selectedOption: "A" }, // correct
                { questionId: 102, selectedOption: "X" }, // incorrect
                { questionId: 999, selectedOption: "anything" } // question inexistante, à ignorer
            ];
            const result = await quizService.submitQuiz(1, answers);
            expect(result).toEqual({
                score: 1,
                total: fakeQuiz.Questions.length,
                results: [
                    {
                        questionId: 101,
                        isCorrect: true,
                        correctAnswer: "A",
                        userAnswer: "A"
                    },
                    {
                        questionId: 102,
                        isCorrect: false,
                        correctAnswer: "D",
                        userAnswer: "X"
                    }
                ]
            });
        });
    });
});