import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Crown, Shield, Lock, Users, Settings, AlertTriangle } from 'lucide-react';

const SuperAdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Create the user account
      const { user, error } = await signUp(email, password, {
        firstName,
        lastName,
      });

      if (error) {
        throw error;
      }

      if (user) {
        // Store super admin request in Firestore
        await addDoc(collection(db, 'super_admin_requests'), {
          user_id: user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          organization_name: organizationName,
          job_title: jobTitle,
          phone_number: phoneNumber,
          business_type: businessType,
          company_size: companySize,
          additional_info: additionalInfo,
          status: 'pending',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });

        toast({
          title: 'Super Admin Request Submitted',
          description: 'Your request has been submitted for review. You will be contacted within 24-48 hours.',
        });

        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      setErrorMessage(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cinematic via-cinematic-dark to-black p-4">
      <Card className="w-full max-w-2xl bg-card-gradient border-gold/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Crown className="h-12 w-12 text-gold" />
          </div>
          <CardTitle className="text-3xl text-gold">Super Admin Registration</CardTitle>
          <CardDescription>
            Apply for super administrator access to manage your organization's FilmCollab platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              Super Admin access requires manual approval. All requests are reviewed within 24-48 hours.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                    className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                />
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Organization Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization/Company Name</Label>
                <Input
                  id="organizationName"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter your organization name"
                  required
                  className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Your Job Title</Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., CEO, Producer, Director"
                    required
                    className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select onValueChange={setBusinessType} required>
                    <SelectTrigger className="bg-cinematic-dark/50 border-gold/30 focus:border-gold">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production-company">Production Company</SelectItem>
                      <SelectItem value="film-studio">Film Studio</SelectItem>
                      <SelectItem value="talent-agency">Talent Agency</SelectItem>
                      <SelectItem value="casting-agency">Casting Agency</SelectItem>
                      <SelectItem value="educational-institution">Educational Institution</SelectItem>
                      <SelectItem value="entertainment-company">Entertainment Company</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select onValueChange={setCompanySize} required>
                  <SelectTrigger className="bg-cinematic-dark/50 border-gold/30 focus:border-gold">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    required
                    className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Additional Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">
                  Tell us about your use case for FilmCollab Super Admin access
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Describe your organization's needs and how you plan to use the platform..."
                  rows={4}
                  className="bg-cinematic-dark/50 border-gold/30 focus:border-gold"
                />
              </div>
            </div>

            {errorMessage && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-gold/30"
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy, and understand that super admin access requires approval
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold/90 text-cinematic" 
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? 'Submitting Request...' : 'Submit Super Admin Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSignup;
