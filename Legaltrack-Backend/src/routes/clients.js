const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const { getAllClients, getClientById, createClient, updateClient, deleteClient } = require('../controllers/clientsController');

router.get('/', getAllClients);
router.get('/:id', getClientById);
router.post('/', authorize('admin', 'manager'), createClient);
router.put('/:id', authorize('admin', 'manager'), updateClient);
router.delete('/:id', authorize('admin'), deleteClient);

module.exports = router;