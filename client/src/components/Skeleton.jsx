// ─────────────────────────────────────────────────────────────
// Skeleton System
// Base block + named variants for every page in the app.
// Each variant shows real labels/titles so users know what's
// loading, while skeleton blocks fill in for actual data values.
// Uses Tailwind animate-pulse (simple opacity oscillation — lightweight).
// ─────────────────────────────────────────────────────────────

// ── Base block ──────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-2 rounded ${className}`} />
);

export default Skeleton;

// ─────────────────────────────────────────────────────────────
// DASHBOARD — Stat Card Skeleton
// Shows real card title + subtitle; skeleton for the icon & value
// ─────────────────────────────────────────────────────────────
export const SkeletonStatCard = ({ title, subtitle }) => (
  <div className="card flex flex-col gap-4">
    {/* Icon placeholder */}
    <Skeleton className="w-10 h-10 rounded-lg" />

    {/* Value placeholder */}
    <Skeleton className="h-9 w-20" />

    {/* Real labels shown immediately */}
    <div className="-mt-1">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      {subtitle && (
        <p className="text-gray-600 text-xs mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// EMPLOYEE LIST — Table Row Skeleton
// Mirrors exact column layout of the real employee table
// ─────────────────────────────────────────────────────────────
export const SkeletonTableRow = () => (
  <tr className="border-b border-edge">
    {/* Avatar */}
    <td className="table-cell w-12">
      <Skeleton className="h-8 w-8 rounded-full" />
    </td>
    {/* Name + email */}
    <td className="table-cell">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </td>
    {/* Department */}
    <td className="table-cell"><Skeleton className="h-4 w-24" /></td>
    {/* Designation */}
    <td className="table-cell"><Skeleton className="h-4 w-20" /></td>
    {/* Joining date */}
    <td className="table-cell"><Skeleton className="h-4 w-20" /></td>
    {/* Status badge */}
    <td className="table-cell"><Skeleton className="h-5 w-14 rounded-full" /></td>
    {/* Role badge */}
    <td className="table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
    {/* Actions */}
    <td className="table-cell">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </td>
  </tr>
);

// ─────────────────────────────────────────────────────────────
// EMPLOYEE DETAIL — Profile + Details Skeleton
// Shows section headings; skeletons for all data values
// ─────────────────────────────────────────────────────────────
export const SkeletonDetail = () => (
  <div className="space-y-4">
    {/* Profile header card */}
    <div className="card flex items-start gap-5">
      <Skeleton className="w-16 h-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>

    {/* Details grid */}
    <div className="card">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
        Employee Details
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {[
          'Employee ID', 'Email', 'Phone', 'Department',
          'Designation', 'Salary', 'Joining Date', 'Status',
        ].map((label) => (
          <div key={label}>
            <p className="text-gray-600 text-xs mb-1.5">{label}</p>
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>

    {/* Reporting manager */}
    <div className="card">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
        Reporting Manager
      </p>
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>

    {/* Direct reports */}
    <div className="card">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
        Direct Reports
      </p>
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ORG TREE — Node Skeleton
// Shows 3 placeholder nodes in a tree-like structure
// ─────────────────────────────────────────────────────────────
export const SkeletonOrgTree = () => (
  <div className="space-y-4">
    {/* Root node */}
    <div className="flex flex-col items-start gap-3">
      <div className="card flex items-center gap-3 w-56">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Children indented */}
      <div className="pl-10 border-l border-edge space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="card flex items-center gap-3 w-52">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// FORM — Employee Form Skeleton
// Shows all form field labels; skeletons for the input boxes
// ─────────────────────────────────────────────────────────────
export const SkeletonForm = () => (
  <div className="card space-y-6">
    {/* Section: Personal */}
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
        Personal Information
      </p>
      <div className="grid grid-cols-2 gap-4">
        {['Name', 'Email', 'Phone', 'Employee ID'].map((label) => (
          <div key={label}>
            <p className="text-gray-600 text-xs mb-1.5">{label}</p>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Section: Job */}
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
        Job Details
      </p>
      <div className="grid grid-cols-2 gap-4">
        {['Department', 'Designation', 'Salary', 'Joining Date', 'Status', 'Role'].map((label) => (
          <div key={label}>
            <p className="text-gray-600 text-xs mb-1.5">{label}</p>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Section: Account */}
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
        Account
      </p>
      <div className="grid grid-cols-2 gap-4">
        {['Password', 'Profile Image URL'].map((label) => (
          <div key={label}>
            <p className="text-gray-600 text-xs mb-1.5">{label}</p>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 pt-2 border-t border-edge">
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
  </div>
);
