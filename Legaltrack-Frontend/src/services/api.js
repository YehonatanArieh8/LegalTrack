// Base API configuration and helper functions
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
// Helper to get stored user from localStorage
const getUser = () => JSON.parse(localStorage.getItem('user'));

// Helper to build headers
const getHeaders = () => {
  const user = getUser();
  return {
    'Content-Type': 'application/json',
    ...(user && { 'x-user-id': user.userId }),
    ...(user && { 'x-user-role': user.userRole })
  };
};

// Auth
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders()
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders()
  });
  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

// Users
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: getHeaders() });
  return res.json();
};

// Clients
export const getClients = async () => {
  const res = await fetch(`${BASE_URL}/clients`, { headers: getHeaders() });
  return res.json();
};

export const createClient = async (data) => {
  const res = await fetch(`${BASE_URL}/clients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateClient = async (id, data) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteClient = async (id) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};

// Cases
export const getCases = async (status = '') => {
  const url = status ? `${BASE_URL}/cases?status=${status}` : `${BASE_URL}/cases`;
  const res = await fetch(url, { headers: getHeaders() });
  return res.json();
};

export const createCase = async (data) => {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateCase = async (id, data) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteCase = async (id) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};

export const getCaseById = async (id) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, { headers: getHeaders() });
  return res.json();
};

// Documents
export const getDocument = async (id) => {
  const res = await fetch(`${BASE_URL}/documents/${id}`, { headers: getHeaders() });
  return res.json();
};

export const downloadDocument = (id) => {
  window.open(`${BASE_URL}/documents/${id}/download`, '_blank');
};

export const deleteDocument = async (id) => {
  const res = await fetch(`${BASE_URL}/documents/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};

// AI
export const summarizeDocument = async (docId) => {
  const res = await fetch(`${BASE_URL}/ai/summarize/${docId}`, {
    method: 'POST',
    headers: getHeaders()
  });
  return res.json();
};

export const aiChat = async (prompt, context = '') => {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ prompt, context })
  });
  return res.json();
};

// Folders
export const getFolders = async (caseId) => {
  const res = await fetch(`${BASE_URL}/folders/${caseId}`, { headers: getHeaders() });
  return res.json();
};

export const createFolder = async (data) => {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteFolder = async (id) => {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};

export const moveDocumentToFolder = async (docId, folderId) => {
  const res = await fetch(`${BASE_URL}/folders/move/${docId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ folderId })
  });
  return res.json();
};

export const uploadDocument = async (caseId, file, folderId = null) => {
  const user = getUser();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caseId', caseId);
  if (folderId) formData.append('folderId', folderId);
  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'x-user-id': user?.userId,
      'x-user-role': user?.userRole
    },
    body: formData
  });
  return res.json();
};

// Settings
export const getSettings = async () => {
  const res = await fetch(`${BASE_URL}/settings`, { headers: getHeaders() });
  return res.json();
};

export const updateSettings = async (data) => {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// Notes
export const getNotes = async (caseId) => {
  const res = await fetch(`${BASE_URL}/notes/${caseId}`, { headers: getHeaders() });
  return res.json();
};

export const createNote = async (data) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};