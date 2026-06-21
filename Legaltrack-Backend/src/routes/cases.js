const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const { getAllCases, getCaseById, createCase, updateCase, deleteCase } = require('../controllers/casesController');

router.get('/', getAllCases);
router.get('/:id', getCaseById);
router.post('/', authorize('admin', 'manager'), createCase);
router.put('/:id', authorize('admin', 'manager'), updateCase);
router.delete('/:id', authorize('admin'), deleteCase);

module.exports = router;