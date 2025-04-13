import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, FilmIcon, Calendar, Activity, Clock, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UsersByRole = {
  role: string;
  count: number;
};

type UserCountByMonth = {
  month: string;
  count: number;
};

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersByRole, setUsersByRole] = useState<UsersByRole[]>([]);
  const [usersByMonth, setUsersByMonth] = useState<UserCountByMonth[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  
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
        
        // Fetch users by role
        const { data: roleData, error: roleError } = await supabase
          .from('users_management')
          .select('role, count')
          .select();
        
        if (roleError) throw roleError;
        
        // Process role data for chart
        const roleCountMap: Record<string, number> = {};
        roleData?.forEach((user: any) => {
          const role = user.role;
          roleCountMap[role] = (roleCountMap[role] || 0) + 1;
        });
        
        const roleChartData = Object.entries(roleCountMap).map(([role, count]) => ({
          role,
          count,
        }));
        
        setUsersByRole(roleChartData);
        
        // Create mock data for users by month (for demonstration)
        // In a real application, this would come from the database with proper date aggregation
        const mockMonthlyData = [
          { month: "Jan", count: 45 },
          { month: "Feb", count: 52 },
          { month: "Mar", count: 61 },
          { month: "Apr", count: 67 },
          { month: "May", count: 75 },
          { month: "Jun", count: 87 },
          { month: "Jul", count: 91 },
          { month: "Aug", count: 99 },
          { month: "Sep", count: 110 },
          { month: "Oct", count: 123 },
          { month: "Nov", count: 131 },
          { month: "Dec", count: 142 },
        ];
        
        setUsersByMonth(mockMonthlyData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsersData();
  }, []);
  
  // Filter users by profession
  const filteredUsersByRole = selectedProfession === "all" 
    ? usersByRole 
    : usersByRole.filter(item => item.role === selectedProfession);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">Admin Dashboard</h1>
      <p className="text-muted-foreground">Overview of platform statistics and insights.</p>
      
      {/* User statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CardDescription>Open positions</CardDescription>
            </div>
            <FilmIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <CardDescription>Scheduled this month</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>20% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">User Activity</CardTitle>
              <CardDescription>Daily active users</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>5% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User growth chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
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
              <AreaChart data={usersByMonth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="count" name="Users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Users by profession chart with filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Users by Profession</CardTitle>
              <CardDescription>Breakdown of user professional roles</CardDescription>
            </div>
            
            {/* Profession filter */}
            <Select
              value={selectedProfession}
              onValueChange={setSelectedProfession}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professions</SelectItem>
                <SelectItem value="actor">Actors</SelectItem>
                <SelectItem value="director">Directors</SelectItem>
                <SelectItem value="producer">Producers</SelectItem>
                <SelectItem value="writer">Writers</SelectItem>
                <SelectItem value="cinematographer">Cinematographers</SelectItem>
                <SelectItem value="agency">Agencies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading user data...</p>
              </div>
            ) : filteredUsersByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredUsersByRole}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No user data available for the selected profession.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
