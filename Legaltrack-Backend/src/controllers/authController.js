const { User } = require('../../models');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: email, password', details: {} }
    });
  }

  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
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

const logout = (req, res) => {
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' }, error: null });
};

const getMe = async (req, res) => {
  const user = await User.findByPk(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User ${req.userId} not found`, details: {} }
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

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: firstName, lastName, email, password', details: {} }
    });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'DUPLICATE_EMAIL', message: 'Email already registered', details: {} }
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    userRole: 'user',
    username: `${firstName} ${lastName}`,
  });

  res.status(201).json({
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

module.exports = { login, logout, getMe, register };