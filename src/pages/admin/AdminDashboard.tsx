import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, FilmIcon, Calendar, Activity, Clock, Download, FileText, CheckCircle2, Eye, MessageSquare, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for charts
const postsByCategory = [
  { name: "Audition", value: 25 },
  { name: "Casting Call", value: 40 },
  { name: "Content Creation", value: 30 },
  { name: "Collaboration", value: 20 },
  { name: "Event", value: 15 },
  { name: "Job Opportunities", value: 35 },
  { name: "Mentorship", value: 10 },
  { name: "Others", value: 5 },
];

// Dummy data for monthly support tickets
const monthlyTicketData = [
  { month: "Jan", tickets: 150 },
  { month: "Feb", tickets: 120 },
  { month: "Mar", tickets: 250 },
  { month: "Apr", tickets: 180 },
  { month: "May", tickets: 220 },
  { month: "Jun", tickets: 190 },
  { month: "Jul", tickets: 210 },
  { month: "Aug", tickets: 240 },
  { month: "Sep", tickets: 200 },
  { month: "Oct", tickets: 230 },
  { month: "Nov", tickets: 260 },
  { month: "Dec", tickets: 280 },
];

const postEngagementData = [
  { month: "Jan", views: 2400, comments: 240, shares: 120 },
  { month: "Feb", views: 1398, comments: 139, shares: 70 },
  { month: "Mar", views: 9800, comments: 980, shares: 490 },
  { month: "Apr", views: 3908, comments: 390, shares: 195 },
  { month: "May", views: 4800, comments: 480, shares: 240 },
  { month: "Jun", views: 3800, comments: 380, shares: 190 },
  { month: "Jul", views: 4300, comments: 430, shares: 215 },
];

const teamSummaryData = [
  { role: "SuperAdmin", count: 1 },
  { role: "Admin", count: 3 },
  { role: "Manager", count: 5 },
  { role: "Editor", count: 8 },
  { role: "Reviewer", count: 12 },
  { role: "HR", count: 4 },
];

const recentActivities = [
  { id: 1, type: "post", action: "created", title: "Industry Spotlight: Summer Blockbusters", user: "Jane Smith", time: "2h ago" },
  { id: 2, type: "user", action: "approved", title: "John Walker's profile", user: "Admin Team", time: "4h ago" },
  { id: 3, type: "job", action: "updated", title: "Senior Actor Position", user: "HR Team", time: "6h ago" },
  { id: 4, type: "post", action: "edited", title: "5 Tips for Audition Success", user: "Content Editor", time: "8h ago" },
  { id: 5, type: "event", action: "created", title: "Summer Casting Workshop", user: "Events Team", time: "1d ago" },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FF69B4', '#BA55D3'];

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(135);
  const [totalJobs, setTotalJobs] = useState<number>(86);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>("month");
  
  // Fetch users data
  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        // Fetch total users count
        const { count, error: countError } = await supabase
          .from('users_management')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalUsers(count || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsersData();
  }, []);

  // Fetch projects data
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const { count, error: countError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalProjects(count || 0);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project data");
      }
    };
    
    fetchProjectsData();
  }, []);

  // Activity icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case "user":
        return <Users className="h-4 w-4 text-green-500" />;
      case "job":
        return <FilmIcon className="h-4 w-4 text-amber-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Action icon based on action type
  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case "updated":
      case "edited":
        return <Activity className="h-3 w-3 text-amber-500" />;
      case "approved":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      default:
        return <Eye className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">Admin Dashboard</h1>
      <p className="text-muted-foreground">Overview of platform statistics and insights.</p>
      
      {/* Summary statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Total Users</span>
              </CardTitle>
              <CardDescription>Platform registrations</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalUsers}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Total Posts</span>
              </CardTitle>
              <CardDescription>Published content</CardDescription>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>15% from last month</span>
            </div>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Active Jobs</span>
              </CardTitle>
              <CardDescription>Open positions</CardDescription>
            </div>
            <FilmIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Total Projects</span>
              </CardTitle>
              <CardDescription>Created by users</CardDescription>
            </div>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalProjects}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>N/A (Data needed)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Overview and Engagement */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Posts Overview</CardTitle>
                <CardDescription>Content distribution by category</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={postsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {postsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} posts`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Support Tickets</CardTitle>
                <CardDescription>Number of support tickets received each month</CardDescription>
              </div>
              <Select defaultValue="past-6-months">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="past-6-months">Past 6 Months</SelectItem>
                  <SelectItem value="past-year">Past Year</SelectItem>
                  {/* Add filters for current/previous year and ticket status here later */}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTicketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#888" label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#888' }} />
                  <YAxis stroke="#888" label={{ value: 'Number of Tickets Received', angle: -90, position: 'insideLeft', fill: '#888' }} />
                  <Tooltip 
                    formatter={(value) => [`${~~value} Tickets`, 'Count']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #555' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <Bar dataKey="tickets" fill="#8884d8" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team summary and recent activities */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Summary</CardTitle>
                <CardDescription>Distribution of team members by role</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamSummaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Team Members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-5 w-1/5" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="divide-y divide-border/20">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="py-3 flex items-start space-x-3">
                      <div className="rounded-full bg-card p-2 border">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium leading-none">
                                {activity.title}
                              </p>
                              <div className="bg-muted px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                                {getActionIcon(activity.action)}
                                <span className="text-xs">{activity.action}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              by {activity.user}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
