import { useAuth } from './useAuth.js';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isHrManager = role === 'HR_MANAGER';
  const isEmployee = role === 'EMPLOYEE';

  // Only Super Admins and HR Managers can perform general management tasks
  const canManage = isSuperAdmin || isHrManager;
  
  // Only Super Admins can hard delete or change managers
  const canDelete = isSuperAdmin;

  return {
    role,
    isSuperAdmin,
    isHrManager,
    isEmployee,
    canManage,
    canDelete,
    canAssignSuperAdmin: isSuperAdmin,
  };
};
