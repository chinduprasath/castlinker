
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchDashboardStats, 
  fetchRecentConnections, 
  fetchUpcomingAuditions,
  DashboardStats,
  RecentConnection,
  UpcomingAudition
} from '@/services/dashboardService';

export const useDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    activeJobs: 0,
    savedJobs: 0,
    profileViews: 0
  });
  const [recentConnections, setRecentConnections] = useState<RecentConnection[]>([]);
  const [upcomingAuditions, setUpcomingAuditions] = useState<UpcomingAudition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [statsData, connectionsData, auditionsData] = await Promise.all([
          fetchDashboardStats(user.id),
          fetchRecentConnections(user.id),
          fetchUpcomingAuditions(user.id)
        ]);

        setStats(statsData);
        setRecentConnections(connectionsData);
        setUpcomingAuditions(auditionsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  return {
    stats,
    recentConnections,
    upcomingAuditions,
    isLoading
  };
};
