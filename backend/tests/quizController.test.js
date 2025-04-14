const httpMocks = require('node-mocks-http');
const quizController = require('../controllers/quizController');
const quizService = require('../services/quizService');

jest.mock('../services/quizService');

describe("Contrôleur Quiz", () => {
    describe("createQuiz", () => {
        it("devrait créer un quiz avec succès", async () => {
            const req = httpMocks.createRequest({
                body: { theme: "mathématiques", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.createQuiz.mockResolvedValue({ id: "1" });
            
            await quizController.createQuiz(req, res);
            
            expect(res.statusCode).toBe(201);
            const data = res._getJSONData();
            expect(data).toEqual({ message: 'Quiz créé avec succès', quizId: "1" });
        });

        it("devrait retourner une erreur si la création du quiz échoue", async () => {
            const req = httpMocks.createRequest({
                body: { theme: "sciences", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.createQuiz.mockRejectedValue(new Error("Erreur de création"));
            
            await quizController.createQuiz(req, res);
            
            expect(res.statusCode).toBe(400);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Erreur de création" });
        });
    });

    describe("getAllQuizzes", () => {
        it("devrait récupérer tous les quizzes avec succès", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const quizzes = [{ id: "1", theme: "mathématiques" }, { id: "2", theme: "sciences" }];
            quizService.getAllQuizzes.mockResolvedValue(quizzes);
            
            await quizController.getAllQuizzes(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual(quizzes);
        });

        it("devrait retourner une erreur si la récupération des quizzes échoue", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            quizService.getAllQuizzes.mockRejectedValue(new Error("Erreur du service"));
            
            await quizController.getAllQuizzes(req, res);
            
            expect(res.statusCode).toBe(500);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Erreur du service" });
        });
    });

    describe("getQuizById", () => {
        it("devrait récupérer un quiz par ID avec succès", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" }
            });
            const res = httpMocks.createResponse();
            const quiz = { id: "1", theme: "mathématiques" };
            quizService.getQuizById.mockResolvedValue(quiz);
            
            await quizController.getQuizById(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual(quiz);
        });

        it("devrait retourner une erreur si la récupération du quiz échoue", async () => {
            const req = httpMocks.createRequest({
                params: { id: "2" }
            });
            const res = httpMocks.createResponse();
            quizService.getQuizById.mockRejectedValue(new Error("Non trouvé"));
            
            await quizController.getQuizById(req, res);
            
            expect(res.statusCode).toBe(404);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Non trouvé" });
        });
    });

    describe("updateQuiz", () => {
        it("devrait mettre à jour un quiz avec succès", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { theme: "histoire", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.updateQuiz.mockResolvedValue();
            
            await quizController.updateQuiz(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual({ message: 'Quiz mis à jour avec succès' });
        });

        it("devrait retourner une erreur si la mise à jour du quiz échoue", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { theme: "géographie", questions: ["q1", "q2"] }
            });
            const res = httpMocks.createResponse();
            quizService.updateQuiz.mockRejectedValue(new Error("Erreur de mise à jour"));
            
            await quizController.updateQuiz(req, res);
            
            expect(res.statusCode).toBe(400);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Erreur de mise à jour" });
        });
    });

    describe("deleteQuiz", () => {
        it("devrait supprimer un quiz avec succès", async () => {
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

        it("devrait retourner une erreur si la suppression du quiz échoue", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" }
            });
            const res = httpMocks.createResponse();
            quizService.deleteQuiz.mockRejectedValue(new Error("Erreur de suppression"));
            
            await quizController.deleteQuiz(req, res);
            
            expect(res.statusCode).toBe(404);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Erreur de suppression" });
        });
    });

    describe("submitQuiz", () => {
        it("devrait soumettre un quiz avec succès", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { answers: { q1: "a", q2: "b" } }
            });
            const res = httpMocks.createResponse();
            const result = { score: 80 };
            quizService.submitQuiz.mockResolvedValue(result);
            
            await quizController.submitQuiz(req, res);
            
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual(result);
        });

        it("devrait retourner une erreur si la soumission du quiz échoue", async () => {
            const req = httpMocks.createRequest({
                params: { id: "1" },
                body: { answers: { q1: "a", q2: "b" } }
            });
            const res = httpMocks.createResponse();
            quizService.submitQuiz.mockRejectedValue(new Error("Erreur de soumission"));
            
            await quizController.submitQuiz(req, res);
            
            expect(res.statusCode).toBe(400);
            const data = res._getJSONData();
            expect(data).toEqual({ error: "Erreur de soumission" });
        });
    });
});
