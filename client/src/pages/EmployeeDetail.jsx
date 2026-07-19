import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Mail, Phone, Calendar, IndianRupee, ShieldAlert, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { getEmployeeById, deleteEmployee } from '../api/employeeApi.js';
import { useRole } from '../hooks/useRole.js';
import { formatDate, formatSalary, formatRole } from '../utils/format.js';
import { SkeletonDetail } from '../components/Skeleton.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, canDelete } = useRole();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getEmployeeById(id);
        setEmployee(res.data);
      } catch (err) {
        toast.error('Failed to load employee details.');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const confirmDelete = async () => {
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted successfully.');
      navigate('/employees');
    } catch (err) {
      toast.error('Failed to delete employee.');
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate('/employees')} className="text-gray-500 hover:text-ink text-sm flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft size={16} /> Back to Directory
          </button>
        </div>
        <SkeletonDetail />
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back & Actions */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate('/employees')} className="text-gray-500 hover:text-ink text-sm flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </button>

        <div className="flex items-center gap-3">
          {canManage && (
            <Link to={`/employees/${id}/edit`} className="btn-secondary flex items-center gap-2 py-1.5 px-3">
              <Edit2 size={14} /> Edit Profile
            </Link>
          )}
          {canDelete && (
            <button onClick={() => setDeleteTarget(true)} className="btn-danger flex items-center gap-2 py-1.5 px-3">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-surface-2 border border-edge flex items-center justify-center shrink-0">
          {employee.profileImage ? (
            <img src={employee.profileImage} alt={employee.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-gray-400 text-2xl font-bold uppercase">{employee.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-ink text-2xl font-bold leading-tight">{employee.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{employee.designation} at {employee.department}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={employee.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
              {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </span>
            <span className="badge-role">{formatRole(employee.role)}</span>
            <span className="bg-surface-2 text-gray-400 border border-edge inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
              ID: {employee.employeeId}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left Col: Contact & Job */}
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Email Address</p>
                  <p className="text-ink text-sm font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Phone Number</p>
                  <p className="text-ink text-sm font-medium">{employee.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Department</p>
                  <p className="text-ink text-sm font-medium">{employee.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Designation</p>
                  <p className="text-ink text-sm font-medium">{employee.designation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Joining Date</p>
                  <p className="text-ink text-sm font-medium">{formatDate(employee.joiningDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IndianRupee size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Salary</p>
                  <p className="text-ink text-sm font-medium">{formatSalary(employee.salary)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Hierarchy */}
        <div className="space-y-4">
          <div className="card h-full">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
              Hierarchy
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600 text-xs mb-2">Reporting Manager</p>
              {employee.manager ? (
                <Link to={`/employees/${employee.manager.id}`} className="flex items-center gap-3 p-2 -ml-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-xs font-bold">{employee.manager.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-ink text-sm font-medium">{employee.manager.name}</p>
                    <p className="text-gray-500 text-xs">{employee.manager.designation}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-gray-400 text-sm italic">No manager assigned</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 text-xs mb-2">Direct Reports ({employee.reportees?.length || 0})</p>
              {employee.reportees?.length > 0 ? (
                <div className="space-y-1">
                  {employee.reportees.map((rep) => (
                    <Link key={rep.id} to={`/employees/${rep.id}`} className="flex items-center gap-2 p-1.5 -ml-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-surface-2 border border-edge flex items-center justify-center shrink-0">
                        <span className="text-gray-400 text-[10px] font-bold">{rep.name.charAt(0)}</span>
                      </div>
                      <p className="text-ink text-xs font-medium truncate">{rep.name}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">No direct reports</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EmployeeDetail;
