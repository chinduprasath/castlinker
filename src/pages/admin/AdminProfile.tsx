
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
import { Loader2, Upload, Check, UserCog, ShieldCheck, Key } from "lucide-react";
import { AdminPermission } from "@/types/rbacTypes";

interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  // Using optional fields for ones that might not exist in the table
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
}

const AdminProfile = () => {
  const { user } = useAuth();
  const { adminUser, adminRole } = useAdminAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
    <div className="container max-w-5xl py-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar Section */}
        <Card className="w-full md:w-auto md:min-w-[300px]">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4 border-2 border-gold/20">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "Admin"} />
              <AvatarFallback className="text-3xl bg-gold/10 text-gold">
                {profile?.name?.split(" ").map((n) => n[0]).join("") || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
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
                        Upload New Image
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

        {/* Main Content */}
        <div className="flex-1 w-full">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="gap-1">
                <UserCog size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1">
                <Key size={16} />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-1">
                <ShieldCheck size={16} />
                <span>Permissions</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                      </div>
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
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
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
            </TabsContent>
            
            {/* Permissions Tab */}
            <TabsContent value="permissions">
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
