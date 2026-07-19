import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Building2, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '../api/employeeApi.js';
import StatCard from '../components/StatCard.jsx';
import { SkeletonStatCard } from '../components/Skeleton.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Each card definition carries the real labels shown even during skeleton loading
const STAT_CARDS = [
  {
    key:      'total',
    title:    'Total Employees',
    subtitle: 'All records in system',
    icon:     Users,
    color:    { bg: 'bg-amber-400/15', icon: 'text-amber-400' },
  },
  {
    key:      'active',
    title:    'Active Employees',
    subtitle: 'Currently working',
    icon:     UserCheck,
    color:    { bg: 'bg-emerald-500/15', icon: 'text-emerald-400' },
  },
  {
    key:      'inactive',
    title:    'Inactive Employees',
    subtitle: 'Deactivated accounts',
    icon:     UserX,
    color:    { bg: 'bg-rose-500/15', icon: 'text-rose-400' },
  },
  {
    key:      'departments',
    title:    'Departments',
    subtitle: 'Unique departments',
    icon:     Building2,
    color:    { bg: 'bg-orange-400/15', icon: 'text-orange-400' },
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const isEmployee = user?.role === 'EMPLOYEE';

  useEffect(() => {
    if (isEmployee) { setLoading(false); return; }

    getDashboardStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [isEmployee]);

  // ── EMPLOYEE role: no stats access ─────────────────────────
  if (isEmployee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="w-14 h-14 bg-amber-400/15 rounded-xl flex items-center justify-center mb-4">
          <Users size={28} className="text-amber-400" />
        </div>
        <h2 className="text-ink text-xl font-semibold mb-2">
          Welcome, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Use the sidebar to view your profile and details.
        </p>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <AlertCircle size={32} className="text-rose-400 mb-3" />
        <p className="text-ink text-sm font-medium mb-1">Failed to load stats</p>
        <p className="text-gray-500 text-xs">
          Make sure the server is running, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-ink text-lg font-semibold">Overview</h2>
        <p className="text-gray-500 text-sm">Live stats from your employee database.</p>
      </div>

      {/* 4-column grid: skeleton cards while loading, real cards when ready */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) =>
          loading ? (
            <SkeletonStatCard
              key={card.key}
              title={card.title}
              subtitle={card.subtitle}
            />
          ) : (
            <StatCard
              key={card.key}
              title={card.title}
              subtitle={card.subtitle}
              value={stats?.[card.key]}
              icon={card.icon}
              color={card.color}
            />
          )
        )}
      </div>

      {!loading && stats && (
        <p className="text-gray-600 text-xs mt-6">
          Showing live data · {stats.total} employee{stats.total !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
};

export default Dashboard;
