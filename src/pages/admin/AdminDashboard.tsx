import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart, Line, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 250 },
  { month: 'Apr', users: 310 },
  { month: 'May', users: 420 },
  { month: 'Jun', users: 490 },
  { month: 'Jul', users: 580 }
];

const jobPostsData = [
  { category: 'Acting', value: 45 },
  { category: 'Directing', value: 15 },
  { category: 'Production', value: 25 },
  { category: 'Writing', value: 10 },
  { category: 'Other', value: 5 },
];

const engagementData = [
  { source: 'Jobs', views: 4200, applications: 2100 },
  { source: 'Profiles', views: 5800, applications: 0 },
  { source: 'Events', views: 2300, applications: 980 },
  { source: 'Content', views: 3100, applications: 0 },
];

const COLORS = ['#CFB53B', '#D4AF37', '#F5D76E', '#FFDF00', '#DAA520'];

const recentActivities = [
  { id: 1, type: 'user', action: 'joined', user: { name: 'Michael Chen', role: 'Actor', avatar: '/placeholder.svg' }, time: '5 min ago' },
  { id: 2, type: 'content', action: 'reported', user: { name: 'Sarah Williams', role: 'Director', avatar: '/placeholder.svg' }, item: 'Inappropriate comment', time: '10 min ago' },
  { id: 3, type: 'job', action: 'posted', user: { name: 'Production Studios', role: 'Company', avatar: '/placeholder.svg' }, item: 'Lead Actor for Feature Film', time: '30 min ago' },
  { id: 4, type: 'user', action: 'verification', user: { name: 'James Rodriguez', role: 'Producer', avatar: '/placeholder.svg' }, time: '1 hour ago' },
  { id: 5, type: 'event', action: 'created', user: { name: 'Film Festival Org', role: 'Organization', avatar: '/placeholder.svg' }, item: 'Annual Film Festival', time: '2 hours ago' },
];

const pendingApprovals = [
  { id: 1, type: 'Job', title: 'Stunt Performer for Action Movie', company: 'Action Films Inc.', submitted: '2 days ago', status: 'pending' },
  { id: 2, type: 'Content', title: 'Industry Insights Article', author: 'Film Academy', submitted: '1 day ago', status: 'pending' },
  { id: 3, type: 'Verification', title: 'Director Profile Verification', user: 'Emily Johnson', submitted: '3 days ago', status: 'pending' },
  { id: 4, type: 'Event', title: 'Screenwriters Workshop', organizer: 'Writers Guild', submitted: '12 hours ago', status: 'pending' },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const { theme } = useTheme();

  const getCardStyle = () => {
    return theme === 'light' 
      ? 'bg-white shadow-md border border-gray-100' 
      : 'bg-card-gradient backdrop-blur-sm border-gold/10';
  };

  const getTextColor = () => {
    return theme === 'light' ? 'text-gray-800' : 'text-foreground';
  };

  const getMutedTextColor = () => {
    return theme === 'light' ? 'text-gray-500' : 'text-muted-foreground';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-amber-600' : 'gold-gradient-text'}`}>Admin Dashboard</h1>
          <Tabs defaultValue="7d" className="w-[300px]" onValueChange={setTimeRange}>
            <TabsList className={`grid w-full grid-cols-4 ${theme === 'light' ? 'bg-amber-100' : 'bg-gold/10'}`}>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className={getCardStyle()}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Users</CardTitle>
              <Users className={`h-5 w-5 ${theme === 'light' ? 'text-amber-600' : 'text-gold'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,584</div>
              <p className={`text-xs ${getMutedTextColor()} mt-1`}>
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className={getCardStyle()}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Active Jobs</CardTitle>
              <MessageSquare className={`h-5 w-5 ${theme === 'light' ? 'text-amber-600' : 'text-gold'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className={`text-xs ${getMutedTextColor()} mt-1`}>
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className={getCardStyle()}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
              <Calendar className={`h-5 w-5 ${theme === 'light' ? 'text-amber-600' : 'text-gold'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className={`text-xs ${getMutedTextColor()} mt-1`}>
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+4.7%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className={getCardStyle()}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Pending Approvals</CardTitle>
              <Bell className={`h-5 w-5 ${theme === 'light' ? 'text-amber-600' : 'text-gold'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42</div>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs py-0 bg-orange-500/10 text-orange-500 border-orange-500/30">
                  Requires Attention
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className={getCardStyle()}>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User signups over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "#ddd" : "#222"} />
                    <XAxis dataKey="month" stroke={theme === 'light' ? "#555" : "#888"} />
                    <YAxis stroke={theme === 'light' ? "#555" : "#888"} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'light' ? '#fff' : '#333', 
                        border: theme === 'light' ? '1px solid #ddd' : '1px solid #444',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke={theme === 'light' ? "#D4AF37" : "#CFB53B"} 
                      strokeWidth={2} 
                      dot={{ stroke: theme === 'light' ? "#D4AF37" : "#CFB53B", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: theme === 'light' ? "#D4AF37" : "#CFB53B", strokeWidth: 2 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={getCardStyle()}>
            <CardHeader>
              <CardTitle>Platform Engagement</CardTitle>
              <CardDescription>Views and applications by section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "#ddd" : "#222"} />
                    <XAxis dataKey="source" stroke={theme === 'light' ? "#555" : "#888"} />
                    <YAxis stroke={theme === 'light' ? "#555" : "#888"} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'light' ? '#fff' : '#333', 
                        border: theme === 'light' ? '1px solid #ddd' : '1px solid #444',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="views" fill={theme === 'light' ? "#D4AF37" : "#CFB53B"} />
                    <Bar dataKey="applications" fill={theme === 'light' ? "#F5D76E" : "#D4AF37"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`${getCardStyle()} lg:col-span-2`}>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`flex items-start pb-3 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'}`}>
                    <Avatar className={`h-9 w-9 ${theme === 'light' ? 'border-amber-200' : 'border-gold/20'} border`}>
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback className={`${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-gold/10 text-gold'}`}>
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          <span className={getTextColor()}>{activity.user.name}</span>
                          {' '}
                          {activity.action === 'joined' && 'joined the platform'}
                          {activity.action === 'reported' && `reported ${activity.item}`}
                          {activity.action === 'posted' && `posted a new job: ${activity.item}`}
                          {activity.action === 'verification' && 'requested verification'}
                          {activity.action === 'created' && `created an event: ${activity.item}`}
                        </p>
                        <span className={`text-xs ${getMutedTextColor()}`}>{activity.time}</span>
                      </div>
                      <p className={`text-xs ${getMutedTextColor()} mt-1`}>{activity.user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={getCardStyle()}>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobPostsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jobPostsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'light' ? '#fff' : '#333', 
                        border: theme === 'light' ? '1px solid #ddd' : '1px solid #444',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`${getCardStyle()} mt-6`}>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items waiting for admin review</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitted by</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className={`${theme === 'light' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gold/10 text-gold border-gold/30'}`}>
                        {approval.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{approval.title}</TableCell>
                    <TableCell>{approval.company || approval.author || approval.user || approval.organizer}</TableCell>
                    <TableCell>{approval.submitted}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20">
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20">
                          <AlertCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
