const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  } = require('../services/userService');
  
  // Créer un utilisateur
  exports.createUser = async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const user = await createUser(username, password, role);
      res.status(201).json({ message: 'Utilisateur créé', userId: user.id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Obtenir tous les utilisateurs
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Obtenir un utilisateur
  exports.getUserById = async (req, res) => {
    try {
      const user = await getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  
  // Mettre à jour un utilisateur
  exports.updateUser = async (req, res) => {
    try {
      const updated = await updateUser(req.params.id, req.body);
      res.json({ message: 'Utilisateur mis à jour', updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Supprimer un utilisateur
  exports.deleteUser = async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  