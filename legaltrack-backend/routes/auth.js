// Route definitions for authentication endpoints
const express = require('express');
const router = express.Router();
const identify = require('../middleware/identify');
const { login, logout, getMe } = require('../controllers/authController');

// POST /auth/login - no identify needed (user not logged in yet)
router.post('/login', login);

// POST /auth/logout - no identify needed
router.post('/logout', logout);

// GET /users/me - identify required
router.get('/me', identify, getMe);

module.exports = router;