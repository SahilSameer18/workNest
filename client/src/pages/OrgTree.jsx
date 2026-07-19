import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import { getOrgTree } from '../api/employeeApi.js';
import { SkeletonOrgTree } from '../components/Skeleton.jsx';

// Recursive Node Component
const OrgNode = ({ employee, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasChildren = employee.reportees && employee.reportees.length > 0;
  const paddingLeft = level === 0 ? 0 : 32; // 32px indent per level

  return (
    <div className="flex flex-col items-start w-full">
      {/* Node Card */}
      <div 
        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-2 transition-colors group cursor-pointer border border-transparent hover:border-edge"
        style={{ marginLeft: `${paddingLeft}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Toggle */}
        <div className={`w-5 h-5 flex items-center justify-center rounded hover:bg-surface transition-colors ${hasChildren ? 'text-gray-400' : 'opacity-0'}`}>
          {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-surface-2 border border-edge flex items-center justify-center shrink-0 shadow-sm overflow-hidden relative">
          {employee.profileImage ? (
             <img src={employee.profileImage} alt={employee.name} className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-gray-400" />
          )}
          
          {/* Status Indicator Dot */}
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${employee.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-ink text-sm font-semibold leading-tight">{employee.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-gray-500 text-xs font-medium">{employee.designation}</p>
            {level === 0 && <span className="badge-role text-[10px] px-1.5 py-0">Top Level</span>}
          </div>
        </div>

        {/* Child Count Badge (Only visible on hover or collapsed if has children) */}
        {hasChildren && (
          <div className="ml-4 px-2 py-0.5 rounded-full bg-surface-2 text-gray-500 text-[10px] font-bold">
            {employee.reportees.length}
          </div>
        )}
      </div>

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="w-full mt-1 relative">
           {/* Visual connecting line for children */}
          <div 
            className="absolute top-0 bottom-4 w-px bg-edge" 
            style={{ left: `${paddingLeft + 35}px` }} 
          />
          <div className="flex flex-col gap-1 w-full relative z-10">
            {employee.reportees.map((reportee) => (
              <OrgNode key={reportee.id} employee={reportee} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OrgTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrgTree()
      .then((res) => {
        setTreeData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load org tree', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-ink text-lg font-semibold">Organizational Structure</h2>
        <p className="text-gray-500 text-sm">Interactive view of the company reporting hierarchy.</p>
      </div>

      <div className="card flex-1 overflow-auto bg-surface relative">
        {loading ? (
          <div className="p-4">
             <SkeletonOrgTree />
          </div>
        ) : treeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <User size={32} className="text-gray-400 mb-3" />
            <p className="text-ink font-medium">No Employees Found</p>
            <p className="text-gray-500 text-sm mt-1">The organization chart is empty.</p>
          </div>
        ) : (
          <div className="p-2 sm:p-6 w-full min-w-max">
            {/* Render multiple root nodes if they exist (e.g., multiple Super Admins with no managers) */}
            <div className="flex flex-col gap-6">
              {treeData.map((rootNode) => (
                <OrgNode key={rootNode.id} employee={rootNode} level={0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgTree;
