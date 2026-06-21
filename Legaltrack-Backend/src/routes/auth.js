const express = require('express');
const router = express.Router();
const identify = require('../middleware/identify');
const { login, logout, getMe, register } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', identify, getMe);

module.exports = router;