const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const userController = require('../controllers/userController');

jest.mock('../controllers/userController');

// Simulation du module userController
jest.mock('../controllers/userController');

describe('Routes Utilisateur', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/users', userRoutes);
        jest.clearAllMocks();
    });

    // Tests pour la méthode POST /users
    describe('POST /users', () => {
        it("devrait appeler createUser et retourner 201 avec un JSON de réponse", async () => {
            userController.createUser.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Utilisateur créé', userId: 1 });
            });

            const res = await request(app)
                .post('/users')
                .send({ username: 'testuser', password: 'password', role: 'user' });

            expect(userController.createUser).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'Utilisateur créé', userId: 1 });
        });

        it("devrait retourner une erreur en cas d'échec de la création d'un utilisateur", async () => {
            userController.createUser.mockImplementation((req, res) => {
                res.status(400).json({ error: 'Erreur de création' });
            });

            const res = await request(app)
                .post('/users')
                .send({ username: '', password: '', role: 'user' });

            expect(userController.createUser).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erreur de création' });
        });
    });

    // Tests pour la méthode GET /users
    describe('GET /users', () => {
        it("devrait appeler getAllUsers et retourner la liste des utilisateurs", async () => {
            userController.getAllUsers.mockImplementation((req, res) => {
                res.json([{ id: 1, username: 'testuser' }]);
            });

            const res = await request(app).get('/users');

            expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, username: 'testuser' }]);
        });

        it("devrait retourner une erreur en cas d'échec de la récupération des utilisateurs", async () => {
            userController.getAllUsers.mockImplementation((req, res) => {
                res.status(500).json({ error: 'Erreur de récupération' });
            });

            const res = await request(app).get('/users');

            expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erreur de récupération' });
        });

        it("devrait retourner un tableau vide si aucun utilisateur n'existe", async () => {
            userController.getAllUsers.mockImplementation((req, res) => {
                res.json([]);
            });

            const res = await request(app).get('/users');

            expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    // Tests pour la méthode GET /users/:id
    describe('GET /users/:id', () => {
        it("devrait appeler getUserById et retourner un utilisateur", async () => {
            userController.getUserById.mockImplementation((req, res) => {
                res.json({ id: 1, username: 'testuser' });
            });

            const res = await request(app).get('/users/1');

            expect(userController.getUserById).toHaveBeenCalledTimes(1);
            expect(userController.getUserById.mock.calls[0][0].params.id).toBe('1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1, username: 'testuser' });
        });

        it("devrait retourner une erreur si l'utilisateur n'est pas trouvé", async () => {
            userController.getUserById.mockImplementation((req, res) => {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
            });

            const res = await request(app).get('/users/999');

            expect(userController.getUserById).toHaveBeenCalledTimes(1);
            expect(userController.getUserById.mock.calls[0][0].params.id).toBe('999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Utilisateur non trouvé' });
        });
    });

    // Tests pour la méthode PUT /users/:id
    describe('PUT /users/:id', () => {
        it("devrait appeler updateUser et retourner les données mises à jour", async () => {
            userController.updateUser.mockImplementation((req, res) => {
                res.json({ message: 'Utilisateur mis à jour', updated: req.body });
            });

            const updatedData = { username: 'updated' };
            const res = await request(app)
                .put('/users/1')
                .send(updatedData);

            expect(userController.updateUser).toHaveBeenCalledTimes(1);
            expect(userController.updateUser.mock.calls[0][0].params.id).toBe('1');
            expect(userController.updateUser.mock.calls[0][0].body).toEqual(updatedData);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Utilisateur mis à jour', updated: updatedData });
        });

        it("devrait retourner une erreur si la mise à jour échoue", async () => {
            userController.updateUser.mockImplementation((req, res) => {
                res.status(400).json({ error: 'Erreur de mise à jour' });
            });

            const updatedData = { username: 'updated' };
            const res = await request(app)
                .put('/users/1')
                .send(updatedData);

            expect(userController.updateUser).toHaveBeenCalledTimes(1);
            expect(userController.updateUser.mock.calls[0][0].params.id).toBe('1');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erreur de mise à jour' });
        });
    });

    // Tests pour la méthode DELETE /users/:id
    describe('DELETE /users/:id', () => {
        it("devrait appeler deleteUser et retourner un message de confirmation", async () => {
            userController.deleteUser.mockImplementation((req, res) => {
                res.json({ message: 'Utilisateur supprimé' });
            });

            const res = await request(app).delete('/users/1');

            expect(userController.deleteUser).toHaveBeenCalledTimes(1);
            expect(userController.deleteUser.mock.calls[0][0].params.id).toBe('1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Utilisateur supprimé' });
        });

        it("devrait retourner une erreur si la suppression échoue", async () => {
            userController.deleteUser.mockImplementation((req, res) => {
                res.status(404).json({ error: 'Utilisateur non trouvé pour suppression' });
            });

            const res = await request(app).delete('/users/999');

            expect(userController.deleteUser).toHaveBeenCalledTimes(1);
            expect(userController.deleteUser.mock.calls[0][0].params.id).toBe('999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Utilisateur non trouvé pour suppression' });
        });
    });

    // Test pour une méthode HTTP non autorisée sur une route existante
    describe('Méthode non autorisée', () => {
        it("devrait retourner 404 pour une méthode HTTP non définie", async () => {
            const res = await request(app).patch('/users/1');
            expect(res.status).toBe(404);
        });
    });

    // Test pour une route inexistante
    describe('Route inexistante', () => {
        it("devrait retourner 404 pour une route qui n'existe pas", async () => {
            const res = await request(app).get('/inexistante');
            expect(res.status).toBe(404);
        });
    });
});