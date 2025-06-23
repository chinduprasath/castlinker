
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import ProfileTab from "@/components/admin/profile/ProfileTab";
import SecurityTab from "@/components/admin/profile/SecurityTab";
import PreferencesTab from "@/components/admin/profile/PreferencesTab";

interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  phone?: string;
  location?: string;
  bio?: string;
  role?: string;
}

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [adminRole, setAdminRole] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users_management", user.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const profileData: AdminProfileData = {
            id: userData.id || user.id,
            name: userData.name || user.email || "Admin",
            email: userData.email || user.email || "",
            avatar_url: userData.avatar_url || "",
            phone: userData.phone || "",
            location: userData.location || "",
            bio: userData.bio || "",
            role: userData.role || "administrator"
          };
          setProfile(profileData);
          setPhoneNumber(profileData.phone || "");
          setLocation(profileData.location || "");
          setBio(profileData.bio || "");

          // Fetch admin role and user data
          const adminRoleDoc = await getDoc(doc(db, "adminRoles", profileData.role || "administrator"));
          if (adminRoleDoc.exists()) {
            setAdminRole(adminRoleDoc.data());
          } else {
            setAdminUser({ role: profileData.role || "administrator" });
          }
        } else {
          console.log("No such document!");
          setProfile({
            id: user.id,
            name: user.email || "Admin",
            email: user.email || "",
            avatar_url: "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Fetching admin profile data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please wait while we load your profile information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container py-10">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Manage your profile information and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
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
            <TabsContent value="security">
              <SecurityTab
                lastLogin={{
                  date: "May 15, 2024 10:00 AM",
                  ip: "192.168.1.1",
                  device: "Chrome on Windows",
                }}
              />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
