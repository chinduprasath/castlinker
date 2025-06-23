
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/integrations/firebase/client';
import { confirmPasswordReset } from 'firebase/auth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      toast({
        title: 'Invalid reset link',
        description: 'The password reset link is invalid or has expired.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now log in with your new password.',
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Password reset failed',
        description: error.message || 'Unable to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cinematic via-cinematic-dark to-black">
        <Card className="w-full max-w-md bg-card-gradient border-gold/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gold">Invalid Reset Link</CardTitle>
            <CardDescription className="text-center">
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/forgot-password')} 
              className="w-full bg-gold hover:bg-gold/90 text-cinematic"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cinematic via-cinematic-dark to-black">
      <Card className="w-full max-w-md bg-card-gradient border-gold/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gold">Reset Your Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold/90 text-cinematic" 
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
