import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function UsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getAllUsers();
                setUsers(res || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
        return (
            <div className="p-6 text-center text-rose-400">
                You do not have permission to view this page.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Team Members</h1>
                <p className="text-slate-400 text-sm mt-1">Manage workforce users and roles</p>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-900/50">
                                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="py-4 px-6 text-sm text-white font-medium">{u.name || 'N/A'}</td>
                                        <td className="py-4 px-6 text-sm text-slate-300">{u.email}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                u.role === 'MANAGER' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-400">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
