import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getAnalytics, getMyAnalytics } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import webSocketService from '../services/websocketService';

export default function AnalyticsCards() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0
  });

  const fetchAnalyticsData = async () => {
    try {
      if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
        const data = await getAnalytics();
        setAnalytics(data);
      } else if (user?.email) {
        const data = await getMyAnalytics();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  useEffect(() => {
    webSocketService.connect(() => {
      webSocketService.subscribe('/topic/tasks', () => {
        fetchAnalyticsData();
      });
    });
  }, [user]);

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