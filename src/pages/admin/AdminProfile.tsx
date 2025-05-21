
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import ThemeToggle from "@/components/ThemeToggle";
import { Loader2, Upload, Check, UserCog, ShieldCheck, Key, Phone, Mail, Globe, Lock, Bell, Settings, LogOut } from "lucide-react";
import { AdminPermission } from "@/types/rbacTypes";
import { useTheme } from "@/contexts/ThemeContext";

// Update interface to match the structure of users_management table
interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  // Store additional fields that don't exist in the table in state variables
}

const AdminProfile = () => {
  const { user, logout } = useAuth(); // Changed from signOut to logout
  const { adminUser, adminRole } = useAdminAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Additional state variables for fields not in the users_management table
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Notification preferences
  const [notifyNewReports, setNotifyNewReports] = useState<boolean>(true);
  const [notifyJobApprovals, setNotifyJobApprovals] = useState<boolean>(true);
  const [notifyUserVerifications, setNotifyUserVerifications] = useState<boolean>(true);

  // Last login info
  const [lastLogin, setLastLogin] = useState<{date: string, ip: string, device: string}>({
    date: "2023-05-20 14:30:25",
    ip: "192.168.1.1",
    device: "Chrome / macOS"
  });

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.email) {
      fetchAdminProfile();
    }
  }, [user]);

  const fetchAdminProfile = async () => {
    setIsLoading(true);
    try {
      // Only select columns that exist in the users_management table
      const { data, error } = await supabase
        .from('users_management')
        .select('id, name, email, avatar_url')
        .eq('email', user?.email)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Set the profile with the data we got
      setProfile(data as AdminProfileData);
      
      // Set default values for additional fields
      setPhoneNumber("+1 (555) 123-4567");
      setLocation("Los Angeles, CA");
      setBio("Senior Administrator with 5+ years of experience in content management and team coordination.");
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast({
        title: "Error loading profile",
        description: "We couldn't load your profile information. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      // Only update fields that exist in the users_management table
      const { error } = await supabase
        .from('users_management')
        .update({
          name: profile.name
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }
      
      // Update local state for the additional fields
      setPhoneNumber(phoneNumber);
      setLocation(location);
      setBio(bio);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "We couldn't update your profile. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        throw error;
      }
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password update failed",
        description: "We couldn't update your password. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setIsUploading(true);
    
    try {
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users_management')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', profile?.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setProfile(prev => prev ? {...prev, avatar_url: urlData.publicUrl} : prev);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "We couldn't upload your profile picture. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled 
        ? "Two-factor authentication has been disabled for your account." 
        : "Two-factor authentication has been enabled for your account.",
      variant: "default"
    });
  };

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

  const handleLogout = async () => {
    try {
      await logout(); // Changed from signOut to logout
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderPermissions = () => {
    if (!adminUser?.permissions || adminUser.permissions.length === 0) {
      return (
        <p className="text-muted-foreground">
          No specific permissions found. You may have full access as an administrator.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {adminUser.permissions.map((permission: AdminPermission, index: number) => (
          <Card key={index} className="bg-background/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-md capitalize">{permission.module}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-1">
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_view ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>View</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_create ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Create</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_edit ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Edit</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_delete ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Delete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-background/20 border border-border/20 mb-6">
          <TabsTrigger value="profile" className="gap-1">
            <UserCog size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <ShieldCheck size={16} />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile?.name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : prev)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A short bio about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="ml-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Profile Picture - Moved from sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-40 w-40 mb-6 border-2 border-gold/20">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "Admin"} />
                <AvatarFallback className="text-5xl bg-gold/10 text-gold">
                  {profile?.name?.split(" ").map((n) => n[0]).join("") || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="w-full max-w-xs">
                <Label htmlFor="avatar-upload" className="w-full">
                  <div className="flex items-center justify-center w-full cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Change Picture
                        </>
                      )}
                    </Button>
                  </div>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Account Information - Moved from sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  <UserCog size={16} />
                  <span>Role</span>
                </h3>
                <p className="text-muted-foreground">{adminRole?.name || adminUser?.role || "Administrator"}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  <Mail size={16} />
                  <span>Email</span>
                </h3>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
              
              <Separator />
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/20 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Theme Preference - Moved from sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Preference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Theme Mode</Label>
                <ThemeToggle showTooltip={false} />
              </div>
            </CardContent>
          </Card>
          
          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>Your access level and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium">Current Role</h3>
                <div className="mt-2 p-3 rounded-lg bg-gold/5 border border-gold/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-gold" />
                    <span className="font-medium">{adminRole?.name || adminUser?.role || "Administrator"}</span>
                  </div>
                  {adminRole?.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{adminRole.description}</p>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Your Permissions</h3>
              {renderPermissions()}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="ml-auto"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? "Your account is protected with two-factor authentication." 
                        : "Protect your account with two-factor authentication."}
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent login activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Date/Time</p>
                      <p className="text-muted-foreground">{lastLogin.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">IP Address</p>
                      <p className="text-muted-foreground">{lastLogin.ip}</p>
                    </div>
                    <div>
                      <p className="font-medium">Device</p>
                      <p className="text-muted-foreground">{lastLogin.device}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;
