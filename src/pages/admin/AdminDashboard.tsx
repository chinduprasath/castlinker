import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, FileText, TrendingUp, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [pendingPosts, setPendingPosts] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch total users
      const usersQuery = collection(db, "users_management");
      const usersSnapshot = await getDocs(usersQuery);
      setTotalUsers(usersSnapshot.size);

      // Fetch total jobs
      const jobsQuery = collection(db, "film_jobs");
      const jobsSnapshot = await getDocs(jobsQuery);
      setTotalJobs(jobsSnapshot.size);

      // Fetch active jobs
      const activeJobsQuery = query(jobsQuery, where("status", "==", "active"));
      const activeJobsSnapshot = await getDocs(activeJobsQuery);
      setActiveJobs(activeJobsSnapshot.size);

      // Fetch pending posts
      const postsQuery = collection(db, "castlinker_posts");
      const pendingPostsQuery = query(postsQuery, where("status", "==", "pending"));
      const pendingPostsSnapshot = await getDocs(pendingPostsQuery);
      setPendingPosts(pendingPostsSnapshot.size);

      // Fetch upcoming events (example: events happening in the next 7 days)
      const eventsQuery = collection(db, "events");
      // const now = new Date();
      // const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in the future
      // const upcomingEventsQuery = query(eventsQuery, where("date", ">=", now), where("date", "<=", future));
      const eventsSnapshot = await getDocs(eventsQuery);
      setUpcomingEvents(eventsSnapshot.size);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load dashboard data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor key metrics and manage platform resources.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
              <CardDescription>Registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{totalUsers}</span>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
            <Link to="/admin/users" className="block">
              <Button variant="link" className="justify-start">
                View Users
              </Button>
            </Link>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Total Jobs</CardTitle>
              <CardDescription>Active job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{totalJobs}</span>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Briefcase className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
            <Link to="/admin/jobs" className="block">
              <Button variant="link" className="justify-start">
                View Jobs
              </Button>
            </Link>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Active Jobs</CardTitle>
              <CardDescription>Jobs currently open for applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{activeJobs}</span>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Pending Posts</CardTitle>
              <CardDescription>User-submitted posts awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{pendingPosts}</span>
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
            <Link to="/admin/posts" className="block">
              <Button variant="link" className="justify-start">
                View Posts
              </Button>
            </Link>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
              <CardDescription>Scheduled events and workshops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{upcomingEvents}</span>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Platform Growth</CardTitle>
              <CardDescription>Recent trends and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">+12%</span>
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
