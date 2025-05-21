
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Edit2, Save } from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  
  // Social media links state
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  });
  
  // Edit mode state
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  
  // Function to handle social media link changes
  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialMediaLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  // Function to save social media links
  const handleSaveSocialLinks = () => {
    // Here you would typically save to a database or API
    console.log("Saving social media links:", socialMediaLinks);
    setIsEditingSocial(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 border-b border-border/40 pb-5">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6 bg-card/80 border border-gold/10">
          <TabsTrigger value="general" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">General</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="border-gold/10 shadow-sm mb-6">
            <CardHeader className="px-6">
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select 
                  id="language" 
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone" 
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  defaultValue="utc"
                >
                  <option value="utc">UTC</option>
                  <option value="est">Eastern Time</option>
                  <option value="pst">Pacific Time</option>
                  <option value="cet">Central European Time</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="px-6">
              <Button className="bg-gold text-black hover:bg-gold/90">Save Changes</Button>
            </CardFooter>
          </Card>
          
          {/* Social Media Links Section */}
          <Card className="border-gold/10 shadow-sm">
            <CardHeader className="px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Connect your profile to your social media accounts
                </CardDescription>
              </div>
              <div>
                {isEditingSocial ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveSocialLinks} 
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditingSocial(true)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-4">
                {/* Facebook */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Facebook className="h-5 w-5 text-[#1877F2]" />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={socialMediaLinks.facebook}
                      onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                      placeholder="https://facebook.com/username"
                      readOnly={!isEditingSocial}
                      className={!isEditingSocial ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                {/* Twitter/X */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={socialMediaLinks.twitter}
                      onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                      placeholder="https://twitter.com/username"
                      readOnly={!isEditingSocial}
                      className={!isEditingSocial ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                {/* LinkedIn */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={socialMediaLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      readOnly={!isEditingSocial}
                      className={!isEditingSocial ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                {/* Instagram */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Instagram className="h-5 w-5 text-[#E4405F]" />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={socialMediaLinks.instagram}
                      onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/username"
                      readOnly={!isEditingSocial}
                      className={!isEditingSocial ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                {/* Youtube */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Youtube className="h-5 w-5 text-[#FF0000]" />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={socialMediaLinks.youtube}
                      onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                      placeholder="https://youtube.com/channel/username"
                      readOnly={!isEditingSocial}
                      className={!isEditingSocial ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="border-gold/10 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how CastLinker looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select 
                  id="theme" 
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  defaultValue="dark"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="px-6">
              <Button className="bg-gold text-black hover:bg-gold/90">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border-gold/10 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">Receive notifications about new jobs and messages.</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-gold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">Receive emails about new features and special offers.</p>
                </div>
                <Switch
                  id="marketing"
                  checked={marketing}
                  onCheckedChange={setMarketing}
                  className="data-[state=checked]:bg-gold"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Newsletter</Label>
                  <p className="text-muted-foreground text-sm">Receive our weekly industry newsletter.</p>
                </div>
                <Switch
                  id="newsletter"
                  checked={newsletter}
                  onCheckedChange={setNewsletter}
                  className="data-[state=checked]:bg-gold"
                />
              </div>
            </CardContent>
            <CardFooter className="px-6">
              <Button className="bg-gold text-black hover:bg-gold/90">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="border-gold/10 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <input 
                  id="current-password" 
                  type="password"
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <input 
                  id="new-password" 
                  type="password"
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <input 
                  id="confirm-password" 
                  type="password"
                  className="w-full p-2 border rounded bg-background text-foreground border-gold/10"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="px-6">
              <Button className="bg-gold text-black hover:bg-gold/90">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
