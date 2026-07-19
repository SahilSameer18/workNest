import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

import MainLayout from '../layout/MainLayout.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import EmployeeList from '../pages/EmployeeList.jsx';
import EmployeeDetail from '../pages/EmployeeDetail.jsx';
import EmployeeFormPage from '../pages/EmployeeFormPage.jsx';

import OrgTree from '../pages/OrgTree.jsx';
import MyProfile from '../pages/MyProfile.jsx';
import RoleGuard from '../components/RoleGuard.jsx';

// ─── Loading screen shown while session is being verified ────
const LoadingScreen = () => (
  <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
    <div className="text-center space-y-6">
      {/* Animated Rings */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 border-4 border-surface-2 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(251,191,36,0.3)]"></div>
        <div className="absolute inset-2 border-4 border-surface-2 rounded-full"></div>
        <div className="absolute inset-2 border-4 border-emerald-400 border-b-transparent border-r-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>
      </div>
      
      {/* Branding Texts */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-ink tracking-tight">
          Work<span className="text-amber-400">Nest</span>
        </h1>
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Connecting to your workspace...
        </p>
      </div>
    </div>
  </div>
);

// ─── Guard: redirects to /login if not authenticated ────────
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// ─── Guard: redirects to /dashboard if already logged in ────
const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  // Public routes (login)
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <Login /> },
    ],
  },

  // Protected routes (all inside MainLayout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/profile', element: <MyProfile /> },
          { path: '/org', element: <OrgTree /> },
          
          // HR and Admin only routes
          {
            element: <RoleGuard requireManage={true} />,
            children: [
              { path: '/employees', element: <EmployeeList /> },
              { path: '/employees/new', element: <EmployeeFormPage /> },
              { path: '/employees/:id', element: <EmployeeDetail /> },
              { path: '/employees/:id/edit', element: <EmployeeFormPage /> },
            ]
          }
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
]);

export default router;
