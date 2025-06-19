
interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  // Mock user data since authentication is removed
  const user = { id: "mock-user", name: "Mock User" };
  
  if (!user) return null;
  
  return (
    <div className={`py-4 px-4 border-b border-gold/10 flex ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
      {/* Avatar has been removed as requested */}
    </div>
  );
};

export default SidebarProfile;
