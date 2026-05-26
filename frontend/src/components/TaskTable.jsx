
const priorityColors = {
  HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
};

const statusColors = {
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

export default function TaskTable({ tasks = [], onStatusChange }) {
  const isOverdue = (deadline, status) => {
    if (!deadline || status === 'COMPLETED') return false;
    // Set current date time to 00:00:00 for strict day comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const taskDeadline = new Date(deadline);
    return taskDeadline < now;
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center backdrop-blur-xl">
        <p className="text-slate-400">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-950/50 border-b border-slate-800/50 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Assignee</th>
              <th className="px-6 py-4 font-medium">Deadline</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {tasks.map((task) => {
              const overdue = isOverdue(task.deadline, task.status);
              
              return (
                <tr 
                  key={task.id} 
                  className={`transition-colors hover:bg-slate-800/30 ${
                    overdue ? 'bg-rose-500/[0.02]' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{task.title}</div>
                    <div className="text-xs text-slate-500 max-w-[200px] md:max-w-xs lg:max-w-md truncate mt-0.5">
                      {task.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority] || priorityColors.LOW}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[task.status] || statusColors.PENDING}`}>
                      {task.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{task.assignedTo || 'Unassigned'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${overdue ? 'text-rose-400 font-medium' : 'text-slate-400'}`}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {onStatusChange && task.status !== 'COMPLETED' ? (
                      <select
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center text-emerald-500 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Done
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}