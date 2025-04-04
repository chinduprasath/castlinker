
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle2, 
  MessageCircle, 
  Briefcase, 
  FileText, 
  AlertCircle, 
  ArrowDown, 
  Loader2,
  CheckCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define notification type
interface Notification {
  id: string;
  type: "message" | "job" | "system" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  created_at: string;
  user_id: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Get notifications from database
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Format data for UI
        const formattedData = data.map(notification => ({
          ...notification,
          type: notification.type || 'system',
          time: formatTime(notification.created_at)
        })) as Notification[];
        
        setNotifications(formattedData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Failed to load notifications",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time listener for new notifications
    const notificationsSubscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        const newNotification = {
          ...payload.new as any,
          type: (payload.new as any).type || 'system',
          time: formatTime((payload.new as any).created_at)
        } as Notification;
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: "New notification",
          description: newNotification.title,
        });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [user, toast]);

  // Format timestamp to relative time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;
    
    return date.toLocaleDateString();
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Failed to update notification",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    setMarkingAll(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Failed to update notifications",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setMarkingAll(false);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case "job":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "system":
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  // Get badge for notification type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "message":
        return (
          <Badge className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full mr-2">
            Message
          </Badge>
        );
      case "job":
        return (
          <Badge className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full mr-2">
            Job
          </Badge>
        );
      case "alert":
        return (
          <Badge className="inline-block bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full mr-2">
            Alert
          </Badge>
        );
      case "system":
      default:
        return (
          <Badge className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full mr-2">
            System
          </Badge>
        );
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount === 0 
              ? "You're all caught up!" 
              : `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={markAllAsRead}
          disabled={markingAll || unreadCount === 0}
          className="gap-2"
        >
          {markingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="h-4 w-4" />
          )}
          Mark all as read
        </Button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : notifications.length === 0 ? (
          // Empty state
          <Card className="py-10">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-30" />
              <CardTitle className="text-xl mb-2">No notifications</CardTitle>
              <CardDescription>
                You don't have any notifications yet. We'll notify you about important updates.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          // Notifications list
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={notification.read ? "opacity-70 border-border/50" : "border-gold/20 shadow-md"}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-1.5 rounded-full mr-3 ${notification.read ? 'bg-background/30' : 'bg-gold/10'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <CardTitle className="text-lg">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-gold inline-block"></span>
                      )}
                    </CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">{notification.time}</span>
                </div>
                <CardDescription className="pl-10">
                  {getTypeBadge(notification.type)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-10">
                <p className="text-foreground/80">{notification.message}</p>
                <div className="flex justify-end mt-2 gap-2">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-foreground/70"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mark as read
                    </Button>
                  )}
                  <Button variant="link" size="sm" className="text-primary">
                    View details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {!loading && notifications.length > 5 && (
          <div className="text-center pt-4">
            <Button variant="outline" className="gap-2">
              <ArrowDown className="h-4 w-4" />
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
