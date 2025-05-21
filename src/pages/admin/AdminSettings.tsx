import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Shield,
  Users,
  Lock,
  Mail,
  Bell,
  Save,
  Globe,
  FileText,
  Database,
  RefreshCw,
  HelpCircle,
  Upload,
  Image,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";
import { useForm } from "react-hook-form";
import RoleEditor from "@/components/admin/RoleEditor";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const AdminSettings = () => {
  const { hasPermission } = useAdminAuth();
  const canManageRoles = hasPermission('team', 'edit');
  
  useEffect(() => {
    try {
      // Component logic goes here (or is already here)
      console.log("AdminSettings component mounted."); // Add a log to confirm mounting
    } catch (error) {
      console.error("Error in AdminSettings component:", error); // Log any errors caught
    }
  }, []); // Empty dependency array means this runs once on mount

  // Site settings form
  const siteSettingsForm = useForm({
    defaultValues: {
      siteName: "CastLinker",
      siteDescription: "The ultimate platform connecting talent with opportunities in the entertainment industry.",
      supportEmail: "support@castlinker.com",
      maxUploadSize: "10",
      maintenance: false,
      analyticsEnabled: true,
      primaryColor: "#FFC107",
      secondaryColor: "#6B46C1",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      youtubeUrl: ""
    }
  });

  // File upload states
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5"
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.castlinker.com",
    smtpPort: "587",
    smtpUser: "notifications@castlinker.com",
    enableWelcomeEmail: true,
    enableNotificationEmails: true,
    emailFooter: "© 2024 CastLinker. All rights reserved."
  });

  // Social media editing state
  const [isSocialMediaEditing, setIsSocialMediaEditing] = useState(false);

  // Handle favicon upload
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Favicon uploaded. Click 'Save Settings' to apply changes.");
    }
  };
  
  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Logo uploaded. Click 'Save Settings' to apply changes.");
    }
  };

  // Function to handle security settings change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Function to handle email settings change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEmailSettings({
      ...emailSettings,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  // Function to handle saving site settings
  const handleSaveSiteSettings = (data: any) => {
    console.log("Saving site settings:", data);
    console.log("Favicon file:", faviconFile);
    console.log("Logo file:", logoFile);
    
    // In a real app, upload the files to a server or storage service
    // Then update the site settings with the file URLs
    
    toast.success("Site settings saved successfully!");
  };

  // Function to handle canceling social media link editing
  const handleCancelSocialMediaEdit = () => {
    setIsSocialMediaEditing(false);
    siteSettingsForm.resetField("facebookUrl");
    siteSettingsForm.resetField("instagramUrl");
    siteSettingsForm.resetField("twitterUrl");
    siteSettingsForm.resetField("linkedinUrl");
    siteSettingsForm.resetField("youtubeUrl");
  };

  // Function to handle saving social media links
  const handleSaveSocialMediaLinks = () => {
    // In a real app, save the social media links to the database or server
    setIsSocialMediaEditing(false);
    toast.success("Social media links saved successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">Admin Settings</h1>
      <p className="text-muted-foreground">Configure system-wide settings and preferences.</p>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...siteSettingsForm}>
                <form onSubmit={siteSettingsForm.handleSubmit(handleSaveSiteSettings)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={siteSettingsForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your platform
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={siteSettingsForm.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            Main contact email for support
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Site Description and Maintenance Mode in Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Site Description (Left Column) */}
                    <FormField
                      control={siteSettingsForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormDescription>
                            Brief description of the platform
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    {/* Maintenance Mode (Right Column) */}
                     <FormField
                      control={siteSettingsForm.control}
                      name="maintenance"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Maintenance Mode
                            </FormLabel>
                            <FormDescription>
                              Enable to put the site in maintenance mode
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                       )}
                     />
                  </div>
                  
                  {/* Branding Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Branding</h3>
                    <Separator />
                    
                    {/* Social Media Links */}
                    <div className="space-y-4">
                      <h4 className="text-base font-medium">Social Media Links</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Facebook */}
                        <FormField
                          control={siteSettingsForm.control}
                          name="facebookUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Facebook className="h-4 w-4" />
                                Facebook URL
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://facebook.com/yourpage" disabled={!isSocialMediaEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Instagram */}
                        <FormField
                          control={siteSettingsForm.control}
                          name="instagramUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Instagram className="h-4 w-4" />
                                Instagram URL
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://instagram.com/yourpage" disabled={!isSocialMediaEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Twitter/X */}
                        <FormField
                          control={siteSettingsForm.control}
                          name="twitterUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter/X URL
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://twitter.com/yourpage" disabled={!isSocialMediaEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* LinkedIn */}
                        <FormField
                          control={siteSettingsForm.control}
                          name="linkedinUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn URL
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://linkedin.com/company/yourpage" disabled={!isSocialMediaEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* YouTube */}
                        <FormField
                          control={siteSettingsForm.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Youtube className="h-4 w-4" />
                                YouTube URL
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://youtube.com/yourchannel" disabled={!isSocialMediaEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Edit/Save Buttons */}
                      <div className="flex justify-end gap-2">
                        {!isSocialMediaEditing ? (
                          <Button type="button" variant="outline" onClick={() => setIsSocialMediaEditing(true)}>
                            Edit
                          </Button>
                        ) : (
                          <>
                            <Button type="button" variant="outline" onClick={handleCancelSocialMediaEdit}>Cancel</Button>
                            <Button type="button" onClick={handleSaveSocialMediaLinks} className="gap-2">
                              <Save className="h-4 w-4" />
                              Save
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Favicon Upload */}
                      <div className="space-y-2">
                        <FormLabel>Site Favicon</FormLabel>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 border rounded flex items-center justify-center bg-muted">
                            {faviconPreview ? (
                              <img src={faviconPreview} alt="Favicon Preview" className="max-w-full max-h-full" />
                            ) : (
                              <Image className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" onClick={() => document.getElementById('favicon-upload')?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Favicon
                              </Button>
                              {faviconFile && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  setFaviconFile(null);
                                  setFaviconPreview(null);
                                }}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <input 
                              id="favicon-upload" 
                              type="file" 
                              className="hidden" 
                              accept="image/png,image/jpeg,image/gif" 
                              onChange={handleFaviconChange}
                            />
                            <FormDescription className="mt-2">
                              Upload a small image (PNG, JPG, GIF) to be shown in browser tabs. Recommended size: 32x32px.
                            </FormDescription>
                          </div>
                        </div>
                      </div>
                      
                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <FormLabel>Site Logo</FormLabel>
                        <div className="flex items-start gap-4">
                          <div className="w-32 h-16 border rounded flex items-center justify-center bg-muted">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full" />
                            ) : (
                              <Image className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Logo
                              </Button>
                              {logoFile && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                  setLogoFile(null);
                                  setLogoPreview(null);
                                }}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <input 
                              id="logo-upload" 
                              type="file" 
                              className="hidden" 
                              accept="image/png,image/jpeg,image/svg+xml" 
                              onChange={handleLogoChange}
                            />
                            <FormDescription className="mt-2">
                              Upload your website logo in PNG, JPG, or SVG format. Recommended size: 200x50px.
                            </FormDescription>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme Colors</h3>
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={siteSettingsForm.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="h-8 w-10 border rounded"
                                />
                              </div>
                            </div>
                            <FormDescription>
                              Primary brand color (buttons, accents, etc.)
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={siteSettingsForm.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="h-8 w-10 border rounded"
                                />
                              </div>
                            </div>
                            <FormDescription>
                              Secondary brand color (highlights, complementary elements)
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium">Two-Factor Authentication</label>
                        <p className="text-sm text-muted-foreground">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <Switch 
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                      />
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium">Strong Password Policy</label>
                        <p className="text-sm text-muted-foreground">
                          Enforce complex password requirements
                        </p>
                      </div>
                      <Switch 
                        name="passwordPolicy"
                        checked={securitySettings.passwordPolicy}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordPolicy: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session Timeout (minutes)</label>
                      <Input 
                        type="number" 
                        name="sessionTimeout"
                        min="5" 
                        max="120" 
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecurityChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Time before inactive users are logged out
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Login Attempts</label>
                      <Input 
                        type="number" 
                        name="maxLoginAttempts"
                        min="3" 
                        max="10" 
                        value={securitySettings.maxLoginAttempts}
                        onChange={handleSecurityChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Number of failed attempts before account lockout
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-medium">Clear All Sessions</h4>
                            <p className="text-sm text-muted-foreground">
                              Log out all active users from the platform
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-medium">Full Security Audit</h4>
                            <p className="text-sm text-muted-foreground">
                              Generate a complete security audit report
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Manage email delivery settings and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMTP Server</label>
                      <Input 
                        name="smtpServer"
                        value={emailSettings.smtpServer}
                        onChange={handleEmailChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMTP Port</label>
                      <Input 
                        name="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={handleEmailChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMTP Username</label>
                      <Input 
                        name="smtpUser"
                        value={emailSettings.smtpUser}
                        onChange={handleEmailChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMTP Password</label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium">Welcome Emails</label>
                        <p className="text-sm text-muted-foreground">
                          Send welcome emails to new users
                        </p>
                      </div>
                      <Switch 
                        name="enableWelcomeEmail"
                        checked={emailSettings.enableWelcomeEmail}
                        onCheckedChange={(checked) => setEmailSettings({
                          ...emailSettings, 
                          enableWelcomeEmail: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium">Notification Emails</label>
                        <p className="text-sm text-muted-foreground">
                          Send email notifications to users
                        </p>
                      </div>
                      <Switch 
                        name="enableNotificationEmails"
                        checked={emailSettings.enableNotificationEmails}
                        onCheckedChange={(checked) => setEmailSettings({
                          ...emailSettings, 
                          enableNotificationEmails: checked
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Footer Text</label>
                      <Textarea 
                        name="emailFooter"
                        rows={3}
                        value={emailSettings.emailFooter}
                        onChange={handleEmailChange}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-2">
                          <Mail className="h-8 w-8 text-primary" />
                          <h4 className="font-medium">Welcome Email</h4>
                          <p className="text-sm text-muted-foreground">
                            Sent when users register
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-2">
                          <Bell className="h-8 w-8 text-primary" />
                          <h4 className="font-medium">Notification</h4>
                          <p className="text-sm text-muted-foreground">
                            General notifications
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-2">
                          <Shield className="h-8 w-8 text-primary" />
                          <h4 className="font-medium">Password Reset</h4>
                          <p className="text-sm text-muted-foreground">
                            Sent for password recovery
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Permissions Tab - Using RoleEditor component */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permission Management</CardTitle>
              <CardDescription>Manage administrative roles and their access levels</CardDescription>
            </CardHeader>
            <CardContent>
              {canManageRoles ? (
                <RoleEditor />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">Permission Restricted</h3>
                  <p className="text-center text-muted-foreground mt-2">
                    You don't have permission to manage roles and permissions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
