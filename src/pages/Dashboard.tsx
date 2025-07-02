import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Film, 
  Star, 
  Users, 
  ChevronRight, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  Briefcase, 
  MapPin, 
  MessageCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Bell,
  Eye,
  Zap,
  Heart,
  ThumbsUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { dashboardData } from "@/utils/dummyData";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { fetchPostsByUser, fetchPosts, Post } from '@/services/postsService';
import JobCard from '@/components/jobs/JobCard';
import { Job } from '@/types/jobTypes';
import { formatDate, formatSalary } from '@/components/jobs/utils/jobFormatters';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const firstName = user?.name?.split(' ')[0] || 'Actor';
  const [stats, setStats] = useState({
    ...dashboardData.stats,
    connections: 48,
    likes: 126,
  });
  const [recentOpportunities, setRecentOpportunities] = useState(() => {
    return dashboardData.recentOpportunities.map(job => ({
      ...job,
      applied: false
    }));
  });
  const [recentMessages, setRecentMessages] = useState(dashboardData.recentMessages);
  const [upcomingEvents, setUpcomingEvents] = useState(dashboardData.upcomingEvents);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [profileLikes, setProfileLikes] = useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loadingRecentJobs, setLoadingRecentJobs] = useState(true);
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [topNotifications, setTopNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          connections: prev.connections + 1
        }));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchApplicationsCount = async () => {
      const q = query(collection(db, 'jobApplications'), where('user_id', '==', user.id));
      const snapshot = await getDocs(q);
      setApplicationsCount(snapshot.size);
    };
    fetchApplicationsCount();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchConnectionsCount = async () => {
      const q = query(collection(db, 'connection_requests'), where('status', '==', 'accepted'));
      const snapshot = await getDocs(q);
      const connections = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.requesterId === user.id || data.recipientId === user.id;
      });
      setConnectionsCount(connections.length);
    };
    fetchConnectionsCount();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchProfileLikes = async () => {
      const q = query(collection(db, 'talent_profiles'), where('user_id', '==', user.id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setProfileLikes(data.likes || 0);
      }
    };
    fetchProfileLikes();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchUserPosts = async () => {
      const posts = await fetchPostsByUser(user.id);
      setTotalPosts(posts.length);
    };
    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      setLoadingRecentJobs(true);
      const jobsRef = collection(db, 'film_jobs');
      const q = query(jobsRef, where('status', '==', 'active'), orderBy('created_at', 'desc'), limit(3));
      const snapshot = await getDocs(q);
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentJobs(jobs);
      setLoadingRecentJobs(false);
    };
    fetchRecentJobs();
  }, []);

  useEffect(() => {
    const fetchTopPosts = async () => {
      setLoadingPosts(true);
      const posts = await fetchPosts();
      setTopPosts(posts.slice(0, 3));
      setLoadingPosts(false);
    };
    fetchTopPosts();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchTopNotifications = async () => {
      setLoadingNotifications(true);
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopNotifications(notifs);
      setLoadingNotifications(false);
    };
    fetchTopNotifications();
  }, [user?.id]);

  const handleNavigateToJobs = () => {
    navigate('/jobs');
  };
  
  const handleNavigateToMessages = () => {
    navigate('/chat');
  };
  
  const handleNavigateToNotifications = () => {
    navigate('/notifications');
  };
  
  const handleNavigateToCalendar = () => {
    toast({
      title: "Coming Soon",
      description: "Calendar functionality will be available soon"
    });
  };

  const handleApplyToJob = (jobId: number) => {
    const updatedOpportunities = recentOpportunities.map(job => 
      job.id === jobId ? { ...job, applied: true } : job
    );
    setRecentOpportunities(updatedOpportunities);
    
    setStats(prev => ({
      ...prev, 
      applications: prev.applications + 1
    }));
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="space-y-4 pr-1">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col space-y-1">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Hello, {firstName}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your activity summary and upcoming opportunities
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/manage')}>Manage</Button>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gold/10 hover:border-gold/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">Applications</span>
                </CardTitle>
                <div className="rounded-full bg-gold/10 p-2">
                  <Briefcase className="h-4 w-4 text-gold" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{applicationsCount}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +2
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    since last week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <Card className="border-indigo-500/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">Connections</span>
                </CardTitle>
                <div className="rounded-full bg-indigo-500/10 p-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{connectionsCount}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +5
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    from last month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <Card className="border-pink-500/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-pink-500/10 hover:border-pink-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">Likes</span>
                </CardTitle>
                <div className="rounded-full bg-pink-500/10 p-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{profileLikes}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    new likes this week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <Card className="border-amber-500/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-500/10 hover:border-amber-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">Total Posts</span>
                </CardTitle>
                <div className="rounded-full bg-amber-500/10 p-2">
                  <Film className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{totalPosts}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-muted-foreground ml-1.5">
                    total posts created
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="border-gold/10 lg:col-span-2 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
          <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold/10 p-2">
                  <Film className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-xl">Recently Created Jobs</CardTitle>
                  <CardDescription className="mt-0.5">
                    The latest opportunities posted on the platform
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs gap-1 border-gold/20 text-gold hover:text-gold/80 hover:bg-gold/10"
                onClick={handleNavigateToJobs}
              >
                View all
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingRecentJobs ? (
              <div className="divide-y divide-border/10">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-14 w-14 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {recentJobs.map((job: Job) => (
                  <div key={job.id} className="p-2">
                    <JobCard
                      job={job}
                      isSaved={false}
                      onSaveClick={() => {}}
                      onViewDetailsClick={() => {}}
                      onApplyClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {/* Top 3 Posts Card */}
          <Card className="border-blue-500/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-blue-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <Film className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Recent Posts</CardTitle>
                  <CardDescription className="mt-0.5">Top 3 most recent posts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingPosts ? (
                <div className="divide-y divide-border/10">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {topPosts.map(post => (
                    <div
                      key={post.id}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 transition-colors"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base text-foreground/90 truncate">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{post.description}</div>
                      </div>
                      <ArrowRight className="ml-4 flex-shrink-0 text-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top 5 Notifications Card */}
          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold/10 p-2">
                  <Bell className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notifications</CardTitle>
                  <CardDescription className="mt-0.5">Top 5 most recent notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingNotifications ? (
                <div className="divide-y divide-border/10">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <div key={idx} className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {topNotifications.map((notif) => (
                    <div key={notif.id} className="p-4">
                      <div className="font-semibold text-base text-foreground/90">{notif.title}</div>
                      <div className="text-sm text-muted-foreground mb-1">{notif.message}</div>
                      <div className="text-xs text-muted-foreground">{notif.createdAt && (notif.createdAt.toDate ? notif.createdAt.toDate().toLocaleString() : new Date(notif.createdAt).toLocaleString())}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={openPostDialog} onOpenChange={setOpenPostDialog}>
        <DialogContent className="max-w-2xl">
          {selectedPost && (
            <div>
              <div className="text-xl font-bold mb-2">{selectedPost.title}</div>
              <div className="text-muted-foreground mb-4">{selectedPost.description}</div>
              {/* Add more post details here as needed */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
