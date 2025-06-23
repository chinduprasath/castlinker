
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AdminModule } from "@/types/rbacTypes";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecking, setAuthChecking] = useState(true);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user is hardcoded admin first
        if (user?.email === 'admin@gmail.com' && user?.role === 'super_admin') {
          console.log("Hardcoded admin user detected, granting access");
          setAuthChecking(false);
          return;
        }
        
        // For Firebase, we don't need to check sessions separately
        // The auth state is handled by the auth context
        console.log("Firebase auth state handled by context");
        setAuthChecking(false);
      } catch (err) {
        console.error("Error verifying auth state:", err);
        setAuthChecking(false);
        navigate("/admin/login");
      }
    };
    
    checkSession();
  }, [navigate, user]);
  
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
  
  const moduleToCheck = requiredModule || getCurrentModule();
  
  // For hardcoded admin, grant all permissions
  const isHardcodedAdmin = user?.email === 'admin@gmail.com' && user?.role === 'super_admin';
  
  console.log('AdminRouteGuard check:', { 
    isAdmin: isAdmin || isHardcodedAdmin, 
    adminUserRole: adminUser?.role || user?.role,
    requiredModule: moduleToCheck,
    requiredAction,
    requiredPermission,
    loading,
    authChecking,
    isHardcodedAdmin,
    userEmail: user?.email,
    hasModulePermission: !loading && !authChecking ? (isHardcodedAdmin || hasPermission(moduleToCheck, requiredAction)) : 'checking',
    legacyPermission: requiredPermission ? (!loading && !authChecking ? (isHardcodedAdmin || can(requiredPermission)) : 'checking') : 'not required'
  });
  
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-amber-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying Access...</h1>
        <p className="text-muted-foreground">Please wait while we verify your admin credentials.</p>
      </div>
    );
  }
  
  if (!isAdmin && !isHardcodedAdmin) {
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
            onClick={() => navigate("/admin/login")} 
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  if (requiredPermission && !isHardcodedAdmin && !can(requiredPermission)) {
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
  
  if (!isHardcodedAdmin && !hasPermission(moduleToCheck, requiredAction)) {
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
  return <>{children}</>;
};

export default AdminRouteGuard;
