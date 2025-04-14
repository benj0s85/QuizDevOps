const { User } = require('../models');

// Créer un utilisateur
const createUser = async (username, password, role = 'user') => {
  if (!username || !password) {
    throw new Error('Nom d’utilisateur et mot de passe requis.');
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Nom d’utilisateur déjà utilisé.');
  }

  const user = await User.create({ username, password, role });
  return user;
};

// Obtenir tous les utilisateurs
const getAllUsers = async () => {   
  return await User.findAll();
};

// Obtenir un utilisateur par ID
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé');
  return user;
};

// Mettre à jour un utilisateur
const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé');
  await user.update(data);
  return user;
};

// Supprimer un utilisateur
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé');
  await user.destroy();
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
