import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, Film, Calendar, MessageCircle, Building2, Award, Mail, X, Users, Briefcase, MessageSquare, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from 'date-fns';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Define notification object type
interface Notification {
  id: string;
  type: 'team_invite' | 'job_application' | 'message' | 'system';
  status: 'pending' | 'accepted' | 'rejected' | 'read';
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  inviterId?: string;
  inviterName?: string;
  createdAt: any;
  userId: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch notifications with fallback mock data for testing
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      // If no notifications found, add some mock data for demo
      if (notifs.length === 0) {
        const mockNotifications: Notification[] = [
          {
            id: 'mock-1',
            type: 'team_invite',
            status: 'pending',
            title: 'Team Invitation',
            message: 'You have been invited to join a project team.',
            projectId: 'project-1',
            projectName: 'Demo Project',
            inviterId: 'user-1',
            inviterName: 'Demo Director',
            createdAt: new Date(),
            userId: user.id
          },
          {
            id: 'mock-2',
            type: 'job_application',
            status: 'read',
            title: 'Job Application Update',
            message: 'Your application for Lead Actor has been reviewed.',
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            userId: user.id
          },
          {
            id: 'mock-3',
            type: 'message',
            status: 'pending',
            title: 'New Message',
            message: 'You have received a new message from a casting director.',
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            userId: user.id
          }
        ];
        setNotifications(mockNotifications);
      } else {
        setNotifications(notifs);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data on error
      const mockNotifications: Notification[] = [
        {
          id: 'mock-1',
          type: 'team_invite',
          status: 'pending',
          title: 'Team Invitation',
          message: 'You have been invited to join a project team.',
          projectId: 'project-1',
          projectName: 'Demo Project',
          inviterId: 'user-1',
          inviterName: 'Demo Director',
          createdAt: new Date(),
          userId: user.id
        }
      ];
      setNotifications(mockNotifications);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notification.status === 'pending';
    return notification.type === activeTab;
  });
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'job_application':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Format timestamps to relative time (e.g., "5 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    return format(date, 'MMM d, yyyy');
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        status: 'read',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' }))
    );
    
    toast.success('All notifications marked as read');
  };
  
  const handleAcceptTeamInvite = async (notification: Notification) => {
    if (!notification.projectId) return;

    try {
      // Update team member status to accepted
      const teamMembersRef = collection(db, 'projects', notification.projectId, 'team_members');
      const teamQuery = query(teamMembersRef, where('email', '==', user?.email));
      const teamSnapshot = await getDocs(teamQuery);
      console.log('Accept invite: user email', user?.email, 'teamSnapshot size', teamSnapshot.size);
      if (!teamSnapshot.empty) {
        const teamMemberDoc = teamSnapshot.docs[0];
        await updateDoc(teamMemberDoc.ref, {
          status: 'accepted',
          updated_at: new Date()
        });
        // Update notification status
        await updateDoc(doc(db, 'notifications', notification.id), {
          status: 'accepted',
          updatedAt: new Date()
        });
        toast.success('Team invite accepted! You can now access the project.');
      } else {
        toast.error('No matching team member found for your email.');
        console.error('No team member found for email', user?.email, 'in project', notification.projectId);
      }
    } catch (error) {
      console.error('Error accepting team invite:', error);
      toast.error('Failed to accept team invite');
    }
  };

  const handleRejectTeamInvite = async (notification: Notification) => {
    if (!notification.projectId) return;

    try {
      // Remove team member from project
      const teamMembersRef = collection(db, 'projects', notification.projectId, 'team_members');
      const teamQuery = query(teamMembersRef, where('email', '==', user?.email));
      const teamSnapshot = await getDocs(teamQuery);
      
      if (!teamSnapshot.empty) {
        const teamMemberDoc = teamSnapshot.docs[0];
        await deleteDoc(teamMemberDoc.ref);
      }

      // Update notification status
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'rejected',
        updatedAt: new Date()
      });

      toast.success('Team invite rejected');
    } catch (error) {
      console.error('Error rejecting team invite:', error);
      toast.error('Failed to reject team invite');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'read':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Read</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const acceptedNotifications = notifications.filter(n => n.status === 'accepted');
  const rejectedNotifications = notifications.filter(n => n.status === 'rejected');
  const readNotifications = notifications.filter(n => n.status === 'read');

  if (isLoading) {
  return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your latest activities and invites</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingNotifications.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedNotifications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold" />
                All Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
          <div className="space-y-4">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onAccept={handleAcceptTeamInvite}
                      onReject={handleRejectTeamInvite}
                      onRead={markAsRead}
                      getIcon={getNotificationIcon}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                    />
                  ))}
                        </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending notifications</p>
                      </div>
              ) : (
                <div className="space-y-4">
                  {pendingNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onAccept={handleAcceptTeamInvite}
                      onReject={handleRejectTeamInvite}
                      onRead={markAsRead}
                      getIcon={getNotificationIcon}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                    />
                  ))}
                    </div>
              )}
                  </CardContent>
                </Card>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Accepted Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {acceptedNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No accepted notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedNotifications.map((notification) => (
                    <NotificationCard
                  key={notification.id} 
                      notification={notification}
                      onAccept={handleAcceptTeamInvite}
                      onReject={handleRejectTeamInvite}
                      onRead={markAsRead}
                      getIcon={getNotificationIcon}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                    />
                  ))}
                      </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Rejected Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No rejected notifications</p>
                        </div>
              ) : (
                <div className="space-y-4">
                  {rejectedNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onAccept={handleAcceptTeamInvite}
                      onReject={handleRejectTeamInvite}
                      onRead={markAsRead}
                      getIcon={getNotificationIcon}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                    />
                  ))}
                      </div>
              )}
                  </CardContent>
                </Card>
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-500" />
                Read Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No read notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {readNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onAccept={handleAcceptTeamInvite}
                      onReject={handleRejectTeamInvite}
                      onRead={markAsRead}
                      getIcon={getNotificationIcon}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                    />
                  ))}
              </div>
            )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onAccept: (notification: Notification) => void;
  onReject: (notification: Notification) => void;
  onRead: (notificationId: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (timestamp: any) => string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onAccept,
  onReject,
  onRead,
  getIcon,
  getStatusBadge,
  formatDate
}) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">
              {notification.type === 'team_invite' && notification.projectName
                ? notification.projectName
                : notification.title}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusBadge(notification.status)}
              <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
            </div>
          </div>
          {notification.type === 'team_invite' && notification.inviterName && (
            <div className="text-sm text-gray-500 mb-1">Invited by <span className="font-medium text-gold">{notification.inviterName}</span></div>
          )}
          <p className="text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
          
          {notification.type === 'team_invite' && notification.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onAccept(notification)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(notification)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
          
          {notification.status === 'pending' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRead(notification.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
