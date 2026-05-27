import StatCard from './StatCard';

export default function AnalyticsCards({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Tasks" 
        value={analytics.totalTasks} 
        icon="📋" 
        color="indigo" 
      />
      <StatCard 
        title="Pending & In Progress" 
        value={analytics.pendingTasks} 
        icon="⚡" 
        color="sky" 
      />
      <StatCard 
        title="Completed" 
        value={analytics.completedTasks} 
        icon="✅" 
        color="emerald" 
      />
      <StatCard 
        title="Overdue" 
        value={analytics.overdueTasks} 
        icon="⚠️" 
        color="rose" 
      />
    </div>
  );
}