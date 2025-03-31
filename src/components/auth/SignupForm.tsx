import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, UserPlus, Github, AtSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { signup, isLoading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signup(email, password, name, role);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CastLinker!",
      });
      
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the auth context
      console.error("Signup error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card-gradient border-gold/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center text-foreground/70">
          Enter your information to get started
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              required
            />
          </div>
          
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
            <Label htmlFor="role">I am a</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actor">Actor</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Producer">Producer</SelectItem>
                <SelectItem value="Casting Director">Casting Director</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)} 
              className="border-gold/20 data-[state=checked]:bg-gold data-[state=checked]:text-cinematic"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-gold hover:text-gold-light">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gold hover:text-gold-light">
                Privacy Policy
              </Link>
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
                Creating account...
              </div>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create account
              </>
            )}
          </Button>
        </form>

        {/* Temporary signup notice for demo */}
        <div className="text-sm text-center p-2 bg-gold/10 rounded-md border border-gold/20">
          <p>For demo purposes, you can sign up with any valid details.</p>
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
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:text-gold-light">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
