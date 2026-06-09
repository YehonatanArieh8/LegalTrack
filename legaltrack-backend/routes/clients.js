// Route definitions for the /clients endpoint
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientsController');

// GET /clients - get all clients (public)
router.get('/', getAllClients);

// GET /clients/:id - get a single client by ID (public)
router.get('/:id', getClientById);

// POST /clients - create a new client (manager and admin only)
router.post('/', authorize('admin', 'manager'), createClient);

// PUT /clients/:id - update an existing client (manager and admin only)
router.put('/:id', authorize('admin', 'manager'), updateClient);

// DELETE /clients/:id - delete a client (admin only)
router.delete('/:id', authorize('admin'), deleteClient);

module.exports = router;