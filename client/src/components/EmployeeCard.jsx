import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatRole } from '../utils/format.js';
import { useRole } from '../hooks/useRole.js';

const EmployeeCard = ({ employee, onDeleteClick }) => {
  const { canManage, canDelete } = useRole();

  return (
    <tr className="hover:bg-surface-2/50 transition-colors group border-b border-edge">
      {/* Avatar */}
      <td className="table-cell w-12 py-3">
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-edge flex items-center justify-center shrink-0">
          {employee.profileImage ? (
            <img src={employee.profileImage} alt={employee.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs font-bold uppercase">
              {employee.name.charAt(0)}
            </span>
          )}
        </div>
      </td>

      {/* Name / ID / Email */}
      <td className="table-cell">
        <p className="font-semibold text-ink leading-tight">{employee.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-500 text-xs font-medium">{employee.employeeId}</span>
          <span className="text-gray-600 text-[10px]">•</span>
          <span className="text-gray-500 text-xs">{employee.email}</span>
        </div>
      </td>

      {/* Department */}
      <td className="table-cell text-gray-300 font-medium">
        {employee.department}
      </td>

      {/* Designation */}
      <td className="table-cell text-gray-400">
        {employee.designation}
      </td>

      {/* Joining Date */}
      <td className="table-cell text-gray-400 whitespace-nowrap">
        {formatDate(employee.joiningDate)}
      </td>

      {/* Status */}
      <td className="table-cell">
        <span className={employee.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
          {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Role */}
      <td className="table-cell">
        <span className="badge-role">{formatRole(employee.role)}</span>
      </td>

      {/* Actions */}
      <td className="table-cell text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          
          <Link to={`/employees/${employee.id}`} className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-surface rounded transition-colors" title="View Profile">
            <Eye size={16} />
          </Link>

          {canManage && (
            <Link to={`/employees/${employee.id}/edit`} className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-surface rounded transition-colors" title="Edit Employee">
              <Edit2 size={16} />
            </Link>
          )}

          {canDelete && (
            <button onClick={() => onDeleteClick(employee)} className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-surface rounded transition-colors" title="Delete Employee">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmployeeCard;
