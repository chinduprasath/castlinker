
import { Database as OriginalDatabase } from './types';

declare global {
  type Database = OriginalDatabase & {
    public: {
      Tables: {
        admin_dashboard_stats: {
          Row: {
            id: string;
            users_count: number;
            active_jobs: number;
            pending_applications: number;
            new_users_today: number;
            revenue_today: number;
            last_updated: string;
          };
          Insert: {
            id?: string;
            users_count: number;
            active_jobs: number;
            pending_applications: number;
            new_users_today: number;
            revenue_today: number;
            last_updated?: string;
          };
          Update: {
            id?: string;
            users_count?: number;
            active_jobs?: number;
            pending_applications?: number;
            new_users_today?: number;
            revenue_today?: number;
            last_updated?: string;
          };
        };
        admin_analytics: {
          Row: {
            id: string;
            date: string;
            users_registered: number;
            jobs_posted: number;
            applications_submitted: number;
            revenue: number;
            page_views: number;
          };
          Insert: {
            id?: string;
            date: string;
            users_registered: number;
            jobs_posted: number;
            applications_submitted: number;
            revenue: number;
            page_views: number;
          };
          Update: {
            id?: string;
            date?: string;
            users_registered?: number;
            jobs_posted?: number;
            applications_submitted?: number;
            revenue?: number;
            page_views?: number;
          };
        };
        content_moderation: {
          Row: {
            id: string;
            content_type: string;
            content_id: string;
            title: string;
            status: string;
            reporter_id?: string;
            reported_at: string;
            reason?: string;
            action_taken?: string;
            action_by?: string;
            action_at?: string;
          };
          Insert: {
            id?: string;
            content_type: string;
            content_id: string;
            title: string;
            status?: string;
            reporter_id?: string;
            reported_at?: string;
            reason?: string;
            action_taken?: string;
            action_by?: string;
            action_at?: string;
          };
          Update: {
            id?: string;
            content_type?: string;
            content_id?: string;
            title?: string;
            status?: string;
            reporter_id?: string;
            reported_at?: string;
            reason?: string;
            action_taken?: string;
            action_by?: string;
            action_at?: string;
          };
        };
      };
    };
  };
}
