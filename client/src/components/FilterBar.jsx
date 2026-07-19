import { ListFilter } from 'lucide-react';

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-500 mr-2">
        <ListFilter size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters:</span>
      </div>

      {/* Role */}
      <select
        name="role"
        value={filters.role || ''}
        onChange={handleChange}
        className="input w-auto py-1.5 bg-surface"
      >
        <option value="">All Roles</option>
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="HR_MANAGER">HR Manager</option>
        <option value="EMPLOYEE">Employee</option>
      </select>

      {/* Status */}
      <select
        name="status"
        value={filters.status || ''}
        onChange={handleChange}
        className="input w-auto py-1.5 bg-surface"
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      {/* Sort By */}
      <select
        name="sortBy"
        value={filters.sortBy || ''}
        onChange={handleChange}
        className="input w-auto py-1.5 bg-surface"
      >
        <option value="">Sort By...</option>
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
        <option value="joiningDate:desc">Joining Date (Newest)</option>
        <option value="joiningDate:asc">Joining Date (Oldest)</option>
      </select>
    </div>
  );
};

export default FilterBar;



