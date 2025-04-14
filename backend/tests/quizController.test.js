const httpMocks = require('node-mocks-http');
const quizController = require('../controllers/quizController');
const quizService = require('../services/quizService');

jest.mock('../services/quizService');

describe("Quiz Controller", () => {
    describe("createQuiz", () => {
        it("should create a quiz successfully", async () => {
            const req = httpMocks.createRequest({
                body: { theme: "math", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.createQuiz.mockResolvedValue({ id: "1" });
            
            await quizController.createQuiz(req, res);
            
            expect(res.statusCode).toBe(201);
            const data = res._getJSONData();
            expect(data).toEqual({ message: 'Quiz créé avec succès', quizId: "1" });
        });

        it("should return an error if quiz creation fails", async () => {
            const req = httpMocks.createRequest({
                body: { theme: "science", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.createQuiz.mockRejectedValue(new Error("Creation error"));
            
            await quizController.createQuiz(req, res);
            
            expect(res.statusCode).toBe(400);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Creation error" });
        });
    });

    describe("getAllQuizzes", () => {
        it("should retrieve all quizzes successfully", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const quizzes = [{ id: "1", theme: "math" }, { id: "2", theme: "science" }];
            quizService.getAllQuizzes.mockResolvedValue(quizzes);
            
            await quizController.getAllQuizzes(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual(quizzes);
        });

        it("should return an error if retrieving quizzes fails", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            quizService.getAllQuizzes.mockRejectedValue(new Error("Service error"));
            
            await quizController.getAllQuizzes(req, res);
            
            expect(res.statusCode).toBe(500);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Service error" });
        });
    });

    describe("getQuizById", () => {
        it("should retrieve a quiz by ID successfully", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" }
            });
            const res = httpMocks.createResponse();
            const quiz = { id: "1", theme: "math" };
            quizService.getQuizById.mockResolvedValue(quiz);
            
            await quizController.getQuizById(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual(quiz);
        });

        it("should return an error if quiz retrieval fails", async () => {
            const req = httpMocks.createRequest({
                params: { id: "2" }
            });
            const res = httpMocks.createResponse();
            quizService.getQuizById.mockRejectedValue(new Error("Not found"));
            
            await quizController.getQuizById(req, res);
            
            expect(res.statusCode).toBe(404);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Not found" });
        });
    });

    describe("updateQuiz", () => {
        it("should update a quiz successfully", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { theme: "history", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.updateQuiz.mockResolvedValue();
            
            await quizController.updateQuiz(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual({ message: 'Quiz mis à jour avec succès' });
        });

        it("should return an error if quiz update fails", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { theme: "geography", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.updateQuiz.mockRejectedValue(new Error("Update error"));
            
            await quizController.updateQuiz(req, res);
            
            expect(res.statusCode).toBe(400);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Update error" });
        });
    });

    describe("deleteQuiz", () => {
        it("should delete a quiz successfully", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" }
            });
            const res = httpMocks.createResponse();
            quizService.deleteQuiz.mockResolvedValue();
            
            await quizController.deleteQuiz(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual({ message: 'Quiz supprimé avec succès' });
        });

        it("should return an error if quiz deletion fails", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" }
            });
            const res = httpMocks.createResponse();
            quizService.deleteQuiz.mockRejectedValue(new Error("Deletion error"));
            
            await quizController.deleteQuiz(req, res);
            
            expect(res.statusCode).toBe(404);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Deletion error" });
        });
    });
});