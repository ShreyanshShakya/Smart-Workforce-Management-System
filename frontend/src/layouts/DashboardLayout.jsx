import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen bg-slate-950 text-slate-300 overflow-hidden flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-semibold text-white"></h2>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-slate-400">Welcome, </span>
              <span className="font-medium text-white">{user?.email || 'User'}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
