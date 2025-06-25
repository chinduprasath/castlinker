
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageCircle, Users, Search, Filter, Grid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTalentDirectory } from "@/hooks/useTalentDirectory";
import TalentProfileModal from "@/components/talent/TalentProfileModal";
import { ConnectDialog } from "@/components/talent/ConnectDialog";
import { MessageDialog } from "@/components/talent/MessageDialog";
import { TalentProfile } from "@/types/talentTypes";

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

  const { talents } = useTalentDirectory();

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Talent Directory</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="md:w-1/3"
        />
        <Input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={handleLocationFilter}
          className="md:w-1/3"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select onValueChange={handleProfessionFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Actor">Actor</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="Writer">Writer</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleExperienceFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 year</SelectItem>
            <SelectItem value="2">2 years</SelectItem>
            <SelectItem value="5">5 years</SelectItem>
            <SelectItem value="10">10+ years</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleAvailabilityFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleRatingFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 star</SelectItem>
            <SelectItem value="2">2 stars</SelectItem>
            <SelectItem value="3">3 stars</SelectItem>
            <SelectItem value="4">4 stars</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium">Filter by Skills:</p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skill-1"
              checked={selectedSkills.includes("Directing")}
              onCheckedChange={() => handleSkillSelect("Directing")}
            />
            <Label htmlFor="skill-1">Directing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skill-2"
              checked={selectedSkills.includes("Writing")}
              onCheckedChange={() => handleSkillSelect("Writing")}
            />
            <Label htmlFor="skill-2">Writing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skill-3"
              checked={selectedSkills.includes("Editing")}
              onCheckedChange={() => handleSkillSelect("Editing")}
            />
            <Label htmlFor="skill-3">Editing</Label>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={resetFilters} className="mb-4">
        Reset Filters
      </Button>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {filteredTalents.length} Talents Found
        </h2>
        <div>
          <Button
            variant="ghost"
            onClick={() => setIsGridView(true)}
            className={isGridView ? "bg-secondary text-secondary-foreground" : ""}
          >
            <Grid className="mr-2 h-4 w-4" />
            Grid
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsGridView(false)}
            className={!isGridView ? "bg-secondary text-secondary-foreground" : ""}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {isGridView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTalents.map((talent) => (
            <Card key={talent.id} className="bg-white shadow-md rounded-md">
              <CardHeader>
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={talent.avatar_url} alt={talent.full_name} />
                    <AvatarFallback>{talent.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{talent.full_name}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{talent.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Badge variant="secondary">{talent.profession_type}</Badge>
                </div>
                <div className="flex items-center mb-2">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>{talent.rating || 0}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {talent.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedTalent(talent); setIsConnectDialogOpen(true); }}>
                    <Users className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedTalent(talent); setIsMessageDialogOpen(true); }}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredTalents.map((talent) => (
            <div key={talent.id} className="py-4">
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src={talent.avatar_url} alt={talent.full_name} />
                  <AvatarFallback>{talent.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{talent.full_name}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{talent.location}</span>
                  </div>
                  <div className="mb-2">
                    <Badge variant="secondary">{talent.profession_type}</Badge>
                  </div>
                  <div className="flex items-center mb-2">
                    <Star className="mr-1 h-4 w-4 text-yellow-500" />
                    <span>{talent.rating || 0}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {talent.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={() => { setSelectedTalent(talent); setIsConnectDialogOpen(true); }}>
                  <Users className="mr-2 h-4 w-4" />
                  Connect
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedTalent(talent); setIsMessageDialogOpen(true); }}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
};

export default TalentDirectory;
