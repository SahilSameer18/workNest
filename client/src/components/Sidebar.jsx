import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitFork,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

// Role badge text
const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  HR_MANAGER: 'HR Manager',
  EMPLOYEE: 'Employee',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-surface border-r border-edge flex flex-col z-20">

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-edge">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-base font-bold text-sm">W</span>
        </div>
        <div>
          <p className="font-semibold text-ink text-sm leading-tight">WorkNest</p>
          <p className="text-gray-500 text-xs">EMS Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">
          Menu
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'nav-link-active' : 'nav-link'
          }
        >
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        {/* Employees — visible to SUPER_ADMIN and HR_MANAGER */}
        {!isEmployee && (
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <Users size={17} />
            Employees
          </NavLink>
        )}

        {/* Org Chart — visible to SUPER_ADMIN and HR_MANAGER */}
        {!isEmployee && (
          <NavLink
            to="/org"
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <GitFork size={17} />
            Org Chart
          </NavLink>
        )}

        {/* My Profile — visible to EMPLOYEE role */}
        {isEmployee && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <UserCircle size={17} />
            My Profile
          </NavLink>
        )}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-edge px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <span className="text-amber-400 text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-ink text-xs font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">
              {ROLE_LABELS[user?.role] ?? user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="nav-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
