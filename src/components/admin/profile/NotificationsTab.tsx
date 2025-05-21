
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const NotificationsTab = () => {
  const { toast } = useToast();
  const [notifyNewReports, setNotifyNewReports] = useState<boolean>(true);
  const [notifyJobApprovals, setNotifyJobApprovals] = useState<boolean>(true);
  const [notifyUserVerifications, setNotifyUserVerifications] = useState<boolean>(true);

  const handleToggleNotification = (type: string, value: boolean) => {
    if (type === 'reports') {
      setNotifyNewReports(value);
    } else if (type === 'jobs') {
      setNotifyJobApprovals(value);
    } else if (type === 'users') {
      setNotifyUserVerifications(value);
    }

    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
      variant: "default"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage your notification settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">New Reports</Label>
            <p className="text-sm text-muted-foreground">
              Notifications when new reports are submitted
            </p>
          </div>
          <Switch 
            checked={notifyNewReports}
            onCheckedChange={(value) => handleToggleNotification('reports', value)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Job Approvals</Label>
            <p className="text-sm text-muted-foreground">
              Notifications when jobs need approval
            </p>
          </div>
          <Switch 
            checked={notifyJobApprovals}
            onCheckedChange={(value) => handleToggleNotification('jobs', value)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">User Verifications</Label>
            <p className="text-sm text-muted-foreground">
              Notifications when users need verification
            </p>
          </div>
          <Switch 
            checked={notifyUserVerifications}
            onCheckedChange={(value) => handleToggleNotification('users', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
