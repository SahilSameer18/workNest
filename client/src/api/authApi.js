import api from './axios.js';

// POST /api/auth/login
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

// POST /api/auth/logout
export const logoutUser = () =>
  api.post('/auth/logout');

// GET /api/auth/me — restore session from existing cookie
export const getMe = () =>
  api.get('/auth/me');
