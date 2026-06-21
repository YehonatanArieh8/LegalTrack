import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './CaseDetailPage.css';
import {
  getCaseById, uploadDocument, downloadDocument,
  deleteDocument, summarizeDocument,
  getFolders, createFolder, deleteFolder, moveDocumentToFolder,
  getNotes, createNote, deleteNote
} from '../../services/api';

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [case_, setCase] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const [caseRes, foldersRes, notesRes] = await Promise.all([
        getCaseById(id),
        getFolders(id),
        getNotes(id)
      ]);
      if (caseRes.success) setCase(caseRes.data);
      else setError(caseRes.error.message);
      if (foldersRes.success) setFolders(foldersRes.data);
      if (notesRes.success) setNotes(notesRes.data);
    } catch (err) {
      setError('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e, folderId = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadDocument(id, file, folderId);
    if (res.success) fetchAll();
    else setError(res.error.message);
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    const res = await deleteDocument(docId);
    if (res.success) fetchAll();
  };

  const handleSummarize = async (docId) => {
    setSummarizing(docId);
    const res = await summarizeDocument(docId);
    if (res.success) fetchAll();
    else setError(res.error.message);
    setSummarizing(null);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const res = await createFolder({ caseId: id, name: newFolderName });
    if (res.success) {
      setNewFolderName('');
      setShowFolderInput(false);
      fetchAll();
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Delete this folder? Documents will be moved to root.')) return;
    const res = await deleteFolder(folderId);
    if (res.success) fetchAll();
  };

  const handleMove = async (docId, folderId) => {
    const res = await moveDocumentToFolder(docId, folderId);
    if (res.success) fetchAll();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setNoteLoading(true);
    const res = await createNote({ caseId: id, content: newNote });
    if (res.success) {
      setNewNote('');
      fetchAll();
    }
    setNoteLoading(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    const res = await deleteNote(noteId);
    if (res.success) fetchAll();
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('pdf')) return '📄';
    if (mimetype?.includes('word')) return '📝';
    if (mimetype?.includes('sheet') || mimetype?.includes('excel')) return '📊';
    if (mimetype?.includes('image')) return '🖼️';
    return '📎';
  };

  const rootDocuments = case_?.documents?.filter(d => !d.folderId) || [];

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!case_) return <div className="detail-error">{error}</div>;

  return (
    <div className="detail-container">
      <Navbar />
      <div className="detail-content">

        <button className="detail-back-btn" onClick={() => navigate('/cases')}>
          ← Back to Cases
        </button>

        {/* Case Info */}
        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">Case #{case_.caseId} — {case_.type}</h1>
              <p className="detail-client">Client: {case_.client?.name || '—'}</p>
            </div>
            <span className={`detail-badge ${case_.status}`}>{case_.status}</span>
          </div>
          <p className="detail-description">{case_.description}</p>
          <p className="detail-date">Opened: {new Date(case_.openedDate).toLocaleDateString()}</p>
        </div>

        {/* Documents */}
        <div className="detail-card">
          <div className="detail-section-header">
            <h2 className="detail-section-title">📄 Documents</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label className="detail-upload-btn">
                {uploading ? 'Uploading...' : '+ Upload File'}
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt" onChange={(e) => handleUpload(e)} style={{ display: 'none' }} />
              </label>
              <button className="detail-folder-btn" onClick={() => setShowFolderInput(true)}>
                📁 New Folder
              </button>
            </div>
          </div>

          {error && <p className="detail-error-msg">{error}</p>}

          {showFolderInput && (
            <div className="detail-folder-input">
              <input
                className="detail-folder-name-input"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
              <button className="doc-btn download" onClick={handleCreateFolder}>Create</button>
              <button className="doc-btn delete" onClick={() => { setShowFolderInput(false); setNewFolderName(''); }}>Cancel</button>
            </div>
          )}

          {folders.map(folder => (
            <div key={folder.folderId} className="detail-folder">
              <div className="detail-folder-header">
                <span className="detail-folder-name">📁 {folder.name}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label className="doc-btn download" style={{ cursor: 'pointer' }}>
                    + Upload here
                    <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt" onChange={(e) => handleUpload(e, folder.folderId)} style={{ display: 'none' }} />
                  </label>
                  <button className="doc-btn delete" onClick={() => handleDeleteFolder(folder.folderId)}>🗑️ Delete Folder</button>
                </div>
              </div>
              {folder.documents?.length === 0 ? (
                <p className="detail-empty" style={{ padding: '8px 16px' }}>Empty folder</p>
              ) : (
                folder.documents?.map(doc => (
                  <DocumentItem
                    key={doc.documentId}
                    doc={doc}
                    folders={folders}
                    getFileIcon={getFileIcon}
                    summarizing={summarizing}
                    onDownload={downloadDocument}
                    onSummarize={handleSummarize}
                    onDelete={handleDelete}
                    onMove={handleMove}
                  />
                ))
              )}
            </div>
          ))}

          {rootDocuments.length === 0 && folders.length === 0 ? (
            <p className="detail-empty">No documents uploaded yet.</p>
          ) : (
            rootDocuments.map(doc => (
              <DocumentItem
                key={doc.documentId}
                doc={doc}
                folders={folders}
                getFileIcon={getFileIcon}
                summarizing={summarizing}
                onDownload={downloadDocument}
                onSummarize={handleSummarize}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))
          )}
        </div>

        {/* Notes */}
        <div className="detail-card">
          <h2 className="detail-section-title">📝 Notes</h2>

          <div className="detail-note-input">
            <textarea
              className="detail-note-textarea"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
            />
            <button
              className="detail-note-btn"
              onClick={handleAddNote}
              disabled={noteLoading || !newNote.trim()}
            >
              {noteLoading ? '...' : '+ Add Note'}
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="detail-empty">No notes yet.</p>
          ) : (
            <div className="detail-notes-list">
              {notes.map(note => (
                <div key={note.noteId} className="detail-note-item">
                  <div className="detail-note-header">
                    <span className="detail-note-author">
                      👤 {note.author?.firstName} {note.author?.lastName}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="detail-note-date">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <button className="doc-btn delete" onClick={() => handleDeleteNote(note.noteId)}>🗑️</button>
                    </div>
                  </div>
                  <p className="detail-note-content">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

const DocumentItem = ({ doc, folders, getFileIcon, summarizing, onDownload, onSummarize, onDelete, onMove }) => (
  <div className="detail-doc-item">
    <div className="detail-doc-info">
      <span className="detail-doc-name">{getFileIcon(doc.mimetype)} {doc.filename}</span>
      <span className="detail-doc-size">{(doc.size / 1024).toFixed(1)} KB</span>
    </div>
    <div className="detail-doc-actions">
      <button className="doc-btn download" onClick={() => onDownload(doc.documentId)}>⬇️ Download</button>
      <button className="doc-btn summarize" onClick={() => onSummarize(doc.documentId)} disabled={summarizing === doc.documentId}>
        {summarizing === doc.documentId ? '⏳ Summarizing...' : '🤖 AI Summary'}
      </button>
      <select
        className="doc-btn download"
        onChange={e => onMove(doc.documentId, e.target.value || null)}
        value={doc.folderId || ''}
      >
        <option value="">📂 Move to...</option>
        <option value="">Root</option>
        {folders.map(f => (
          <option key={f.folderId} value={f.folderId}>{f.name}</option>
        ))}
      </select>
      <button className="doc-btn delete" onClick={() => onDelete(doc.documentId)}>🗑️ Delete</button>
    </div>
    {doc.aiSummary && (
      <div className="detail-summary">
        <h4>AI Summary:</h4>
        <p>{doc.aiSummary}</p>
      </div>
    )}
  </div>
);

export default CaseDetailPage;