import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TaskStatusPieChart = ({ analytics }) => {
    if (!analytics) return null;

    const data = [
        { name: "Completed", value: analytics.completedTasks, color: "#10b981" }, // emerald-500
        { name: "In Progress", value: analytics.inProgressTasks, color: "#f59e0b" }, // amber-500
        { name: "Pending", value: analytics.pendingTasks, color: "#64748b" }, // slate-500
    ];

    // Filter out 0 values so the chart looks cleaner
    const activeData = data.filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-slate-200 font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl flex flex-col h-80 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Task Status Distribution</h3>
            {activeData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    No active tasks
                </div>
            ) : (
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={activeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {activeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TaskStatusPieChart;
