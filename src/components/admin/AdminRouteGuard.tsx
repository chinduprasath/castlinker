
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const AdminRouteGuard = ({ children, requiredPermission }: AdminRouteGuardProps) => {
  const { isAdmin, adminUser, can, loading } = useAdminAuth();
  
  console.log('AdminRouteGuard check:', { isAdmin, adminUser, requiredPermission, loading });
  
  // Show loading state while checking admin status
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-amber-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying Access...</h1>
        <p className="text-muted-foreground">Please wait while we verify your admin credentials.</p>
      </div>
    );
  }
  
  // Check if user is an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
        <div className="space-y-2">
          <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/superadmin-signin"} 
            className="ml-2"
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  // If a specific permission is required, check for it
  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
        <p className="text-muted-foreground mb-4">
          {adminUser?.role === 'super_admin' 
            ? "This feature is currently under maintenance."
            : "You don't have the required permissions for this section."}
        </p>
        <Button onClick={() => window.location.href = "/admin/dashboard"}>Return to Admin Dashboard</Button>
      </div>
    );
  }
  
  // User has access, render the children
  return <>{children}</>;
};

export default AdminRouteGuard;
