import { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable';
import { getMyTasks } from '../services/taskService';
import webSocketService from '../services/websocketService';
import { useAuth } from '../context/AuthContext';

export default function MyTasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getMyTasks();
            setTasks(res || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        webSocketService.connect(() => {
            webSocketService.subscribe('/topic/tasks', (updatedTask) => {
                setTasks(prevTasks => {
                    const exists = prevTasks.find(t => t.id === updatedTask.id);
                    if (exists) {
                        return prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                    }
                    if (updatedTask.assignedTo === user?.email) {
                        return [updatedTask, ...prevTasks];
                    }
                    return prevTasks;
                });
            });
        });

        return () => {
            webSocketService.unsubscribe('/topic/tasks');
        };
    }, [user?.email]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                <p className="text-slate-400 text-sm mt-1">View and manage your assigned tasks</p>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <TaskTable tasks={tasks} onTaskUpdated={fetchTasks} />
                    )}
                </div>
            </div>
        </div>
    );
}
