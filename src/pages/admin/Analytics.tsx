
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  Calendar,
  ArrowUpRight,
  Users,
  Briefcase,
  FileText,
  LineChart as LineChartIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  date: string;
  users_registered: number;
  jobs_posted: number;
  applications_submitted: number;
  revenue: number;
  page_views: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_analytics')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        // Format dates for display
        const formattedData = data.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        
        setAnalyticsData(formattedData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
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

  // Calculate totals for the selected time range
  const calculateTotals = () => {
    if (!analyticsData.length) return { users: 0, jobs: 0, applications: 0, revenue: 0, views: 0 };
    
    const dataToUse = analyticsData;
    
    return {
      users: dataToUse.reduce((sum, item) => sum + item.users_registered, 0),
      jobs: dataToUse.reduce((sum, item) => sum + item.jobs_posted, 0),
      applications: dataToUse.reduce((sum, item) => sum + item.applications_submitted, 0),
      revenue: dataToUse.reduce((sum, item) => sum + item.revenue, 0),
      views: dataToUse.reduce((sum, item) => sum + item.page_views, 0)
    };
  };

  const totals = calculateTotals();

  // Data for pie chart
  const pieData = [
    { name: 'Users', value: totals.users },
    { name: 'Jobs', value: totals.jobs },
    { name: 'Applications', value: totals.applications }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">Analytics</h1>
            <p className="text-muted-foreground">View platform performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Select
              defaultValue={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-32 md:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gold/10 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Users</p>
                  <h3 className="text-2xl font-bold mt-1">{totals.users}</h3>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12% from last period</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gold/10 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jobs Posted</p>
                  <h3 className="text-2xl font-bold mt-1">{totals.jobs}</h3>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+5% from last period</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Briefcase className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gold/10 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <h3 className="text-2xl font-bold mt-1">{totals.applications}</h3>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+18% from last period</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gold/10 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">
                    ${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+8% from last period</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-purple-500">
                    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Users</TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Jobs</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gold/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Combined activity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {!isLoading && analyticsData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData}
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="users_registered" name="Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="jobs_posted" name="Jobs" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="applications_submitted" name="Applications" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gold/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Distribution</CardTitle>
                  <CardDescription>Activity distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {!isLoading && analyticsData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {!isLoading && analyticsData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
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
                          name="New Users"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="page_views" 
                          stroke="#82ca9d" 
                          fillOpacity={0.3} 
                          fill="#82ca9d" 
                          name="Page Views"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>Job Activity</CardTitle>
                <CardDescription>Job postings and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {!isLoading && analyticsData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="jobs_posted" name="Jobs Posted" fill="#8884d8" />
                        <Bar dataKey="applications_submitted" name="Applications" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card className="border-gold/10 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {!isLoading && analyticsData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#82ca9d" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          name="Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
