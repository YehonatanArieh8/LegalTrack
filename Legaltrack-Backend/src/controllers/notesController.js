const { Note, User } = require('../../models');

const getNotes = async (req, res) => {
  const notes = await Note.findAll({
    where: { caseId: req.params.caseId },
    include: [{ association: 'author', attributes: ['firstName', 'lastName'] }],
    order: [['createdAt', 'DESC']]
  });
  res.status(200).json({ success: true, data: notes, error: null });
};

const createNote = async (req, res) => {
  const { caseId, content } = req.body;
  const userId = parseInt(req.headers['x-user-id']);

  if (!caseId || !content) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: caseId, content', details: {} }
    });
  }

  const note = await Note.create({ caseId, userId, content });
  const noteWithAuthor = await Note.findByPk(note.noteId, {
    include: [{ association: 'author', attributes: ['firstName', 'lastName'] }]
  });

  const io = req.app.get('io');
  io.emit('note:created', { caseId, noteId: note.noteId });

  res.status(201).json({ success: true, data: noteWithAuthor, error: null });
};

const deleteNote = async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Note ${req.params.id} not found`, details: {} }
    });
  }
  await note.destroy();
  res.status(200).json({ success: true, data: { noteId: parseInt(req.params.id) }, error: null });
};

module.exports = { getNotes, createNote, deleteNote };