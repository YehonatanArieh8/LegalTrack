// Base API configuration and helper functions
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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