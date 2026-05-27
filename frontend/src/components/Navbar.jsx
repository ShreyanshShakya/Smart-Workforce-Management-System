import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title = "Dashboard" }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-slate-900/30 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Page Title */}
            <h2 className="text-xl font-semibold text-slate-200">{title}</h2>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar (Visual Only for now) */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="bg-slate-950 border border-slate-800/80 text-sm rounded-full pl-9 pr-4 py-1.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-64"
                    />
                </div>

                {/* Notifications */}
                <button className="relative text-slate-400 hover:text-slate-200 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </button>

                {/* Micro Profile */}
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-300">{user?.email?.split('@')[0]}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
