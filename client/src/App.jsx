import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './routes/app.routes.jsx';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f1f24',
            color: '#f5f5f0',
            border: '1px solid #2a2a30',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1f1f24' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#1f1f24' } },
        }}
      />
    </AuthProvider>
  );
};

export default App;