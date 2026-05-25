// Controller for authentication operations
const authUsers = require('../models/auth');

// POST /auth/login - simulate login with email and password
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: email, password',
        details: { required: ['email', 'password'] }
      }
    });
  }

  const user = authUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false, data: null,
      error: { code: 'UNAUTHORIZED', message: 'Invalid email or password', details: {} }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      token: `mock-token-${user.userId}`,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userRole: user.userRole
      }
    },
    error: null
  });
};

// POST /auth/logout - simulate logout
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully' },
    error: null
  });
};

// GET /users/me - get current user (userId comes from identify middleware)
const getMe = (req, res) => {
  const user = authUsers.find(u => u.userId === req.userId);

  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User with id ${req.userId} not found`, details: {} }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userRole: user.userRole
    },
    error: null
  });
};

module.exports = { login, logout, getMe };