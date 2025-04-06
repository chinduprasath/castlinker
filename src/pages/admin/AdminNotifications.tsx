
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  BellOff,
  Check,
  ChevronRight,
  RefreshCw,
  Filter,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Notification {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [toast]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(notifications.map(n => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleMarkRead = () => {
    if (selectedIds.length === 0) return;
    
    // In a real implementation, this would update the notifications in Supabase
    setNotifications(
      notifications.map(item => 
        selectedIds.includes(item.id) 
          ? { ...item, read: true } 
          : item
      )
    );
    
    toast({
      title: "Notifications updated",
      description: `${selectedIds.length} notifications marked as read`
    });
    
    setSelectedIds([]);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    
    // In a real implementation, this would delete the notifications from Supabase
    setNotifications(
      notifications.filter(item => !selectedIds.includes(item.id))
    );
    
    toast({
      title: "Notifications deleted",
      description: `${selectedIds.length} notifications deleted`
    });
    
    setSelectedIds([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes('alert') || message.toLowerCase().includes('error')) {
      return <AlertCircle className="h-5 w-5 text-red-500 mr-3" />;
    }
    
    if (message.toLowerCase().includes('completed') || message.toLowerCase().includes('success')) {
      return <CheckCircle className="h-5 w-5 text-green-500 mr-3" />;
    }
    
    return <Info className="h-5 w-5 text-blue-500 mr-3" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">Notifications</h1>
            <p className="text-muted-foreground">System alerts and notifications</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
        
        <Card className="border-gold/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>
                  {!isLoading && 
                    `${notifications.length} ${notifications.length === 1 ? 'notification' : 'notifications'}`
                  }
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="notification-settings" className="cursor-pointer">Notification Settings</Label>
                <Bell className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 justify-between p-3 border border-dashed rounded-lg bg-muted/40">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectedIds.length === notifications.length && notifications.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer select-none">
                  Select All
                </label>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1"
                  onClick={handleMarkRead}
                  disabled={selectedIds.length === 0}
                >
                  <Check className="h-4 w-4" />
                  <span>Mark Read</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 border-red-300 text-red-500 hover:bg-red-100 hover:text-red-600"
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start p-3 border rounded-lg">
                    <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/40 ${
                        selectedIds.includes(notification.id) ? 'border-gold/30 bg-gold/5' : ''
                      } ${notification.read ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start">
                        <Checkbox 
                          className="mt-1 mr-3"
                          checked={selectedIds.includes(notification.id)}
                          onCheckedChange={(checked) => handleSelect(notification.id, !!checked)}
                        />
                        {getNotificationIcon(notification.message)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {!notification.read && (
                          <Badge className="h-2 w-2 rounded-full bg-blue-500 p-0 mr-2" />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <BellOff className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      You're all caught up! There are no new notifications.
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {!isLoading && `Showing ${notifications.length} notifications`}
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked={true} />
            </div>
          </CardFooter>
        </Card>

        <Card className="border-gold/10 shadow-sm">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Customize which notifications you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="system-alerts">System Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive notifications about system performance and issues
                  </p>
                </div>
                <Switch id="system-alerts" defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="content-reports">Content Reports</Label>
                  <p className="text-muted-foreground text-sm">
                    Notifications when content is flagged or reported
                  </p>
                </div>
                <Switch id="content-reports" defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="user-signups">New User Signups</Label>
                  <p className="text-muted-foreground text-sm">
                    Get notified when new users register
                  </p>
                </div>
                <Switch id="user-signups" defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="job-alerts">Job Listings</Label>
                  <p className="text-muted-foreground text-sm">
                    Notifications about new job listings and applications
                  </p>
                </div>
                <Switch id="job-alerts" defaultChecked={true} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
