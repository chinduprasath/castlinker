
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Activity,
  Users,
  Briefcase,
  FileCheck,
  UserPlus,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DashboardStats, AnalyticsData } from '@/lib/adminTypes';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const { data: statsData, error: statsError } = await supabase
          .from('admin_dashboard_stats' as any)
          .select('*')
          .limit(1)
          .single();
        
        if (statsError) throw statsError;
        
        // Fetch analytics data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('admin_analytics' as any)
          .select('*')
          .order('date', { ascending: true });
        
        if (analyticsError) throw analyticsError;
        
        // Format analytics data for charts
        const formattedData = analyticsData.map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        
        setStats(statsData as DashboardStats);
        setAnalyticsData(formattedData as AnalyticsData[]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to the CastLinker admin dashboard.</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-card/50">
                <CardContent className="p-6 h-24" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <h3 className="text-2xl font-bold mt-1">{stats?.users_count.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                      <h3 className="text-2xl font-bold mt-1">{stats?.active_jobs.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <Briefcase className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                      <h3 className="text-2xl font-bold mt-1">{stats?.pending_applications.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-orange-500/10 rounded-full">
                      <FileCheck className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New Users Today</p>
                      <h3 className="text-2xl font-bold mt-1">{stats?.new_users_today.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded-full">
                      <UserPlus className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ${stats?.revenue_today.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </h3>
                    </div>
                    <div className="p-2 bg-emerald-500/10 rounded-full">
                      <DollarSign className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform Status</p>
                      <h3 className="text-xl font-bold mt-1 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Operational
                      </h3>
                    </div>
                    <div className="p-2 bg-gold/10 rounded-full">
                      <Activity className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="border-gold/10 shadow-sm">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="users_registered" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorUsers)" 
                          name="Users"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Jobs & Applications Chart */}
              <Card className="border-gold/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Jobs posted and applications submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="jobs_posted" 
                          name="Jobs Posted" 
                          fill="#82ca9d" 
                        />
                        <Bar 
                          dataKey="applications_submitted" 
                          name="Applications" 
                          fill="#ffc658" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
