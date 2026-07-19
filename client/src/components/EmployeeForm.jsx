import { useState } from 'react';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useRole } from '../hooks/useRole.js';
import { dateForInput } from '../utils/format.js';

// Must match backend createEmployeeSchema exactly
const schema = z.object({
  employeeId:   z.string().regex(/^EMP\d{3,5}$/, "Format must be EMPxxx."),
  name:         z.string().min(1, "Name is required."),
  email:        z.string().email("Invalid email format."),
  password:     z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
  phone:        z.string().min(1, "Phone is required."),
  department:   z.string().min(1, "Department is required."),
  designation:  z.string().min(1, "Designation is required."),
  salary:       z.coerce.number().positive("Salary must be positive."),
  joiningDate:  z.string().min(1, "Joining date is required."),
  status:       z.enum(["ACTIVE", "INACTIVE"]),
  role:         z.enum(["SUPER_ADMIN", "HR_MANAGER", "EMPLOYEE"]),
  profileImage: z.string().optional().nullable(),
});

const EmployeeForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { canAssignSuperAdmin } = useRole();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    employeeId:   initialData?.employeeId || '',
    name:         initialData?.name || '',
    email:        initialData?.email || '',
    password:     '', // Left blank on edit unless changing
    phone:        initialData?.phone || '',
    department:   initialData?.department || '',
    designation:  initialData?.designation || '',
    salary:       initialData?.salary || '',
    joiningDate:  dateForInput(initialData?.joiningDate),
    status:       initialData?.status || 'ACTIVE',
    role:         initialData?.role || 'EMPLOYEE',
    profileImage: initialData?.profileImage || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // On edit, password is not required. On create, it is.
    const dataToValidate = { ...form };
    if (isEditing && !dataToValidate.password) {
      delete dataToValidate.password;
    } else if (!isEditing && !dataToValidate.password) {
      setErrors({ password: 'Password is required for new employees.' });
      return;
    }

    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit clean data
    const finalData = { ...result.data };
    if (isEditing && !finalData.password) delete finalData.password;
    // Format date string to full ISO for backend
    finalData.joiningDate = new Date(finalData.joiningDate).toISOString();

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-8" noValidate>
      {/* 1. Personal */}
      <div>
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={`input ${errors.name ? 'border-rose-500' : ''}`} placeholder="John Doe" />
            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Employee ID</label>
            <input type="text" name="employeeId" value={form.employeeId} onChange={handleChange} disabled={isEditing} className={`input ${errors.employeeId ? 'border-rose-500' : ''} ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="EMP123" />
            {errors.employeeId && <p className="text-rose-400 text-xs mt-1">{errors.employeeId}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={`input ${errors.email ? 'border-rose-500' : ''}`} placeholder="john@example.com" />
            {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`input ${errors.phone ? 'border-rose-500' : ''}`} placeholder="9876543210" />
            {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* 2. Job */}
      <div>
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Department</label>
            <input type="text" name="department" value={form.department} onChange={handleChange} className={`input ${errors.department ? 'border-rose-500' : ''}`} placeholder="Engineering" />
            {errors.department && <p className="text-rose-400 text-xs mt-1">{errors.department}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Designation</label>
            <input type="text" name="designation" value={form.designation} onChange={handleChange} className={`input ${errors.designation ? 'border-rose-500' : ''}`} placeholder="Senior Developer" />
            {errors.designation && <p className="text-rose-400 text-xs mt-1">{errors.designation}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Annual Salary (₹)</label>
            <input type="number" name="salary" value={form.salary} onChange={handleChange} className={`input ${errors.salary ? 'border-rose-500' : ''}`} placeholder="1200000" />
            {errors.salary && <p className="text-rose-400 text-xs mt-1">{errors.salary}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Joining Date</label>
            <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={`input ${errors.joiningDate ? 'border-rose-500' : ''}`} />
            {errors.joiningDate && <p className="text-rose-400 text-xs mt-1">{errors.joiningDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">System Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="input">
              <option value="EMPLOYEE">Employee</option>
              <option value="HR_MANAGER">HR Manager</option>
              {canAssignSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Account */}
      <div>
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b border-edge pb-2">
          Account Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className={`input ${errors.password ? 'border-rose-500' : ''}`} placeholder="••••••••" />
            {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Profile Image URL (Optional)</label>
            <input type="url" name="profileImage" value={form.profileImage} onChange={handleChange} className="input" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-edge">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
