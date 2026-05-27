import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TaskTrendBarChart = ({ analytics }) => {
    if (!analytics) return null;

    const data = [
        { name: "Total", value: analytics.totalTasks, color: "#6366f1" }, // indigo-500
        { name: "Completed", value: analytics.completedTasks, color: "#10b981" }, // emerald-500
        { name: "In Progress", value: analytics.inProgressTasks, color: "#f59e0b" }, // amber-500
        { name: "Pending", value: analytics.pendingTasks, color: "#64748b" }, // slate-500
        { name: "Overdue", value: analytics.overdueTasks, color: "#f43f5e" }, // rose-500
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-slate-200 font-medium">{`${payload[0].payload.name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl flex flex-col h-80 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Task Overview</h3>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TaskTrendBarChart;
