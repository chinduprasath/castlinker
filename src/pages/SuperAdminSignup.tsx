import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Crown, Shield, CheckCircle } from 'lucide-react';
import { auth, db } from '@/integrations/firebase/client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SuperAdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a super admin role
      const rolesRef = collection(db, 'adminRoles');
      const superAdminRoleRef = doc(rolesRef, 'superAdmin'); // Use a fixed ID for superAdmin role

      // Check if the superAdmin role already exists
      const superAdminDoc = await getDoc(superAdminRoleRef);

      if (!superAdminDoc.exists()) {
        // Create the superAdmin role if it doesn't exist
        await setDoc(superAdminRoleRef, {
          name: 'Super Admin',
          description: 'The ultimate administrator with all privileges',
          is_system: true,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      }

      // Assign the superAdmin role to the new user
      const usersRef = collection(db, 'users_management');
      const userRef = doc(usersRef, user.uid);

      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        role: 'superAdmin',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      // Create a default admin profile
      const profileRef = doc(db, 'adminProfiles', user.uid);
      await setDoc(profileRef, {
        id: user.uid,
        name: 'Super Admin User',
        email: user.email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      setSignupSuccess(true);
      toast({
        title: 'Signup successful',
        description: 'Super Admin account created successfully',
      });

      // Redirect to admin dashboard or login page
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      setErrorMessage(error.message || 'Failed to create account. Please try again.');
      toast({
        title: 'Signup failed',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2 gold-gradient-text">
            <Crown className="h-5 w-5 text-gold" />
            Create Super Admin Account
          </CardTitle>
          <CardDescription>
            Only one super admin account is allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {signupSuccess ? (
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Account created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-gold/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus-visible:ring-gold/30 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="focus-visible:ring-gold/30 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-black gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSignup;
