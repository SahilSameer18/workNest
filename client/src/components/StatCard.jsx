// StatCard — shown when data is loaded.
// While loading, the Dashboard renders SkeletonStatCard instead.
// Props:
//   title    — primary label (e.g. "Total Employees")
//   subtitle — secondary hint  (e.g. "All records in system")
//   value    — the numeric value to display
//   icon     — lucide-react component
//   color    — { bg: 'bg-...', icon: 'text-...' }

const StatCard = ({ title, subtitle, value, icon: Icon, color }) => (
  <div className="card flex flex-col gap-4">
    {/* Colored icon */}
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.bg}`}>
      <Icon size={20} className={color.icon} />
    </div>

    {/* Value */}
    <p className="text-ink text-3xl font-bold leading-none">{value ?? '—'}</p>

    {/* Labels */}
    <div className="-mt-1">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-600 text-xs mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export default StatCard;
