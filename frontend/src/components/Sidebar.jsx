import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
    }`;

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-indigo-400 font-bold text-xl">W</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Smart WMS</h1>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <NavLink to="/dashboard" className={navLinkClass}>
          <span className="font-medium">Dashboard</span>
        </NavLink>
        
        {isManagerOrAdmin && (
          <NavLink to="/tasks" className={navLinkClass}>
            <span className="font-medium">All Tasks</span>
          </NavLink>
        )}
        
        <NavLink to="/my-tasks" className={navLinkClass}>
          <span className="font-medium">My Tasks</span>
        </NavLink>
        
        {isManagerOrAdmin && (
          <NavLink to="/users" className={navLinkClass}>
            <span className="font-medium">Users</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800/50 shrink-0 bg-slate-900/30">
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-sm font-medium text-white truncate">{user?.email}</span>
          <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-800 rounded-md inline-flex self-start">
            {user?.role || 'ROLE_USER'}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-2.5 text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
