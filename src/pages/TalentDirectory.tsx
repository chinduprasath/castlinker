import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageCircle, Users, Search, Filter, Grid, List, Heart, Bookmark, Share, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTalentDirectory } from "@/hooks/useTalentDirectory";
import TalentProfileModal from "@/components/talent/TalentProfileModal";
import { ConnectDialog } from "@/components/talent/ConnectDialog";
import { MessageDialog } from "@/components/talent/MessageDialog";
import { TalentProfile } from "@/types/talentTypes";
import { useTheme } from "@/contexts/ThemeContext";

const TalentDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("highest-rated");
  const [showFilters, setShowFilters] = useState(false);

  const { talents } = useTalentDirectory();
  const { theme } = useTheme();

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

  const handleRatingFilter = (value: string) => {
    setRatingFilter(value);
  };

  const filteredTalents = talents.filter((talent) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const locationRegex = new RegExp(locationFilter, "i");
    const professionMatch =
      !professionFilter || talent.profession_type === professionFilter;
    const experienceMatch =
      !experienceFilter || talent.experience_years.toString() === experienceFilter;
    const availabilityMatch =
      !availabilityFilter || talent.availability_status === availabilityFilter;
    const skillsMatch =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) => talent.skills.includes(skill));
    const ratingMatch =
      !ratingFilter || (talent.rating && talent.rating >= parseInt(ratingFilter));

    return (
      searchRegex.test(talent.full_name) &&
      locationRegex.test(talent.location) &&
      professionMatch &&
      experienceMatch &&
      availabilityMatch &&
      skillsMatch &&
      ratingMatch
    );
  });

  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setProfessionFilter("");
    setExperienceFilter("");
    setAvailabilityFilter("");
    setSelectedSkills([]);
    setRatingFilter("");
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
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2">
            <Users className="mr-2 h-4 w-4" />
            Connect
          </Button>
        </div>

        {/* Search and Sort Bar */}
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-48 h-12 ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900' 
                  : 'bg-gray-800 border-gray-600 text-white'
              }`}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Highest Rated" />
              </SelectTrigger>
              <SelectContent className={theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'}>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="most-experienced">Most Experienced</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-6 ${
                theme === 'light' 
                  ? 'border-gray-300 text-gray-900 hover:bg-gray-100' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Found <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{filteredTalents.length}</span> talents
          </p>
        </div>

        {/* Talent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <Card key={talent.id} className="bg-gray-900 text-white border-gray-700 overflow-hidden w-full max-w-sm mx-auto">
              <CardContent className="p-6">
                {/* Header with Avatar and Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={talent.avatar_url} alt={talent.full_name} />
                      <AvatarFallback className="bg-gray-700 text-white">
                        {talent.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-lg truncate">{talent.full_name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span className="truncate">{talent.profession_type}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{talent.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{talent.rating || 0}</span>
                    <Heart className="h-4 w-4 text-red-500 ml-2" />
                    <span className="text-gray-400 text-sm">{talent.likes || 0}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  Film industry professional with {talent.experience_years} years of experience in various productions.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {talent.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} className="bg-yellow-500 text-black text-xs border-0 hover:bg-yellow-400">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Experience and Languages */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Experience</span>
                    <p className="text-white font-medium">{talent.experience_years} years</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Languages</span>
                    <p className="text-white font-medium">
                      {talent.languages?.join(', ') || 'English'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700 mb-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2 h-auto">
                      <Heart className="h-4 w-4" />
                      <span className="ml-1 text-xs">Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2 h-auto">
                      <Bookmark className="h-4 w-4" />
                      <span className="ml-1 text-xs">Save</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2 h-auto">
                      <Share className="h-4 w-4" />
                      <span className="ml-1 text-xs">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-gray-600 text-white hover:bg-gray-800 h-9"
                      onClick={() => { setSelectedTalent(talent); setIsMessageDialogOpen(true); }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-9" 
                      size="sm"
                      onClick={() => { setSelectedTalent(talent); setIsConnectDialogOpen(true); }}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black h-9"
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
