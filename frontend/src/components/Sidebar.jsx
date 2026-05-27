import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, ListTodo, Users, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = user?.role || "EMPLOYEE";

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
        { path: "/tasks", label: "All Tasks", icon: <ListTodo size={20} />, roles: ["ADMIN", "MANAGER"] },
        { path: "/my-tasks", label: "My Tasks", icon: <CheckSquare size={20} />, roles: ["EMPLOYEE", "ADMIN", "MANAGER"] },
        { path: "/users", label: "Team", icon: <Users size={20} />, roles: ["ADMIN", "MANAGER"] },
    ];

    return (
        <aside className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col transition-all duration-300">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-bold text-xl">W</span>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Smart WMS
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems
                    .filter((item) => item.roles.includes(role))
                    .map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-800/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{user?.email}</p>
                        <p className="text-xs text-slate-500 font-medium">{role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
