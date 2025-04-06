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
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AnalyticsData } from '@/lib/adminTypes';

// Analytics color palette
const colors = {
  users: "#8884d8",
  jobs: "#82ca9d",
  applications: "#ffc658",
  revenue: "#ff8042",
  views: "#0088fe"
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_analytics' as any)
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        // Format dates for display
        const formattedData = data.map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        
        setAnalyticsData(formattedData as unknown as AnalyticsData[]);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  const renderChart = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Card className="border-gold/10 shadow-sm">
            <CardHeader>
              <CardTitle>User Registrations Over Time</CardTitle>
              <CardDescription>Trend of new user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users_registered" stroke={colors.users} fill={colors.users} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'jobs':
        return (
          <Card className="border-gold/10 shadow-sm">
            <CardHeader>
              <CardTitle>Jobs Posted Over Time</CardTitle>
              <CardDescription>Trend of new job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobs_posted" fill={colors.jobs} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'applications':
        return (
          <Card className="border-gold/10 shadow-sm">
            <CardHeader>
              <CardTitle>Applications Submitted Over Time</CardTitle>
              <CardDescription>Trend of job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications_submitted" stroke={colors.applications} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'revenue':
        return (
          <Card className="border-gold/10 shadow-sm">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Trend of platform revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke={colors.revenue} fill={colors.revenue} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'pageviews':
        return (
          <Card className="border-gold/10 shadow-sm">
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
              <CardDescription>Trend of page views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="page_views" stroke={colors.views} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>Total user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users_registered" stroke={colors.users} fill={colors.users} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>Jobs & Applications</CardTitle>
                <CardDescription>Jobs posted vs applications submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="jobs_posted" fill={colors.jobs} />
                      <Bar dataKey="applications_submitted" fill={colors.applications} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue & Page Views</CardTitle>
                <CardDescription>Revenue generated vs page views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke={colors.revenue} />
                      <Line type="monotone" dataKey="page_views" stroke={colors.views} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <p>Select a category to view analytics.</p>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Explore platform analytics and trends.</p>

        <Card className="border-gold/10 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>
              Explore various analytics categories to understand platform performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Overview</TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Users</TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Jobs</TabsTrigger>
                <TabsTrigger value="applications" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Applications</TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Revenue</TabsTrigger>
                {/* <TabsTrigger value="pageviews">Page Views</TabsTrigger> */}
              </TabsList>
              <TabsContent value="overview">
                {isLoading ? (
                  <p>Loading analytics data...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
              <TabsContent value="users">
                {isLoading ? (
                  <p>Loading user analytics...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
              <TabsContent value="jobs">
                {isLoading ? (
                  <p>Loading job analytics...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
              <TabsContent value="applications">
                {isLoading ? (
                  <p>Loading application analytics...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
              <TabsContent value="revenue">
                {isLoading ? (
                  <p>Loading revenue analytics...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
              <TabsContent value="pageviews">
                {isLoading ? (
                  <p>Loading page view analytics...</p>
                ) : (
                  renderChart()
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
