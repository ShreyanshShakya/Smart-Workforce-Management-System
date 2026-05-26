import StatCard from './StatCard';

export default function AnalyticsCards({ total = 0, completed = 0, overdue = 0, inProgress = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Tasks" 
        value={total} 
        icon="📋" 
        color="indigo" 
      />
      <StatCard 
        title="In Progress" 
        value={inProgress} 
        icon="⚡" 
        color="sky" 
      />
      <StatCard 
        title="Completed" 
        value={completed} 
        icon="✅" 
        color="emerald" 
      />
      <StatCard 
        title="Overdue" 
        value={overdue} 
        icon="⚠️" 
        color="rose" 
      />
    </div>
  );
}