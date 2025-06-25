import { useAuth } from '@/contexts/AuthContext';
interface SidebarProfileProps {
  isCollapsed: boolean;
}
const SidebarProfile = ({
  isCollapsed
}: SidebarProfileProps) => {
  const {
    user
  } = useAuth();
  if (!user) return null;
  return;
};
export default SidebarProfile;