// Route definitions for the /cases endpoint
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase
} = require('../controllers/casesController');

// GET /cases - get all cases, optional filter by status (public)
router.get('/', getAllCases);

// GET /cases/:id - get a single case by ID (public)
router.get('/:id', getCaseById);

// POST /cases - create a new case (manager and admin only)
router.post('/', authorize('admin', 'manager'), createCase);

// PUT /cases/:id - update an existing case (manager and admin only)
router.put('/:id', authorize('admin', 'manager'), updateCase);

// DELETE /cases/:id - delete a case (admin only)
router.delete('/:id', authorize('admin'), deleteCase);

module.exports = router;