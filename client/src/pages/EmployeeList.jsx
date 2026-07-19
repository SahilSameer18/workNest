import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { getAllEmployees, deleteEmployee } from '../api/employeeApi.js';
import { useRole } from '../hooks/useRole.js';

import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import EmployeeCard from '../components/EmployeeCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { SkeletonTableRow } from '../components/Skeleton.jsx';

const EmployeeList = () => {
  const { canManage } = useRole();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter & Pagination State
  const [query, setQuery] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: '', // e.g. "name:asc"
    page: 1,
    limit: 10,
  });

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees(query);
      setEmployees(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever query params change
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Handlers
  const handleSearch = (searchTerm) => {
    setQuery((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setQuery((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.id);
      toast.success('Employee deleted successfully.');
      fetchEmployees(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(total / query.limit) || 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-ink text-lg font-semibold">Directory</h2>
          <p className="text-gray-500 text-sm">Manage your team members and roles.</p>
        </div>
        
        {canManage && (
          <Link to="/employees/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Employee
          </Link>
        )}
      </div>

      {/* Controls: Search + Filters */}
      <div className="card mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <SearchBar initialValue={query.search} onSearch={handleSearch} />
        <FilterBar filters={query} onChange={handleFilterChange} />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto flex-1 flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-head w-12"></th>
              <th className="table-head">Employee</th>
              <th className="table-head">Department</th>
              <th className="table-head">Designation</th>
              <th className="table-head">Joined</th>
              <th className="table-head">Status</th>
              <th className="table-head">Role</th>
              <th className="table-head text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeletons
              Array.from({ length: query.limit }).map((_, i) => (
                <SkeletonTableRow key={i} />
              ))
            ) : employees.length > 0 ? (
              // Actual Data
              employees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  onDeleteClick={setDeleteTarget}
                />
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="text-gray-500" size={24} />
                  </div>
                  <p className="text-ink font-medium">No employees found</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="mt-auto px-6 py-4 border-t border-edge flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {Math.min((query.page - 1) * query.limit + 1, total)} to {Math.min(query.page * query.limit, total)} of {total} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(query.page - 1)}
              disabled={query.page === 1 || loading}
              className="btn-secondary px-3 py-1.5"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="btn-secondary px-3 py-1.5 pointer-events-none text-ink font-medium">
              {query.page} / {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(query.page + 1)}
              disabled={query.page === totalPages || loading}
              className="btn-secondary px-3 py-1.5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action can be undone later if needed (soft delete).`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
};

export default EmployeeList;
