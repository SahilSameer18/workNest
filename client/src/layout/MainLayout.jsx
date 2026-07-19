import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

// Shell layout for all authenticated pages.
// Sidebar is fixed on the left; Navbar sits at the top of the content area.
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />

      {/* Content area pushed right of the sidebar */}
      <div className="flex-1 flex flex-col ml-60">
        <Navbar />

        {/* Page content rendered by child routes */}
        <main className="flex-1 p-6 mt-14 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
