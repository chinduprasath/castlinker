
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserCog, ShieldCheck, Bell, LogOut } from "lucide-react";
import { AdminProfileData } from "@/types/adminTypes";
import ProfileTab from "@/components/admin/profile/ProfileTab";
import SecurityTab from "@/components/admin/profile/SecurityTab";
import NotificationsTab from "@/components/admin/profile/NotificationsTab";
import PermissionsDisplay from "@/components/admin/profile/PermissionsDisplay";

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const { adminUser, adminRole } = useAdminAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Additional state variables for fields not in the users_management table
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  // Last login info
  const [lastLogin, setLastLogin] = useState<{date: string, ip: string, device: string}>({
    date: "2023-05-20 14:30:25",
    ip: "192.168.1.1",
    device: "Chrome / macOS"
  });

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

  const handleLogout = async () => {
    try {
      await logout();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
        >
          <LogOut size={20} />
        </Button>
      </div>
      
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
        <TabsContent value="profile">
          <ProfileTab 
            profile={profile}
            setProfile={setProfile}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            location={location}
            setLocation={setLocation}
            bio={bio}
            setBio={setBio}
            adminRole={adminRole}
            adminUser={adminUser}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab lastLogin={lastLogin} />
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;
