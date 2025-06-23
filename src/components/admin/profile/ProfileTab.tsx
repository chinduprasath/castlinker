import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Mail, ShieldCheck } from "lucide-react";
import { AdminProfileData } from "@/types/adminTypes";
import { db, storage } from "@/integrations/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<AdminProfileData | null>(profile);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState<string>(phoneNumber);
  const [editedLocation, setEditedLocation] = useState<string>(location);
  const [editedEmail, setEditedEmail] = useState<string>(profile?.email || '');

  useEffect(() => {
    setEditedProfile(profile);
    setEditedEmail(profile?.email || '');
  }, [profile]);

  useEffect(() => {
    setEditedPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    setEditedLocation(location);
  }, [location]);

  const { toast } = useToast();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      // Only update fields that exist in the users_management table
      const profileDocRef = doc(db, 'users_management', profile.id);
      await updateDoc(profileDocRef, {
        name: profile.name
      });
      
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
      // Upload image to Firebase Storage
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      
      // Get public URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with new avatar URL
      const profileDocRef = doc(db, 'users_management', profile?.id);
      await updateDoc(profileDocRef, { avatar_url: downloadURL });
      
      // Update local state
      setProfile(prev => prev ? {...prev, avatar_url: downloadURL} : prev);
      
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

  const handleAccountInfoUpdate = async () => {
    if (!editedProfile) return;

    setIsSaving(true);
    try {
      const updates: any = { name: editedProfile.name };

      // Update email using auth.updateUser
      // let emailUpdateError = null;
      // if (editedEmail !== profile?.email) {
      //    const { error } = await supabase.auth.updateUser({ email: editedEmail });
      //    emailUpdateError = error;
      // }

      // if (emailUpdateError) {
      //     throw emailUpdateError;
      // }

      // Update name in users_management table (if different from auth user table)
      const profileDocRef = doc(db, 'users_management', editedProfile.id);
      await updateDoc(profileDocRef, updates);

      // Update phone and location in the appropriate place
      // Assuming phone and location are stored elsewhere or updated differently
      // For now, we'll just update the local state and the state passed from parent
      setPhoneNumber(editedPhoneNumber);
      setLocation(editedLocation);

      // Update the parent profile state with potentially new name and email
      setProfile(prev => prev ? {...prev, name: editedProfile.name, email: editedEmail} : editedProfile);

      toast({
        title: "Account Information updated",
        description: "Your account information has been successfully updated.",
        variant: "default"
      });
      setIsEditingAccountInfo(false);
    } catch (error) {
      console.error("Error updating account information:", error);
      toast({
        title: "Update failed",
        description: "We couldn't update your account information. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => {
    setIsEditingAccountInfo(true);
    setEditedProfile(profile);
    setEditedPhoneNumber(phoneNumber);
    setEditedLocation(location);
    setEditedEmail(profile?.email || '');
  };

  const handleCancelClick = () => {
    setIsEditingAccountInfo(false);
    setEditedProfile(profile);
    setEditedPhoneNumber(phoneNumber);
    setEditedLocation(location);
    setEditedEmail(profile?.email || '');
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
            {!isEditingAccountInfo && (
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Username</Label>
              {isEditingAccountInfo ? (
                <Input
                  value={editedProfile?.name || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? {...prev, name: e.target.value} : prev)}
                />
              ) : (
                <p className="font-medium">{profile?.name}</p>
              )}
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              {isEditingAccountInfo ? (
                 <Input
                   value={editedEmail}
                   onChange={(e) => setEditedEmail(e.target.value)}
                 />
              ) : (
                <p className="font-medium flex items-center gap-1">
                  <Mail size={16} className="text-muted-foreground" />
                  {profile?.email}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Phone Number</Label>
              {isEditingAccountInfo ? (
                <Input
                  value={editedPhoneNumber}
                  onChange={(e) => setEditedPhoneNumber(e.target.value)}
                  placeholder="Your phone number"
                />
              ) : (
                <p className="font-medium">{phoneNumber}</p>
              )}
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Location</Label>
              {isEditingAccountInfo ? (
                <Input
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  placeholder="City, Country"
                />
              ) : (
                <p className="font-medium">{location}</p>
              )}
            </div>

            {!isEditingAccountInfo && (
              <div>
                <Label className="text-sm text-muted-foreground">Role</Label>
                <p className="font-medium flex items-center gap-1">
                  <ShieldCheck size={16} className="text-gold" />
                  {adminRole?.name || adminUser?.role || "Administrator"}
                </p>
              </div>
            )}

            {isEditingAccountInfo && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCancelClick} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleAccountInfoUpdate} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PermissionsDisplay adminRole={adminRole} adminUser={adminUser} />
    </div>
  );
};

export default ProfileTab;
