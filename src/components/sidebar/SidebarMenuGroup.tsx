
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu
} from "@/components/ui/sidebar";

interface SidebarMenuGroupProps {
  label: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarMenuGroup = ({ label, isCollapsed, children }: SidebarMenuGroupProps) => {
  return (
    <SidebarGroup>
      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="flex items-center">
            <span className="h-px flex-1 bg-gold/10"></span>
            <h3 className="text-xs font-semibold text-gold/70 tracking-wider uppercase mx-3">
              {label}
            </h3>
            <span className="h-px flex-1 bg-gold/10"></span>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="my-2 px-2">
          <div className="h-px bg-gold/10"></div>
        </div>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5 mt-1 mb-4">
          {children}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMenuGroup;
