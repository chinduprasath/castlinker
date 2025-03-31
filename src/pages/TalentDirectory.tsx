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
import { Search, Check, Star, MessageCircle, Bookmark, ArrowUpDown, MapPin, Filter, UserPlus } from "lucide-react";
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

// Dummy talent profiles data
const profiles = [
  {
    id: "p1",
    name: "Emma Thompson",
    role: "Actor",
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 56,
    isVerified: true,
    isPremium: true,
    isAvailable: true,
    skills: ["Drama", "Action", "Voice Acting"],
    experience: 8,
    languages: ["English", "French"],
    bio: "Award-winning actor with experience in film, television, and theater. Specialized in drama and action roles.",
    featuredIn: ["The Lost City", "Midnight Express", "Eternal Shadows"]
  },
  {
    id: "p2",
    name: "Michael Rodriguez",
    role: "Director",
    location: "New York, NY",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 42,
    isVerified: true,
    isPremium: false,
    isAvailable: true,
    skills: ["Feature Films", "Documentaries", "Commercials"],
    experience: 12,
    languages: ["English", "Spanish"],
    bio: "Independent film director with a passion for telling authentic human stories. My films have been featured in several international festivals.",
    featuredIn: ["Urban Echoes", "The Silent Revolution", "Beyond Borders"]
  },
  {
    id: "p3",
    name: "Sophia Lee",
    role: "Cinematographer",
    location: "Atlanta, GA",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 38,
    isVerified: true,
    isPremium: true,
    isAvailable: false,
    skills: ["Lighting", "Camera Operation", "Visual Storytelling"],
    experience: 6,
    languages: ["English", "Korean"],
    bio: "Cinematographer with a unique visual style. I specialize in creating atmospheric and emotionally resonant imagery.",
    featuredIn: ["Neon Dreams", "The Last Summer", "Whispers in the Dark"]
  },
  {
    id: "p4",
    name: "David Johnson",
    role: "Screenwriter",
    location: "Chicago, IL",
    avatar: "/placeholder.svg",
    rating: 4.6,
    reviews: 29,
    isVerified: false,
    isPremium: false,
    isAvailable: true,
    skills: ["Feature Screenplay", "TV Series", "Adaptations"],
    experience: 5,
    languages: ["English"],
    bio: "Writer with a knack for compelling dialogue and character development. I've written for both independent and studio productions.",
    featuredIn: ["The Inherited", "Crossroads", "Night Shift"]
  },
  {
    id: "p5",
    name: "Jessica Martinez",
    role: "Producer",
    location: "Miami, FL",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 61,
    isVerified: true,
    isPremium: true,
    isAvailable: true,
    skills: ["Budgeting", "Production Management", "Distribution"],
    experience: 10,
    languages: ["English", "Spanish"],
    bio: "Experienced producer with a track record of bringing films in on budget while maintaining creative integrity.",
    featuredIn: ["The Last Stand", "Ocean's Whisper", "Breaking Point"]
  },
  {
    id: "p6",
    name: "James Wilson",
    role: "Actor",
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 45,
    isVerified: true,
    isPremium: false,
    isAvailable: true,
    skills: ["Comedy", "Drama", "Stage Combat"],
    experience: 7,
    languages: ["English"],
    bio: "Versatile actor with training in both classical and method acting. Equally comfortable in dramatic and comedic roles.",
    featuredIn: ["The Comeback", "Life Interrupted", "Sunday Morning"]
  }
];

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
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState([0, 20]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  
  // Mobile filters visibility
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter logic
  const filteredProfiles = profiles.filter(profile => {
    // Search term filter
    if (searchTerm && !profile.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !profile.role.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !profile.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Role filter
    if (selectedRoles.length > 0 && !selectedRoles.includes(profile.role)) {
      return false;
    }
    
    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(profile.location)) {
      return false;
    }
    
    // Experience range filter
    if (profile.experience < experienceRange[0] || profile.experience > experienceRange[1]) {
      return false;
    }
    
    // Verified filter
    if (verifiedOnly && !profile.isVerified) {
      return false;
    }
    
    // Available filter
    if (availableOnly && !profile.isAvailable) {
      return false;
    }
    
    return true;
  });
  
  // Sort logic
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "experience") {
      return b.experience - a.experience;
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    }
    return 0;
  });
  
  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };
  
  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoles([]);
    setSelectedLocations([]);
    setExperienceRange([0, 20]);
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setSortBy("rating");
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-gold/10 focus-visible:ring-gold/30"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
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
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-gold/10 focus:ring-gold/30" onClick={() => setFiltersOpen(true)}>
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
                              checked={selectedRoles.includes(role)} 
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
                              checked={selectedLocations.includes(location)} 
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
                          {experienceRange[0]} - {experienceRange[1]}+
                        </span>
                      </div>
                      <Slider 
                        defaultValue={experienceRange} 
                        min={0} 
                        max={20} 
                        step={1} 
                        value={experienceRange}
                        onValueChange={setExperienceRange}
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
                            checked={verifiedOnly} 
                            onCheckedChange={() => setVerifiedOnly(!verifiedOnly)}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="verified" className="text-sm">Verified Talents Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="available" 
                            checked={availableOnly} 
                            onCheckedChange={() => setAvailableOnly(!availableOnly)}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="available" className="text-sm">Currently Available Only</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={clearFilters} className="border-gold/10">
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
      {(selectedRoles.length > 0 || selectedLocations.length > 0 || verifiedOnly || availableOnly || experienceRange[0] > 0 || experienceRange[1] < 20) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-foreground/70">Active filters:</span>
          
          {selectedRoles.map(role => (
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
          
          {selectedLocations.map(location => (
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
          
          {verifiedOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => setVerifiedOnly(false)}
            >
              Verified Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {availableOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => setAvailableOnly(false)}
            >
              Available Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {(experienceRange[0] > 0 || experienceRange[1] < 20) && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => setExperienceRange([0, 20])}
            >
              Experience: {experienceRange[0]}-{experienceRange[1]}+ yrs
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 py-1 border-gold/20 hover:bg-gold/10"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
      
      {/* Results Count */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-foreground/70">
          Found <span className="text-gold font-medium">{sortedProfiles.length}</span> talents
        </p>
      </div>
      
      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {sortedProfiles.map(profile => (
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
                {profile.skills.map(skill => (
                  <span 
                    key={`${profile.id}-${skill}`} 
                    className="text-xs px-2 py-0.5 bg-gold/10 text-gold/90 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
                <div>
                  <span className="block text-foreground/50">Experience</span>
                  <span className="font-medium text-foreground/80">{profile.experience} years</span>
                </div>
                <div>
                  <span className="block text-foreground/50">Languages</span>
                  <span className="font-medium text-foreground/80">{profile.languages.join(", ")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-gold/10 flex justify-between bg-gradient-to-r from-transparent to-gold/5">
              <Button variant="outline" size="sm" className="gap-1 border-gold/20 hover:bg-gold/10">
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Button>
              <Button size="sm" className="gap-1 bg-gold text-black hover:bg-gold/90">
                View Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TalentDirectory;
