const path = require('path');
const fs = require('fs');
const { Document, Case } = require('../../models');

const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'No file uploaded', details: {} }
    });
  }

  const { caseId } = req.body;
  if (!caseId) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required field: caseId', details: {} }
    });
  }

  const case_ = await Case.findByPk(caseId);
  if (!case_) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Case ${caseId} not found`, details: {} }
    });
  }

  const document = await Document.create({
    caseId,
    filename: req.file.originalname,
    filePath: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
    folderId: req.body.folderId || null,
  });

  const io = req.app.get('io');
  io.emit('document:uploaded', { documentId: document.documentId, caseId, filename: req.file.originalname });

  res.status(201).json({ success: true, data: document, error: null });
};

const getDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.id} not found`, details: {} }
    });
  }
  res.status(200).json({ success: true, data: document, error: null });
};

const downloadDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.id} not found`, details: {} }
    });
  }
  if (!fs.existsSync(document.filePath)) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'FILE_NOT_FOUND', message: 'File not found on disk', details: {} }
    });
  }
  res.download(document.filePath, document.filename);
};

const updateDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.id} not found`, details: {} }
    });
  }
  if (!req.file) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'No file uploaded', details: {} }
    });
  }
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }
  await document.update({
    filename: req.file.originalname,
    filePath: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
    aiSummary: null,
  });
  res.status(200).json({ success: true, data: document, error: null });
};

const deleteDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.id} not found`, details: {} }
    });
  }
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }
  await document.destroy();
  res.status(200).json({ success: true, data: { documentId: parseInt(req.params.id) }, error: null });
};

module.exports = { uploadDocument, getDocument, downloadDocument, updateDocument, deleteDocument };