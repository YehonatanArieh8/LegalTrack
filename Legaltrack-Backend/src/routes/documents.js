const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadDocument, getDocument, downloadDocument, updateDocument, deleteDocument } = require('../controllers/documentsController');

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id', getDocument);
router.get('/:id/download', downloadDocument);
router.put('/:id', upload.single('file'), updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;