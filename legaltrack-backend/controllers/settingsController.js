// Controller for settings operations
const settings = require('../models/settings');

// GET /settings - get settings for current user
const getSettings = (req, res) => {
  const userSettings = settings.find(s => s.userId === req.userId);

  if (!userSettings) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Settings for user ${req.userId} not found`, details: {} }
    });
  }

  res.status(200).json({ success: true, data: userSettings, error: null });
};

// PUT /settings - update settings for current user
const updateSettings = (req, res) => {
  const userSettings = settings.find(s => s.userId === req.userId);

  if (!userSettings) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Settings for user ${req.userId} not found`, details: {} }
    });
  }

  const { username, email, theme, language, notificationsEnabled } = req.body;

  if (!username || !email || !theme) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: username, email, theme',
        details: { required: ['username', 'email', 'theme'] }
      }
    });
  }

  userSettings.username = username;
  userSettings.email = email;
  userSettings.theme = theme;
  userSettings.language = language || userSettings.language;
  userSettings.notificationsEnabled = notificationsEnabled ?? userSettings.notificationsEnabled;

  res.status(200).json({ success: true, data: userSettings, error: null });
};

module.exports = { getSettings, updateSettings };