import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageCircle, Users, Search, Filter, Grid, List, Heart, Bookmark, Share, ArrowUpDown, X, MoreVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTalentDirectory } from "@/hooks/useTalentDirectory";
import TalentProfileModal from "@/components/talent/TalentProfileModal";
import { ConnectDialog } from "@/components/talent/ConnectDialog";
import { MessageDialog } from "@/components/talent/MessageDialog";
import { TalentProfile, PROFESSION_OPTIONS } from "@/types/talentTypes";
import { useTheme } from "@/contexts/ThemeContext";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { db } from '@/integrations/firebase/client';
import { addDoc, collection } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Popover } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const TalentDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [likesFilter, setLikesFilter] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("highest-rated");
  const [showFilters, setShowFilters] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const { talents } = useTalentDirectory();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationFilter(e.target.value);
  };

  const handleProfessionFilter = (value: string) => {
    setProfessionFilter(value);
  };

  const handleExperienceFilter = (value: string) => {
    setExperienceFilter(value);
  };

  const handleAvailabilityFilter = (value: string) => {
    setAvailabilityFilter(value);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handleLikesFilter = (value: string) => {
    setLikesFilter(value);
  };

  const filteredTalents = talents.filter((talent) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const locationRegex = new RegExp(locationFilter, "i");
    const professionMatch =
      !professionFilter || professionFilter === 'all' || talent.profession_type === professionFilter;
    const experienceMatch =
      !experienceFilter || experienceFilter === 'all' || talent.experience_years.toString() === experienceFilter;
    const availabilityMatch =
      !availabilityFilter || availabilityFilter === 'all' || talent.availability_status === availabilityFilter;
    const likesMatch =
      !likesFilter || likesFilter === 'all' || (talent.likes && talent.likes >= parseInt(likesFilter));
    const languagesMatch =
      selectedLanguages.length === 0 || selectedLanguages.some(lang => talent.languages.includes(lang));

    return (
      searchRegex.test(talent.full_name) &&
      locationRegex.test(talent.location) &&
      professionMatch &&
      experienceMatch &&
      availabilityMatch &&
      likesMatch &&
      languagesMatch
    );
  });

  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setProfessionFilter("all");
    setExperienceFilter("all");
    setAvailabilityFilter("all");
    setSelectedSkills([]);
    setLikesFilter("all");
    setSelectedLanguages([]);
  };

  // Replace dynamic allLanguages with a static list
  const allLanguages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Urdu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Odia', 'Assamese', 'Konkani', 'Sanskrit', 'Sindhi', 'Kashmiri', 'French', 'German', 'Spanish', 'Italian', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Turkish', 'Dutch', 'Greek', 'Thai'
  ];

  // Firestore connection request handler
  const handleConnect = async (talent: TalentProfile, message: string) => {
    if (!user || !talent) {
      toast.error('You must be logged in to send a connection request.');
      return false;
    }
    try {
      await addDoc(collection(db, 'connection_requests'), {
        requesterId: user.id,
        requesterName: user.name,
        requesterAvatar: user.avatar,
        recipientId: talent.id,
        recipientName: talent.full_name,
        recipientAvatar: talent.avatar_url,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      toast.success('Connection request sent!');
      return true;
    } catch (error) {
      toast.error('Failed to send connection request.');
      return false;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gray-50 text-gray-900' 
        : 'bg-background text-foreground'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>Talent Directory</h1>
            <p className={`text-lg ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Discover and connect with talented film industry professionals from around the world.
            </p>
          </div>
          <Button
            onClick={() => navigate('/manage/talent-directory')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Manage Directory
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Search by name, role, or keyword..."
              value={searchTerm}
              onChange={handleSearch}
              className={`pl-10 h-12 ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' 
                  : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`h-12 px-6 ${theme === 'light' ? 'border-gray-300 text-gray-900 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Sidebar Panel */}
        {isSidebarOpen && (
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-gray-700 z-50 flex flex-col shadow-lg animate-slide-in-right transition-transform duration-300" style={{transform: 'translateX(0)'}}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Filter Talents</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-2xl font-bold">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Profession</Label>
                <Select value={professionFilter} onValueChange={handleProfessionFilter}>
                  <SelectTrigger className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}`}>
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}>
                    <SelectItem value="all">All Professions</SelectItem>
                    {PROFESSION_OPTIONS.map((profession) => (
                      <SelectItem key={profession.value} value={profession.value}>{profession.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Location</Label>
                <Input
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={handleLocationFilter}
                  className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}`}
                />
              </div>
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Experience (Years)</Label>
                <Select value={experienceFilter} onValueChange={handleExperienceFilter}>
                  <SelectTrigger className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}`}>
                    <SelectValue placeholder="Any Experience" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}>
                    <SelectItem value="all">Any Experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Minimum Likes</Label>
                <Select value={likesFilter} onValueChange={handleLikesFilter}>
                  <SelectTrigger className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}`}>
                    <SelectValue placeholder="Any Likes" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}>
                    <SelectItem value="all">Any Likes</SelectItem>
                    <SelectItem value="10">10+ likes</SelectItem>
                    <SelectItem value="50">50+ likes</SelectItem>
                    <SelectItem value="100">100+ likes</SelectItem>
                    <SelectItem value="500">500+ likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Availability</Label>
                <Select value={availabilityFilter} onValueChange={handleAvailabilityFilter}>
                  <SelectTrigger className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}`}>
                    <SelectValue placeholder="Any Availability" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'}>
                    <SelectItem value="all">Any Availability</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Languages</Label>
                <Popover className="relative">
                  <Popover.Button className={`w-full mt-2 px-3 py-2 border rounded-md text-left ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}> 
                    {selectedLanguages.length === 0 ? 'Select languages...' : selectedLanguages.join(', ')}
                  </Popover.Button>
                  <Popover.Panel className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-background border border-gray-300 rounded-md shadow-lg p-2">
                    {allLanguages.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={lang}
                          checked={selectedLanguages.includes(lang)}
                          onCheckedChange={() => setSelectedLanguages((prev) => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                        />
                        <Label htmlFor={lang} className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{lang}</Label>
                      </div>
                    ))}
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t">
              <Button variant="outline" onClick={resetFilters} className="flex-1">Reset</Button>
              <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => setIsSidebarOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Found <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{filteredTalents.length}</span> talents
          </p>
        </div>

        {/* Talent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <Card key={talent.id} className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-200' : 'bg-gray-900 text-white border-gray-700'} overflow-hidden w-full max-w-sm mx-auto`}>
              <CardContent className="p-6">
                {/* Header with Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className={`h-12 w-12 flex-shrink-0 ${theme === 'light' ? 'bg-gray-200 text-gray-700' : ''}` }>
                      <AvatarImage src={talent.avatar_url} alt={talent.full_name} />
                      <AvatarFallback className={`${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-white'}` }>
                        {talent.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-lg truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{talent.full_name}</h3>
                      <div className={`flex items-center justify-between text-sm mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className="truncate">{talent.profession_type}</span>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <MapPin className={`h-3 w-3 ${theme === 'light' ? 'text-gray-400' : ''}`} />
                          <span className="truncate">{talent.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1">
                      <Heart className={`h-4 w-4 ${theme === 'light' ? 'text-red-500' : 'text-red-500'}` } />
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{talent.likes || 0}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => { setSelectedTalent(talent); setIsMessageDialogOpen(true); }}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bookmark className="mr-2 h-4 w-4" />
                          Save
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 line-clamp-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}` }>
                  Film industry professional with {talent.experience_years} years of experience in various productions.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {talent.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} className={`text-xs border-0 hover:bg-yellow-400 ${theme === 'light' ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-black'}` }>
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Experience and Languages */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Experience</span>
                    <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>{talent.experience_years} years</p>
                  </div>
                  <div>
                    <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Languages</span>
                    <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                      {talent.languages?.join(', ') || 'English'}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons - Like, Connect, View Profile */}
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-10 h-9 flex items-center justify-center p-0 min-w-0 ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-white hover:bg-gray-800'}`}
                    title="Like"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`w-10 h-9 flex items-center justify-center p-0 min-w-0 ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-white hover:bg-gray-800'}`}
                    onClick={() => { setSelectedTalent(talent); setIsConnectDialogOpen(true); }}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                  <Button 
                    className={`flex-1 h-9 font-semibold ${theme === 'light' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                    onClick={() => setSelectedTalent(talent)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modals */}
        <TalentProfileModal
          isOpen={selectedTalent !== null}
          onClose={() => setSelectedTalent(null)}
          profileId={selectedTalent?.id || null}
          isLiked={false}
          isWishlisted={false}
          connectionStatus={null}
        />

        <ConnectDialog
          isOpen={isConnectDialogOpen}
          onClose={() => setIsConnectDialogOpen(false)}
          talent={selectedTalent}
          onConnect={handleConnect}
        />

        <MessageDialog
          isOpen={isMessageDialogOpen}
          onClose={() => setIsMessageDialogOpen(false)}
          talent={selectedTalent}
        />
      </div>
    </div>
  );
};

export default TalentDirectory;