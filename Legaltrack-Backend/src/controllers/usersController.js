const { User } = require('../../models');

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({ success: true, data: users, error: null });
};

const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User ${req.params.id} not found`, details: {} }
    });
  }
  res.status(200).json({ success: true, data: user, error: null });
};

const createUser = async (req, res) => {
  const { firstName, lastName, userRole } = req.body;
  if (!firstName || !lastName || !userRole) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: firstName, lastName, userRole', details: {} }
    });
  }
  const user = await User.create({ firstName, lastName, userRole, email: req.body.email || '', password: req.body.password || '' });
  res.status(201).json({ success: true, data: { userId: user.userId }, error: null });
};

const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User ${req.params.id} not found`, details: {} }
    });
  }
  const { firstName, lastName, userRole } = req.body;
  if (!firstName || !lastName || !userRole) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: firstName, lastName, userRole', details: {} }
    });
  }
  await user.update({ firstName, lastName, userRole });
  res.status(200).json({ success: true, data: { userId: user.userId }, error: null });
};

const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User ${req.params.id} not found`, details: {} }
    });
  }
  await user.destroy();
  res.status(200).json({ success: true, data: { userId: parseInt(req.params.id) }, error: null });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };