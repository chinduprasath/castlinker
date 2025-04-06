

// Admin Dashboard Types
export interface DashboardStats {
  id?: string;
  users_count: number;
  active_jobs: number;
  pending_applications: number;
  new_users_today: number;
  revenue_today: number;
  last_updated?: string;
}

export interface AnalyticsData {
  id?: string;
  date: string;
  users_registered: number;
  jobs_posted: number;
  applications_submitted: number;
  revenue: number;
  page_views: number;
}

export interface ContentItem {
  id: string;
  content_type: string;
  content_id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  reported_at: string;
  reason: string;
  reporter_id?: string;
  action_taken?: string;
  action_by?: string;
  action_at?: string;
}

// Admin Job Types
export interface AdminJob {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  created_at: string;
  status: 'active' | 'draft' | 'closed' | 'expired';
  is_featured: boolean;
  is_verified: boolean;
}

