const express = require('express');
const router = express.Router();
const { summarizeDocument, askQuestion } = require('../controllers/aiController');

router.post('/summarize/:docId', summarizeDocument);
router.post('/chat', askQuestion);

module.exports = router;