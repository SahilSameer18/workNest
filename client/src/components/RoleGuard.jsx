import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useRole } from '../hooks/useRole.js';

// Component to protect routes based on role capabilities
const RoleGuard = ({ requireManage = false }) => {
  const { user, loading } = useAuth();
  const { canManage } = useRole();

  if (loading) return null; // Let the main app router handle the overall loading state

  // If route requires manage permissions and user doesn't have them, bounce to dashboard
  if (requireManage && !canManage) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise allow access to child routes
  return <Outlet />;
};

export default RoleGuard;
