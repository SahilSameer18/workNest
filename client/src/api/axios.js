import axios from 'axios';

// Axios instance pre-configured for the WorkNest API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Send JWT cookie on every request
});

// On 401 — session expired or invalid, redirect to login
// Skip redirect if already on the login page (prevents infinite loop during session check)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

