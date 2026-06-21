const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const { getFolders, createFolder, deleteFolder, moveDocumentToFolder } = require('../controllers/foldersController');

router.get('/:caseId', getFolders);
router.post('/', authorize('admin', 'manager'), createFolder);
router.delete('/:id', authorize('admin', 'manager'), deleteFolder);
router.patch('/move/:docId', authorize('admin', 'manager'), moveDocumentToFolder);

module.exports = router;