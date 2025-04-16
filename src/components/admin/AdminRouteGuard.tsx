
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminModule } from "@/types/rbacTypes";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredModule?: AdminModule;
  requiredAction?: 'view' | 'create' | 'edit' | 'delete';
  requiredPermission?: string; // For legacy compatibility
}

const AdminRouteGuard = ({ 
  children, 
  requiredModule = 'team',
  requiredAction = 'view',
  requiredPermission
}: AdminRouteGuardProps) => {
  const { isAdmin, adminUser, hasPermission, can, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecking, setAuthChecking] = useState(true);
  
  useEffect(() => {
    // Verify Supabase session first
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No active Supabase session found");
          navigate("/superadmin-signin");
          return;
        }
        
        console.log("Active Supabase session found");
        setAuthChecking(false);
      } catch (err) {
        console.error("Error verifying Supabase session:", err);
        setAuthChecking(false);
        navigate("/superadmin-signin");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Determine current module based on path
  const getCurrentModule = (): AdminModule => {
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/jobs')) return 'jobs';
    if (path.includes('/posts')) return 'posts';
    if (path.includes('/events')) return 'events';
    if (path.includes('/content')) return 'content';
    if (path.includes('/team')) return 'team';
    return 'team'; // Default to team for dashboard, etc.
  };
  
  // Use the detected module if none provided
  const moduleToCheck = requiredModule || getCurrentModule();
  
  console.log('AdminRouteGuard check:', { 
    isAdmin, 
    adminUserRole: adminUser?.role,
    requiredModule: moduleToCheck,
    requiredAction,
    requiredPermission,
    loading,
    authChecking,
    hasModulePermission: !loading && !authChecking ? hasPermission(moduleToCheck, requiredAction) : 'checking',
    legacyPermission: requiredPermission ? (!loading && !authChecking ? can(requiredPermission) : 'checking') : 'not required'
  });
  
  // Show loading state while checking admin status
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-amber-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying Access...</h1>
        <p className="text-muted-foreground">Please wait while we verify your admin credentials.</p>
      </div>
    );
  }
  
  // Check if user is an admin
  if (!isAdmin || !adminUser) {
    console.log("Access denied: User is not an admin");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
        <div className="space-x-2">
          <Button onClick={() => navigate("/")}>Return to Home</Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/superadmin-signin")} 
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  // For backward compatibility, check legacy permissions first
  if (requiredPermission && !can(requiredPermission)) {
    console.log(`Legacy Permission denied: User lacks "${requiredPermission}" permission`);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
        <p className="text-muted-foreground mb-4">
          You don't have the required permissions for this section.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")}>Return to Admin Dashboard</Button>
      </div>
    );
  }
  
  // Check module-specific permission
  if (!hasPermission(moduleToCheck, requiredAction)) {
    console.log(`Permission denied: User lacks "${requiredAction}" permission on "${moduleToCheck}" module`);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
        <p className="text-muted-foreground mb-4">
          You don't have the required permissions for this section.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")}>Return to Admin Dashboard</Button>
      </div>
    );
  }
  
  console.log("Admin access granted");
  // User has access, render the children
  return <>{children}</>;
};

export default AdminRouteGuard;
