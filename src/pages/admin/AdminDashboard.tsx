
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, FilmIcon, Calendar, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import UserDataViz from "@/components/admin/UserDataViz";

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
          .select('role');
        
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
  
  return (
    <AdminLayout>
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
        <UserGrowthChart usersByMonth={usersByMonth} isLoading={loading} />
        
        {/* Users by profession chart with filter */}
        <UserDataViz usersByRole={usersByRole} isLoading={loading} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
