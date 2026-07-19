import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="text-ink text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
