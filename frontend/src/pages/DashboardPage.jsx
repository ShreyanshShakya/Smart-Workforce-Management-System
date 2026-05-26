import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import AnalyticsCards from '../components/AnalyticsCards';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskTable from '../components/TaskTable';
import { getMyTasks, getOverdueTasks } from '../services/taskService';
import webSocketService from '../services/websocketService';

export default function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    const fetchTasks = useCallback(async () => {
        // Prevent synchronous state update inside effect
        try {
            if (isAdminOrManager) {
                // Fetch preview tasks (e.g. overdue tasks)
                const res = await getOverdueTasks();
                setTasks(Array.isArray(res) ? res.slice(0, 5) : []); 
            } else {
                const res = await getMyTasks();
                setTasks(res || []);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [isAdminOrManager]);

    useEffect(() => {
        setLoading(true);
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        webSocketService.connect(() => {
            webSocketService.subscribe('/topic/tasks', (updatedTask) => {
                setTasks(prevTasks => {
                    const exists = prevTasks.find(t => t.id === updatedTask.id);
                    if (exists) {
                        return prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                    }
                    // If employee and task is assigned to them, add to list
                    if (!isAdminOrManager && updatedTask.assignedTo === user?.email) {
                        return [updatedTask, ...prevTasks];
                    }
                    return prevTasks;
                });
            });
        });

        return () => {
            webSocketService.unsubscribe('/topic/tasks');
        };
    }, [isAdminOrManager, user?.email]);

    const handleTaskCreated = () => {
        setShowCreateForm(false);
        fetchTasks();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.email}</p>
                </div>
                {isAdminOrManager && (
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                        {showCreateForm ? 'Close Form' : 'Create New Task'}
                    </button>
                )}
            </div>

            <AnalyticsCards />

            {showCreateForm && isAdminOrManager && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-4">Create New Task</h2>
                    <CreateTaskForm onTaskCreated={handleTaskCreated} />
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">
                        {isAdminOrManager ? 'Overdue Tasks Preview' : 'My Recent Tasks'}
                    </h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
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