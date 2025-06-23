
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

export interface DashboardStats {
  totalApplications: number;
  activeJobs: number;
  savedJobs: number;
  profileViews: number;
}

export interface RecentConnection {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connected_at: string;
}

export interface UpcomingAudition {
  id: string;
  title: string;
  company: string;
  date: string;
  location: string;
  status: 'confirmed' | 'pending';
}

export const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    // Mock data for now - in production, these would be real Firebase queries
    return {
      totalApplications: 12,
      activeJobs: 45,
      savedJobs: 8,
      profileViews: 156
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalApplications: 0,
      activeJobs: 0,
      savedJobs: 0,
      profileViews: 0
    };
  }
};

export const fetchRecentConnections = async (userId: string): Promise<RecentConnection[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Casting Director',
        avatar: '/placeholder.svg',
        connected_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Film Producer',
        avatar: '/placeholder.svg',
        connected_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '3',
        name: 'Emma Davis',
        role: 'Director',
        avatar: '/placeholder.svg',
        connected_at: new Date(Date.now() - 259200000).toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching recent connections:', error);
    return [];
  }
};

export const fetchUpcomingAuditions = async (userId: string): Promise<UpcomingAudition[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        title: 'Lead Role Audition',
        company: 'Paramount Pictures',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Los Angeles, CA',
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Supporting Character',
        company: 'Netflix Originals',
        date: new Date(Date.now() + 259200000).toISOString(),
        location: 'Atlanta, GA',
        status: 'pending'
      }
    ];
  } catch (error) {
    console.error('Error fetching upcoming auditions:', error);
    return [];
  }
};
