import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

// Map routes to readable page titles
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/employees/new': 'Add Employee',
  '/org': 'Org Chart',
  '/profile': 'My Profile',
};

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  HR_MANAGER: 'HR Manager',
  EMPLOYEE: 'Employee',
};

const Navbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Match exact path first, then try prefix (e.g. /employees/abc/edit → "Employees")
  const title =
    PAGE_TITLES[pathname] ??
    PAGE_TITLES[Object.keys(PAGE_TITLES).find((p) => pathname.startsWith(p))] ??
    'WorkNest';

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-surface border-b border-edge z-10 flex items-center justify-between px-6">
      {/* Page title */}
      <h1 className="text-ink text-sm font-semibold">{title}</h1>

      {/* User identity & actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-surface-2 text-gray-500 hover:text-amber-400 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex items-center gap-3 border-l border-edge pl-4">
          <span className="badge-role">{ROLE_LABELS[user?.role] ?? user?.role}</span>
          <span className="text-ink text-sm font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
