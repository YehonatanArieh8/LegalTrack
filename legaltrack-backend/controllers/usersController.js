// Controller for user-related operations
const users = require('../models/users');

// Track the next available user ID
let nextId = users.length + 1;

// GET /users - return all users
const getAllUsers = (req, res) => {
  res.status(200).json({ success: true, data: users, error: null });
};

// GET /users/:id - return a single user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.userId === id);

  // Return 404 if user not found
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User with id ${id} not found`, details: {} }
    });
  }

  res.status(200).json({ success: true, data: user, error: null });
};

// POST /users - create a new user
const createUser = (req, res) => {
  const { firstName, lastName, userRole } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !userRole) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: firstName, lastName, userRole',
        details: { required: ['firstName', 'lastName', 'userRole'] }
      }
    });
  }

  // Create the new user object
  const newUser = {
    userId: nextId++,
    firstName,
    lastName,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    userRole
  };

  users.push(newUser);
  res.status(201).json({ success: true, data: { userId: newUser.userId }, error: null });
};

// PUT /users/:id - update an existing user
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.userId === id);

  // Return 404 if user not found
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User with id ${id} not found`, details: {} }
    });
  }

  const { firstName, lastName, userRole } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !userRole) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: firstName, lastName, userRole',
        details: { required: ['firstName', 'lastName', 'userRole'] }
      }
    });
  }

  // Update the user fields
  user.firstName = firstName;
  user.lastName = lastName;
  user.userRole = userRole;
  user.updateDate = new Date().toISOString();

  res.status(200).json({ success: true, data: { userId: user.userId }, error: null });
};

// DELETE /users/:id - delete a user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.userId === id);

  // Return 404 if user not found
  if (index === -1) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User with id ${id} not found`, details: {} }
    });
  }

  // Remove the user from the array
  users.splice(index, 1);
  res.status(200).json({ success: true, data: { userId: id }, error: null });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };