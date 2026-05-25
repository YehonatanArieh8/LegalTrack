// Route definitions for the /users endpoint
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

// GET /users - get all users (public)
router.get('/', getAllUsers);

// GET /users/:id - get a single user by ID (public)
router.get('/:id', getUserById);

// POST /users - create a new user (manager and admin only)
router.post('/', authorize('admin', 'manager'), createUser);

// PUT /users/:id - update an existing user (manager and admin only)
router.put('/:id', authorize('admin', 'manager'), updateUser);

// DELETE /users/:id - delete a user (admin only)
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;