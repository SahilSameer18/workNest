import api from './axios.js';

// GET /api/employees — list with optional query params
// Params: search, department, role, status, sortBy, order, page, limit
export const getAllEmployees = (params = {}) =>
  api.get('/employees', { params });

// GET /api/employees/:id
export const getEmployeeById = (id) =>
  api.get(`/employees/${id}`);

// POST /api/employees
export const createEmployee = (data) =>
  api.post('/employees', data);

// PUT /api/employees/:id
export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data);

// DELETE /api/employees/:id  (soft delete)
export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`);

// GET /api/organization/tree
export const getOrgTree = () =>
  api.get('/organization/tree');

// GET /api/employees/me (My Profile)
export const getMyProfile = () =>
  api.get('/employees/me');

// ─── Dashboard stats ─────────────────────────────────────────
// Fires 3 parallel requests to get totals by status,
// plus one full-fetch to derive unique department count.
export const getDashboardStats = async () => {
  const [totalRes, activeRes, inactiveRes, allRes] = await Promise.all([
    api.get('/employees', { params: { page: 1, limit: 1 } }),
    api.get('/employees', { params: { status: 'ACTIVE',   page: 1, limit: 1 } }),
    api.get('/employees', { params: { status: 'INACTIVE', page: 1, limit: 1 } }),
    api.get('/employees', { params: { page: 1, limit: 1000 } }), // for dept count
  ]);

  const departments = new Set(
    allRes.data.data.map((e) => e.department).filter(Boolean)
  );

  return {
    total:       totalRes.data.total,
    active:      activeRes.data.total,
    inactive:    inactiveRes.data.total,
    departments: departments.size,
  };
};
