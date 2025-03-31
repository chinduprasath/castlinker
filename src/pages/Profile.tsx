import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";

const Profile = () => {
  return (
    <div className="space-y-4 pr-1">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
};

export default Profile;
