import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import AnalyticsCards from '../components/AnalyticsCards';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskTable from '../components/TaskTable';
import { getMyTasks, getAllTasks, getAnalytics, getMyAnalytics, createTask } from '../services/taskService';
import { getAllUsers } from '../services/userService';
import webSocketService from '../services/websocketService';
import TaskStatusPieChart from '../components/charts/TaskStatusPieChart';
import TaskTrendBarChart from '../components/charts/TaskTrendBarChart';

export default function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    const fetchTasks = useCallback(async () => {
        // Prevent synchronous state update inside effect
        try {
            if (isAdminOrManager) {
                // Fetch preview tasks (recent tasks)
                const res = await getAllTasks(0, 5, 'createdAt', 'desc');
                setTasks(res.content || []);
                const stats = await getAnalytics();
                setAnalytics(stats);
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers || []);
            } else {
                const res = await getMyTasks();
                setTasks(res || []);
                const stats = await getMyAnalytics();
                setAnalytics(stats);
            }
        } catch (error) {
            console.error("Failed to fetch tasks/users:", error);
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
                fetchTasks(); // Refetch to update analytics and tasks easily
            });
        });

        return () => {
            webSocketService.unsubscribe('/topic/tasks');
        };
    }, [isAdminOrManager, user?.email, fetchTasks]);

    const handleCreateTask = async (taskData) => {
        try {
            await createTask(taskData);
            setShowCreateForm(false);
            fetchTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Failed to create task. Please try again.");
        }
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

            {analytics && <AnalyticsCards analytics={analytics} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskStatusPieChart analytics={analytics} />
                <TaskTrendBarChart analytics={analytics} />
            </div>

            {showCreateForm && isAdminOrManager && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-4">Create New Task</h2>
                    <CreateTaskForm 
                        users={users} 
                        onSubmit={handleCreateTask} 
                        onCancel={() => setShowCreateForm(false)} 
                    />
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">
                        {isAdminOrManager ? 'Recent Tasks' : 'My Recent Tasks'}
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