const { Folder, Document } = require('../../models');

const getFolders = async (req, res) => {
  const folders = await Folder.findAll({
    where: { caseId: req.params.caseId },
    include: [{ association: 'documents' }]
  });
  res.status(200).json({ success: true, data: folders, error: null });
};

const createFolder = async (req, res) => {
  const { caseId, name } = req.body;
  if (!caseId || !name) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: caseId, name', details: {} }
    });
  }
  const folder = await Folder.create({ caseId, name });

  // Emit WebSocket event
  const io = req.app.get('io');
  io.emit('folder:created', { folderId: folder.folderId, caseId, name });

  res.status(201).json({ success: true, data: folder, error: null });
};

const deleteFolder = async (req, res) => {
  const folder = await Folder.findByPk(req.params.id);
  if (!folder) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Folder ${req.params.id} not found`, details: {} }
    });
  }
  // Move documents back to root (no folder)
  await Document.update({ folderId: null }, { where: { folderId: folder.folderId } });
  await folder.destroy();
  res.status(200).json({ success: true, data: { folderId: parseInt(req.params.id) }, error: null });
};

const moveDocumentToFolder = async (req, res) => {
  const document = await Document.findByPk(req.params.docId);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.docId} not found`, details: {} }
    });
  }
  const { folderId } = req.body; // null = move to root
  await document.update({ folderId: folderId || null });
  res.status(200).json({ success: true, data: document, error: null });
};

module.exports = { getFolders, createFolder, deleteFolder, moveDocumentToFolder };