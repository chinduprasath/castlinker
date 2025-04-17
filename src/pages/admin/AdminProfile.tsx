
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin, Shield } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminProfile = () => {
  const { user } = useAuth();
  const { adminUser } = useAdminAuth();
  
  if (!user) return null;
  
  // Create initials from user name
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your admin profile settings</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-gold/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gold/10 text-gold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>{adminUser?.role || 'Admin'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{user.location || 'Not set'}</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        {/* Role & Permissions */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Role & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium">Current Role</h4>
                <div className="flex items-center mt-2 space-x-2">
                  <Shield className="h-5 w-5 text-gold" />
                  <span className="text-lg font-medium">{adminUser?.role || 'Admin'}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Access Controls</h4>
                <div className="grid gap-2">
                  {(adminUser?.permissions || []).map((permission: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-background p-2 rounded-md border">
                      <span>{permission}</span>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                  {(!adminUser?.permissions || adminUser.permissions.length === 0) && (
                    <div className="text-muted-foreground text-sm">
                      Permissions are managed by your role.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
