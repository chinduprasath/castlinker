import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Mail, ShieldCheck } from "lucide-react";
import { AdminProfileData } from "@/types/adminTypes";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";
import { AdminPermission } from "@/types/rbacTypes";
import PermissionsDisplay from "@/components/admin/profile/PermissionsDisplay";

interface ProfileTabProps {
  profile: AdminProfileData | null;
  setProfile: React.Dispatch<React.SetStateAction<AdminProfileData | null>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  adminRole?: any;
  adminUser?: any;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileTab = ({
  profile,
  setProfile,
  phoneNumber,
  setPhoneNumber,
  location,
  setLocation,
  bio,
  setBio,
  adminRole,
  adminUser,
  isUploading,
  setIsUploading
}: ProfileTabProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
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

  return (
    <div className="space-y-6">
      {/* Profile Picture and Account Info - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture Card */}
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
        
        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Username</Label>
              <p className="font-medium">{profile?.name}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium flex items-center gap-1">
                <Mail size={16} className="text-muted-foreground" />
                {profile?.email}
              </p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <p className="font-medium flex items-center gap-1">
                <ShieldCheck size={16} className="text-gold" />
                {adminRole?.name || adminUser?.role || "Administrator"}
              </p>
            </div>
            
            <div className="pt-4">
              <Label className="text-sm">Theme Preference</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Theme Mode</span>
                <ThemeToggle showTooltip={false} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information Form */}
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

      <PermissionsDisplay adminRole={adminRole} adminUser={adminUser} />
    </div>
  );
};

export default ProfileTab;
