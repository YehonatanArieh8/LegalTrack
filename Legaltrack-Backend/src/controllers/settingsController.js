const { User } = require('../../models');

const getSettings = async (req, res) => {
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
      username: user.username,
      email: user.email,
      theme: user.theme,
      language: user.language,
      notificationsEnabled: user.notificationsEnabled
    },
    error: null
  });
};

const updateSettings = async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `User ${req.userId} not found`, details: {} }
    });
  }
  const { username, email, theme, language, notificationsEnabled } = req.body;
  if (!username || !email || !theme) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: username, email, theme', details: {} }
    });
  }
  await user.update({ username, email, theme, language, notificationsEnabled });
  res.status(200).json({
    success: true,
    data: {
      username: user.username,
      email: user.email,
      theme: user.theme,
      language: user.language,
      notificationsEnabled: user.notificationsEnabled
    },
    error: null
  });
};

module.exports = { getSettings, updateSettings };