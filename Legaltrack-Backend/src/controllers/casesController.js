const { Case, Client, User, Document } = require('../../models');

const getAllCases = async (req, res) => {
  const { status } = req.query;
  const userId = parseInt(req.headers['x-user-id']);

  const where = {};
  if (status) where.status = status;

  const cases = await Case.findAll({
    where,
    include: [
      { association: 'client' },
      {
        association: 'assignedLawyers',
        where: { userId },
        required: true
      }
    ]
  });

  res.status(200).json({ success: true, data: cases, error: null });
};

const getCaseById = async (req, res) => {
  const case_ = await Case.findByPk(req.params.id, {
    include: [
      { association: 'client' },
      { association: 'documents' },
      { association: 'assignedLawyers' }
    ]
  });
  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case ${req.params.id} not found`, details: {} }
    });
  }
  res.status(200).json({ success: true, data: case_, error: null });
};

const createCase = async (req, res) => {
  const { clientId, userId, type, description } = req.body;
  if (!clientId || !userId || !type || !description) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: clientId, userId, type, description', details: {} }
    });
  }
  const newCase = await Case.create({ clientId, type, description, status: 'open' });
  await newCase.addAssignedLawyers(userId);

  const io = req.app.get('io');
  io.emit('case:created', { caseId: newCase.caseId, type, description });

  res.status(201).json({ success: true, data: { caseId: newCase.caseId }, error: null });
};

const updateCase = async (req, res) => {
  const case_ = await Case.findByPk(req.params.id);
  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case ${req.params.id} not found`, details: {} }
    });
  }
  const { clientId, type, status, description } = req.body;
  if (!clientId || !type || !status || !description) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: clientId, type, status, description', details: {} }
    });
  }
  const closedDate = status === 'closed' ? new Date() : null;
  await case_.update({ clientId, type, status, description, closedDate });

  const io = req.app.get('io');
  io.emit('case:updated', { caseId: case_.caseId, status });

  res.status(200).json({ success: true, data: { caseId: case_.caseId }, error: null });
};

const deleteCase = async (req, res) => {
  const case_ = await Case.findByPk(req.params.id);
  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case ${req.params.id} not found`, details: {} }
    });
  }
  await case_.destroy();
  res.status(200).json({ success: true, data: { caseId: parseInt(req.params.id) }, error: null });
};

module.exports = { getAllCases, getCaseById, createCase, updateCase, deleteCase };