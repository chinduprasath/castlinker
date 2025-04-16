import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://qnpdieomxraerzgocofk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGRpZW9teHJhZXJ6Z29jb2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDI0NzEsImV4cCI6MjA1ODk3ODQ3MX0.BcLb9NnIeaV6FOymxkP4pGU91uo35MiXe2cGj2P6Ea4";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const SuperAdminSignin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          console.log("User already has a session, checking admin status...");
          
          const { data: adminData, error: adminError } = await supabase
            .from('users_management')
            .select('role')
            .eq('email', sessionData.session.user.email)
            .single();
          
          if (!adminError && adminData) {
            console.log("Found existing admin user:", adminData);
            toast.success("Already logged in as admin");
            navigate('/admin/dashboard');
          }
        }
      } catch (err) {
        console.error("Error checking existing session:", err);
      }
    };
    
    checkSession();
  }, [navigate]);

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
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (signInError) {
        console.error("Sign in error:", signInError);
        throw new Error(signInError.message);
      }
      
      if (!authData.session || !authData.user) {
        throw new Error("No session created");
      }
      
      console.log("Basic authentication successful, checking admin status...");
      
      // Step 2: Check if user is in the users_management table using admin client
      const { data: adminUser, error: adminError } = await supabaseAdmin
        .from('users_management')
        .select('role, name')
        .eq('email', data.email.toLowerCase())
        .single();
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        await supabase.auth.signOut();
        throw new Error(`Error verifying admin privileges: ${adminError.message}`);
      }
      
      if (!adminUser) {
        console.error("User not found in users_management table for email:", data.email);
        await supabase.auth.signOut();
        throw new Error("You don't have admin access privileges. Please contact system administrator.");
      }
      
      console.log("Admin check result:", adminUser);
      
      // Get the role value and convert to string to avoid type issues
      const userRole = String(adminUser.role).toLowerCase().trim();
      console.log("User role (as string):", userRole);
      
      // Check if the role is super_admin
      if (userRole !== 'super_admin') {
        console.error("Not a SuperAdmin role:", userRole);
        await supabase.auth.signOut();
        throw new Error("You don't have SuperAdmin access privileges.");
      }
      
      // Save remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
      }
      
      // Show success message
      const displayName = adminUser.name || "SuperAdmin";
      toast.success(`Welcome back, ${displayName}`);
      console.log("SuperAdmin authentication successful, navigating to dashboard");
      
      // Navigate to admin dashboard
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Authentication failed. Please check your credentials.");
      
      // Ensure user is logged out if there was an error
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the render method remains the same
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
