const { Client, Case } = require('../../models');

const getAllClients = async (req, res) => {
  const userId = parseInt(req.headers['x-user-id']);
  const clients = await Client.findAll({ where: { userId } });
  res.status(200).json({ success: true, data: clients, error: null });
};

const getClientById = async (req, res) => {
  const client = await Client.findByPk(req.params.id, {
    include: [{ association: 'cases' }]
  });
  if (!client) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client ${req.params.id} not found`, details: {} }
    });
  }
  res.status(200).json({ success: true, data: client, error: null });
};

const createClient = async (req, res) => {
  const userId = parseInt(req.headers['x-user-id']);
  const { name, phone, email, address } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: name, phone, email', details: {} }
    });
  }

  const client = await Client.create({ userId, name, phone, email, address });
  res.status(201).json({ success: true, data: { clientId: client.clientId }, error: null });
};

const updateClient = async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client ${req.params.id} not found`, details: {} }
    });
  }
  const { name, phone, email, address } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: name, phone, email', details: {} }
    });
  }
  await client.update({ name, phone, email, address });
  res.status(200).json({ success: true, data: { clientId: client.clientId }, error: null });
};

const deleteClient = async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Client ${req.params.id} not found`, details: {} }
    });
  }
  await client.destroy();
  res.status(200).json({ success: true, data: { clientId: parseInt(req.params.id) }, error: null });
};

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient };