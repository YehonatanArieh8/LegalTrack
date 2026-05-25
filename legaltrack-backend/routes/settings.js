// Route definitions for settings endpoints
const express = require('express');
const router = express.Router();
const identify = require('../middleware/identify');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// GET /settings - identify required
router.get('/', identify, getSettings);

// PUT /settings - identify required
router.put('/', identify, updateSettings);

module.exports = router;