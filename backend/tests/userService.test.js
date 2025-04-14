const userService = require('../services/userService');
const { User } = require('../models');

describe('createUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait générer une erreur si le nom d'utilisateur est manquant", async () => {
        await expect(userService.createUser(undefined, 'password')).rejects.toThrow("Nom d’utilisateur et mot de passe requis.");
    });

    it("devrait générer une erreur si le mot de passe est manquant", async () => {
        await expect(userService.createUser('testuser', undefined)).rejects.toThrow("Nom d’utilisateur et mot de passe requis.");
    });

    it("devrait générer une erreur si le nom d'utilisateur est déjà utilisé", async () => {
        const existingUser = { id: 1, username: 'testuser' };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);
        await expect(userService.createUser('testuser', 'password')).rejects.toThrow("Nom d’utilisateur déjà utilisé.");
    });

    it("devrait créer un nouvel utilisateur avec des informations valides", async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);
        const newUser = { id: 2, username: 'newuser', password: 'password', role: 'user' };
        jest.spyOn(User, 'create').mockResolvedValue(newUser);
        const result = await userService.createUser('newuser', 'password', 'user');
        expect(result).toEqual(newUser);
        expect(User.create).toHaveBeenCalledWith({ username: 'newuser', password: 'password', role: 'user' });
    });
});

describe('getAllUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait retourner tous les utilisateurs", async () => {
        const users = [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' }
        ];
        jest.spyOn(User, 'findAll').mockResolvedValue(users);
        const result = await userService.getAllUsers();
        expect(result).toEqual(users);
        expect(User.findAll).toHaveBeenCalled();
    });
});

describe('getUserById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait retourner l'utilisateur si trouvé", async () => {
        const user = { id: 1, username: 'user1' };
        jest.spyOn(User, 'findByPk').mockResolvedValue(user);
        const result = await userService.getUserById(1);
        expect(result).toEqual(user);
        expect(User.findByPk).toHaveBeenCalledWith(1);
    });

    it("devrait générer une erreur si l'utilisateur n'est pas trouvé", async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        await expect(userService.getUserById(1)).rejects.toThrow("Utilisateur non trouvé");
    });
});

describe('updateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait mettre à jour l'utilisateur et retourner l'utilisateur modifié", async () => {
        const user = {
            id: 1,
            username: 'user1',
            update: jest.fn().mockResolvedValue({ id: 1, username: 'updatedUser' })
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(user);
        const data = { username: 'updatedUser' };
        const result = await userService.updateUser(1, data);
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(user.update).toHaveBeenCalledWith(data);
        expect(result).toEqual(user);
    });

    it("devrait générer une erreur si l'utilisateur à mettre à jour n'est pas trouvé", async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        await expect(userService.updateUser(1, { username: 'updatedUser' })).rejects.toThrow("Utilisateur non trouvé");
    });
});

describe('deleteUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devrait supprimer l'utilisateur", async () => {
        const user = {
            id: 1,
            username: 'user1',
            destroy: jest.fn().mockResolvedValue(true)
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(user);
        await userService.deleteUser(1);
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(user.destroy).toHaveBeenCalled();
    });

    it("devrait générer une erreur si l'utilisateur à supprimer n'est pas trouvé", async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        await expect(userService.deleteUser(1)).rejects.toThrow("Utilisateur non trouvé");
    });
});