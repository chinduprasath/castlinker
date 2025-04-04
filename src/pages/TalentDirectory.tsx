
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Check, Star, MessageCircle, Bookmark, ArrowUpDown, 
  MapPin, Filter, UserPlus, Badge as BadgeIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTalentDirectory, TalentProfile } from "@/hooks/useTalentDirectory";
import { MessageDialog } from "@/components/talent/MessageDialog";
import { ProfileDialog } from "@/components/talent/ProfileDialog";
import { Skeleton } from "@/components/ui/skeleton";

// Roles available in the film industry
const roles = [
  "Actor", "Director", "Producer", "Cinematographer", "Screenwriter", "Editor", 
  "Production Designer", "Costume Designer", "Sound Designer", "Makeup Artist", 
  "VFX Artist", "Composer", "Stunt Performer", "Casting Director"
];

// Locations for filtering
const locations = [
  "Los Angeles, CA", "New York, NY", "Atlanta, GA", "Chicago, IL", "Miami, FL",
  "Austin, TX", "Vancouver, BC", "Toronto, ON", "London, UK", "Paris, France"
];

const TalentDirectory = () => {
  const { user } = useAuth();
  const {
    profiles,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    sendMessage
  } = useTalentDirectory();
  
  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);
  
  const handleMessageClick = (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setMessageDialogOpen(true);
  };
  
  const handleViewProfile = (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setProfileDialogOpen(true);
  };
  
  const toggleRole = (role: string) => {
    updateFilters({
      selectedRoles: filters.selectedRoles.includes(role)
        ? filters.selectedRoles.filter(r => r !== role)
        : [...filters.selectedRoles, role]
    });
  };
  
  const toggleLocation = (location: string) => {
    updateFilters({
      selectedLocations: filters.selectedLocations.includes(location)
        ? filters.selectedLocations.filter(l => l !== location)
        : [...filters.selectedLocations, location]
    });
  };

  return (
    <div className="space-y-4 pr-1">
      {/* Header Section */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Talent Directory
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and connect with talented film industry professionals from around the world.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button size="sm" className="bg-gold hover:bg-gold/90 text-black gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Connect</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm">
        <CardHeader className="px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, role, or keyword..." 
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className="pl-9 bg-background/50 border-gold/10 focus-visible:ring-gold/30"
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateFilters({ sortBy: value as 'rating' | 'experience' | 'reviews' })}
              >
                <SelectTrigger className="w-[180px] border-gold/10 focus:ring-gold/30 bg-background/50">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>
              
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-gold/10 focus:ring-gold/30">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] bg-cinematic-dark border-gold/10">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Talent Filters</SheetTitle>
                    <SheetDescription>Refine your talent search with specific criteria.</SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Role</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {roles.slice(0, 8).map(role => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`role-${role}`} 
                              checked={filters.selectedRoles.includes(role)} 
                              onCheckedChange={() => toggleRole(role)}
                              className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                            />
                            <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Location</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {locations.slice(0, 5).map(location => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`location-${location}`} 
                              checked={filters.selectedLocations.includes(location)} 
                              onCheckedChange={() => toggleLocation(location)}
                              className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                            />
                            <Label htmlFor={`location-${location}`} className="text-sm">{location}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-foreground/80">Experience (Years)</h3>
                        <span className="text-xs text-gold">
                          {filters.experienceRange[0]} - {filters.experienceRange[1]}+
                        </span>
                      </div>
                      <Slider 
                        defaultValue={filters.experienceRange} 
                        min={0} 
                        max={20} 
                        step={1} 
                        value={filters.experienceRange}
                        onValueChange={(value) => updateFilters({ experienceRange: value as [number, number] })}
                        className="py-2"
                      />
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Additional Filters</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="verified" 
                            checked={filters.verifiedOnly} 
                            onCheckedChange={() => updateFilters({ verifiedOnly: !filters.verifiedOnly })}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="verified" className="text-sm">Verified Talents Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="available" 
                            checked={filters.availableOnly} 
                            onCheckedChange={() => updateFilters({ availableOnly: !filters.availableOnly })}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="available" className="text-sm">Currently Available Only</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={resetFilters} className="border-gold/10">
                        Clear All
                      </Button>
                      <Button onClick={() => setFiltersOpen(false)} className="bg-gold text-black hover:bg-gold/90">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Applied Filters */}
      {(filters.selectedRoles.length > 0 || filters.selectedLocations.length > 0 || filters.verifiedOnly || filters.availableOnly || filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-foreground/70">Active filters:</span>
          
          {filters.selectedRoles.map(role => (
            <Button
              key={`filter-${role}`}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => toggleRole(role)}
            >
              {role}
              <span className="ml-1 text-xs">×</span>
            </Button>
          ))}
          
          {filters.selectedLocations.map(location => (
            <Button
              key={`filter-${location}`}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => toggleLocation(location)}
            >
              {location}
              <span className="ml-1 text-xs">×</span>
            </Button>
          ))}
          
          {filters.verifiedOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ verifiedOnly: false })}
            >
              Verified Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {filters.availableOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ availableOnly: false })}
            >
              Available Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {(filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20) && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ experienceRange: [0, 20] })}
            >
              Experience: {filters.experienceRange[0]}-{filters.experienceRange[1]}+ yrs
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 py-1 border-gold/20 hover:bg-gold/10"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
      
      {/* Results Count */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-foreground/70">
          Found <span className="text-gold font-medium">{profiles.length}</span> talents
        </p>
      </div>
      
      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="bg-card border-gold/10 overflow-hidden shadow-lg">
              <CardHeader className="p-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-10 w-16" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-10 w-full mb-3" />
                <div className="flex flex-wrap gap-1 mb-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gold/10 flex justify-between">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))
        ) : profiles.length > 0 ? (
          profiles.map(profile => (
            <Card key={profile.id} className="bg-card border-gold/10 overflow-hidden shadow-lg hover:border-gold/30 transition-all">
              <CardHeader className="p-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 border-2 border-gold/30">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{profile.name}</CardTitle>
                      {profile.isVerified && (
                        <Check className="h-4 w-4 text-gold bg-gold/20 rounded-full p-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <span>{profile.role}</span>
                      <span className="text-xs">•</span>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gold mr-1 fill-gold" />
                      <span className="text-sm font-medium">{profile.rating}</span>
                    </div>
                    <span className="text-xs text-foreground/60">{profile.reviews} reviews</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
                  {profile.bio}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.skills.slice(0, 3).map(skill => (
                    <span 
                      key={`${profile.id}-${skill}`} 
                      className="text-xs px-2 py-0.5 bg-gold/10 text-gold/90 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gold/5 text-gold/70 rounded-full">
                      +{profile.skills.length - 3} more
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
                  <div>
                    <span className="block text-foreground/50">Experience</span>
                    <span className="font-medium text-foreground/80">{profile.experience} years</span>
                  </div>
                  <div>
                    <span className="block text-foreground/50">Languages</span>
                    <span className="font-medium text-foreground/80">
                      {profile.languages.length > 0 
                        ? profile.languages.join(", ") 
                        : "English"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gold/10 flex justify-between bg-gradient-to-r from-transparent to-gold/5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 border-gold/20 hover:bg-gold/10"
                  onClick={() => handleMessageClick(profile)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1 bg-gold text-black hover:bg-gold/90"
                  onClick={() => handleViewProfile(profile)}
                >
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 bg-card border border-gold/10 rounded-xl p-8 text-center">
            <BadgeIcon className="h-12 w-12 text-gold/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matching talents found</h3>
            <p className="text-foreground/70 mb-4">
              Try adjusting your search criteria or filters to find talents that match your needs.
            </p>
            <Button onClick={resetFilters} className="bg-gold hover:bg-gold/90 text-black">
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <MessageDialog 
        isOpen={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        profile={selectedProfile}
        onSendMessage={sendMessage}
      />
      
      <ProfileDialog
        isOpen={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        profile={selectedProfile}
        onMessage={handleMessageClick}
      />
    </div>
  );
};

export default TalentDirectory;
