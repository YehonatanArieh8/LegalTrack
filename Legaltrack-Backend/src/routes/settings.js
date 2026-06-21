const express = require('express');
const router = express.Router();
const identify = require('../middleware/identify');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', identify, getSettings);
router.put('/', identify, updateSettings);

module.exports = router;