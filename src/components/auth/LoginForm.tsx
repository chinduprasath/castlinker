import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, LogIn, Github, AtSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password, rememberMe);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to CastLinker!",
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the auth context
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card-gradient border-gold/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in to CastLinker</CardTitle>
        <CardDescription className="text-center text-foreground/70">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-red-600/20 bg-red-500/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-gold hover:text-gold-light">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
              className="border-gold/20 data-[state=checked]:bg-gold data-[state=checked]:text-cinematic"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold-dark text-cinematic"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cinematic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </>
            )}
          </Button>
        </form>

        {/* Temporary login notice for demo */}
        <div className="text-sm text-center p-2 bg-gold/10 rounded-md border border-gold/20">
          <p>For demo purposes, you can use any email and password.</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gold/10" />
          </div>
          <span className="relative bg-card px-2 text-xs text-foreground/60">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="border-gold/10 hover:border-gold/30" type="button">
            <AtSign className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="border-gold/10 hover:border-gold/30" type="button">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-foreground/70">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gold hover:text-gold-light">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
