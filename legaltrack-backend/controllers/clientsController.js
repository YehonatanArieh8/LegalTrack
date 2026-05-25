// Controller for client-related operations
const clients = require('../models/clients');

// Track the next available client ID
let nextId = clients.length + 1;

// GET /clients - return all clients
const getAllClients = (req, res) => {
  res.status(200).json({ success: true, data: clients, error: null });
};

// GET /clients/:id - return a single client by ID
const getClientById = (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.find(c => c.clientId === id);

  if (!client) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client with id ${id} not found`, details: {} }
    });
  }

  res.status(200).json({ success: true, data: client, error: null });
};

// POST /clients - create a new client
const createClient = (req, res) => {
  const { userId, name, phone, email, address } = req.body;

  if (!userId || !name || !phone || !email) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: userId, name, phone, email',
        details: { required: ['userId', 'name', 'phone', 'email'] }
      }
    });
  }

  const newClient = {
    clientId: nextId++,
    userId,
    name,
    phone,
    email,
    address: address || null,
    joinedDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  clients.push(newClient);
  res.status(201).json({ success: true, data: { clientId: newClient.clientId }, error: null });
};

// PUT /clients/:id - update an existing client
const updateClient = (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.find(c => c.clientId === id);

  if (!client) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client with id ${id} not found`, details: {} }
    });
  }

  const { name, phone, email, address } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: name, phone, email',
        details: { required: ['name', 'phone', 'email'] }
      }
    });
  }

  client.name = name;
  client.phone = phone;
  client.email = email;
  client.address = address || client.address;

  res.status(200).json({ success: true, data: { clientId: client.clientId }, error: null });
};

// DELETE /clients/:id - delete a client
const deleteClient = (req, res) => {
  const id = parseInt(req.params.id);
  const index = clients.findIndex(c => c.clientId === id);

  if (index === -1) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client with id ${id} not found`, details: {} }
    });
  }

  clients.splice(index, 1);
  res.status(200).json({ success: true, data: { clientId: id }, error: null });
};

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient };