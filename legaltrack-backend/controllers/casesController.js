// Controller for case-related operations
const cases = require('../models/cases');

// Track the next available case ID
let nextId = cases.length + 1;

// GET /cases - return all cases, with optional status filter
const getAllCases = (req, res) => {
  const { status } = req.query;

  // Filter by status if provided as a query parameter
  let result = cases;
  if (status) {
    result = cases.filter(c => c.status === status);
  }

  res.status(200).json({ success: true, data: result, error: null });
};

// GET /cases/:id - return a single case by ID
const getCaseById = (req, res) => {
  const id = parseInt(req.params.id);
  const case_ = cases.find(c => c.caseId === id);

  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case with id ${id} not found`, details: {} }
    });
  }

  res.status(200).json({ success: true, data: case_, error: null });
};

// POST /cases - create a new case
const createCase = (req, res) => {
  const { clientId, userId, type, description } = req.body;

  if (!clientId || !userId || !type || !description) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: clientId, userId, type, description',
        details: { required: ['clientId', 'userId', 'type', 'description'] }
      }
    });
  }

  // New cases default to status "open" and no closedDate
  const newCase = {
    caseId: nextId++,
    clientId,
    userId,
    type,
    status: 'open',
    description,
    openedDate: new Date().toISOString(),
    closedDate: null
  };

  cases.push(newCase);
  res.status(201).json({ success: true, data: { caseId: newCase.caseId }, error: null });
};

// PUT /cases/:id - update an existing case
const updateCase = (req, res) => {
  const id = parseInt(req.params.id);
  const case_ = cases.find(c => c.caseId === id);

  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case with id ${id} not found`, details: {} }
    });
  }

  const { clientId, type, status, description } = req.body;

  if (!clientId || !type || !status || !description) {
    return res.status(400).json({
      success: false, data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: clientId, type, status, description',
        details: { required: ['clientId', 'type', 'status', 'description'] }
      }
    });
  }

  case_.clientId = clientId;
  case_.type = type;
  case_.status = status;
  case_.description = description;

  // If status changed to closed, set closedDate automatically
  if (status === 'closed' && !case_.closedDate) {
    case_.closedDate = new Date().toISOString();
  }

  // If status reopened, clear closedDate
  if (status !== 'closed') {
    case_.closedDate = null;
  }

  res.status(200).json({ success: true, data: { caseId: case_.caseId }, error: null });
};

// DELETE /cases/:id - delete a case
const deleteCase = (req, res) => {
  const id = parseInt(req.params.id);
  const index = cases.findIndex(c => c.caseId === id);

  if (index === -1) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case with id ${id} not found`, details: {} }
    });
  }

  // Remove the case from the array
  cases.splice(index, 1);
  res.status(200).json({ success: true, data: { caseId: id }, error: null });
};

module.exports = { getAllCases, getCaseById, createCase, updateCase, deleteCase };