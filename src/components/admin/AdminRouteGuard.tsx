
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const AdminRouteGuard = ({ children, requiredPermission }: AdminRouteGuardProps) => {
  const { isAdmin, adminUser, can, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  
  useEffect(() => {
    // Verify Supabase session first
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No active Supabase session found");
          // No session, redirect to login
          navigate("/superadmin-signin");
          return;
        }
        
        console.log("Active Supabase session found");
        setAuthChecking(false);
      } catch (err) {
        console.error("Error verifying Supabase session:", err);
        setAuthChecking(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  console.log('AdminRouteGuard check:', { 
    isAdmin, 
    adminUserRole: adminUser?.role,
    requiredPermission,
    loading,
    authChecking,
    hasPermission: requiredPermission ? can(requiredPermission) : 'not required'
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
  if (!isAdmin) {
    console.log("Access denied: User is not an admin");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
        <div className="space-y-2">
          <Button onClick={() => navigate("/")}>Return to Home</Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/superadmin-signin")} 
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
    console.log(`Permission denied: User lacks "${requiredPermission}" permission`);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
        <p className="text-muted-foreground mb-4">
          {adminUser?.role === 'super_admin' 
            ? "This feature is currently under maintenance."
            : "You don't have the required permissions for this section."}
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
