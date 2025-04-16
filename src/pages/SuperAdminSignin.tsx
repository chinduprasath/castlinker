
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminTeamRole } from "@/types/adminTypes";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const SuperAdminSignin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (user?.email) {
          console.log("User already logged in, checking admin status...");
          const { data: adminData, error: adminError } = await supabase
            .from('users_management')
            .select('role')
            .eq('email', user.email)
            .single();
          
          if (!adminError && adminData) {
            // Convert the role to string for comparison
            const role = String(adminData.role);
            console.log("Found existing user role:", role);
            
            // List of admin roles
            const adminRoles = ['super_admin', 'moderator', 'content_manager', 'recruiter'];
            
            if (adminRoles.includes(role)) {
              console.log("Already logged in as admin, redirecting...");
              navigate('/admin/dashboard');
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error checking existing admin session:", err);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    console.log("Attempting sign in with:", data.email);
    
    try {
      // First attempt to sign in with Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }
      
      console.log("Basic authentication successful, checking admin status...");
      
      // Check if user is an admin team member
      const { data: adminUser, error: adminError } = await supabase
        .from('users_management')
        .select('role')
        .eq('email', data.email)
        .single();
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        throw new Error("Authentication failed. Please check your credentials.");
      }
      
      console.log("Admin check result:", adminUser);
      
      // List of admin roles we want to allow
      const adminRoles = ['super_admin', 'moderator', 'content_manager', 'recruiter'];
      
      // Convert the database role to a string to avoid type issues
      const userRole = String(adminUser.role);
      console.log("Found user role:", userRole);
      
      if (!adminUser || !adminRoles.includes(userRole)) {
        // Logout if not an admin
        console.error("Not an admin user, signing out");
        await supabase.auth.signOut();
        throw new Error("You don't have admin access privileges");
      }
      
      // Show success message
      const roleDisplay = userRole === 'super_admin' ? 'Super Admin' : 'Admin';
      toast.success(`Welcome back, ${roleDisplay}`);
      
      // Save remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
      }
      
      console.log("Admin authentication successful, navigating to dashboard");
      
      // Give a small delay to ensure toast is visible
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 100);
      
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Authentication failed");
      
      // If login succeeded but admin check failed, log out
      if (error.message === "You don't have admin access privileges") {
        // Logout and stay on the current page
        await supabase.auth.signOut();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cinematic">
      <div className="w-full max-w-md p-8 space-y-8 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-gold/20">
        <div className="flex items-center justify-center">
          <div className="bg-gold/10 p-3 rounded-full">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold ml-3 gold-gradient-text">Super Admin</h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-center">Sign in to Admin Portal</h2>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin@example.com" 
                      {...field} 
                      className="bg-background/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-background/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in to Admin Portal"}
            </Button>
            
            <div className="text-center text-sm mt-4">
              <Button 
                variant="link" 
                className="text-muted-foreground p-0 h-auto font-normal"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SuperAdminSignin;
