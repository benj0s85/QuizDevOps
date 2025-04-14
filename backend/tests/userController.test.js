const userController = require('../controllers/userController');
const userService = require('../services/userService');

// Simulation du module userService
jest.mock('../services/userService');

describe('Contrôleur Utilisateur', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    // Tests pour la création d'un utilisateur
    describe('createUser', () => {
        it("devrait créer un utilisateur et renvoyer le statut 201", async () => {
            req.body = { username: 'testuser', password: 'password', role: 'user' };
            const fakeUser = { id: 1 };
            userService.createUser.mockResolvedValue(fakeUser);

            await userController.createUser(req, res);

            expect(userService.createUser).toHaveBeenCalledWith('testuser', 'password', 'user');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur créé', userId: fakeUser.id });
        });

        it("devrait retourner une erreur si la création de l'utilisateur échoue", async () => {
            req.body = { username: 'testuser', password: 'password', role: 'user' };
            const errorMsg = "Erreur lors de la création";
            userService.createUser.mockRejectedValue(new Error(errorMsg));

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
        });
    });

    // Tests pour la récupération de tous les utilisateurs
    describe('getAllUsers', () => {
        it("devrait retourner la liste des utilisateurs", async () => {
            const fakeUsers = [{ id: 1, username: 'testuser' }];
            userService.getAllUsers.mockResolvedValue(fakeUsers);

            await userController.getAllUsers(req, res);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(fakeUsers);
        });

        it("devrait retourner une erreur si la récupération des utilisateurs échoue", async () => {
            const errorMsg = "Erreur lors de la récupération";
            userService.getAllUsers.mockRejectedValue(new Error(errorMsg));

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
        });
    });

    // Tests pour la récupération d'un utilisateur par ID
    describe('getUserById', () => {
        it("devrait retourner un utilisateur", async () => {
            req.params.id = '1';
            const fakeUser = { id: 1, username: 'testuser' };
            userService.getUserById.mockResolvedValue(fakeUser);

            await userController.getUserById(req, res);

            expect(userService.getUserById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(fakeUser);
        });

        it("devrait retourner une erreur si l'utilisateur n'est pas trouvé", async () => {
            req.params.id = '2';
            const errorMsg = "Utilisateur non trouvé";
            userService.getUserById.mockRejectedValue(new Error(errorMsg));

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
        });
    });

    // Tests pour la mise à jour d'un utilisateur
    describe('updateUser', () => {
        it("devrait mettre à jour un utilisateur et renvoyer les données mises à jour", async () => {
            req.params.id = '1';
            req.body = { username: 'updated' };
            const fakeUpdated = { username: 'updated' };
            userService.updateUser.mockResolvedValue(fakeUpdated);

            await userController.updateUser(req, res);

            expect(userService.updateUser).toHaveBeenCalledWith('1', req.body);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur mis à jour', updated: fakeUpdated });
        });

        it("devrait retourner une erreur si la mise à jour de l'utilisateur échoue", async () => {
            req.params.id = '1';
            req.body = { username: 'updated' };
            const errorMsg = "Erreur de mise à jour";
            userService.updateUser.mockRejectedValue(new Error(errorMsg));

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
        });
    });

    // Tests pour la suppression d'un utilisateur
    describe('deleteUser', () => {
        it("devrait supprimer un utilisateur et renvoyer un message de confirmation", async () => {
            req.params.id = '1';
            userService.deleteUser.mockResolvedValue();

            await userController.deleteUser(req, res);

            expect(userService.deleteUser).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé' });
        });

        it("devrait retourner une erreur si la suppression de l'utilisateur échoue", async () => {
            req.params.id = '1';
            const errorMsg = "Erreur lors de la suppression";
            userService.deleteUser.mockRejectedValue(new Error(errorMsg));

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
        });
    });
});