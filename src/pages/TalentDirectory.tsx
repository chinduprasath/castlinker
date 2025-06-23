import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Star, MapPin, Eye, MessageSquare, UserPlus, Award, Briefcase, Clock, ChevronDown, ChevronUp, Users, SlidersHorizontal, Grid, List, ArrowUpDown, CheckCircle, Crown, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTalentDirectory } from '@/hooks/useTalentDirectory';
import { useAuth } from '@/contexts/AuthContext';
import { PROFESSION_OPTIONS } from '@/types/talent';
import { toast } from 'sonner';
import TalentProfileModal from '@/components/talent/TalentProfileModal';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';

const TalentDirectory = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const { 
    talents,
    isLoading,
    filters,
    updateFilters,
    locations,
    resetFilters,
    PROFESSION_OPTIONS,
    likedProfiles,
    wishlistedProfiles,
    connectionRequests,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    toggleLike,
    toggleWishlist,
    sendConnectionRequest,
    shareProfile,
    sendMessage,
    changePage
  } = useTalentDirectory();
  const { user } = useAuth();
  const { toast: useToastHook } = useToast();

  const handleOpenProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedProfileId(null);
  };

  const isLiked = (profileId: string) => likedProfiles.includes(profileId);
  const isWishlisted = (profileId: string) => wishlistedProfiles.includes(profileId);
  const getConnectionStatus = (profileId: string) => {
    const request = connectionRequests.find(req => 
      (req.requesterId === 'current-user' && req.recipientId === profileId) ||
      (req.recipientId === 'current-user' && req.requesterId === profileId)
    );
    return request ? request.status : null;
  };

  const handleConnect = (profile) => {
    const success = sendConnectionRequest(profile);
    if (success) {
      useToastHook({
        title: "Connection request sent",
        description: `A connection request has been sent to ${profile.name || 'Talent'}.`,
      });
    } else {
      toast.error("Could not send connection request");
    }
  };

  const handleShare = (profile) => {
    shareProfile(profile);
  };

  const handleMessage = (profile) => {
    toast.info(`Messaging ${profile.name || 'Talent'} - this feature is not fully implemented.`);
    const message = prompt(`Enter your message to ${profile.name || 'Talent'}:`);
    if (message) {
      const success = sendMessage(profile, message);
      if (success) {
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message.");
      }
    }
  };

  const handleLike = (profileId: string) => {
    toggleLike(profileId);
  };

  const handleWishlist = (profileId: string) => {
    toggleWishlist(profileId);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Talent Directory</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="search"
              placeholder="Search talents..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />

            <Select onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Customize your talent search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  Role <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2">
                  {PROFESSION_OPTIONS.map((role) => (
                    <div key={role.value} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`role-${role.value}`}
                        className="h-4 w-4"
                        checked={filters.selectedRoles.includes(role.value)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...filters.selectedRoles, role.value]
                            : filters.selectedRoles.filter((r) => r !== role.value);
                          updateFilters({ selectedRoles: newRoles });
                        }}
                      />
                      <Label htmlFor={`role-${role.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {role.label}
                      </Label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  Location <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`location-${location}`}
                        className="h-4 w-4"
                        checked={filters.selectedLocations.includes(location)}
                        onChange={(e) => {
                          const newLocations = e.target.checked
                            ? [...filters.selectedLocations, location]
                            : filters.selectedLocations.filter((loc) => loc !== location);
                          updateFilters({ selectedLocations: newLocations });
                        }}
                      />
                      <Label htmlFor={`location-${location}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {location}
                      </Label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  Experience <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Years: {filters.experienceRange[0]} - {filters.experienceRange[1]}</Label>
                  </div>
                  <Slider
                    defaultValue={filters.experienceRange}
                    max={30}
                    step={1}
                    onValueChange={(value) => updateFilters({ experienceRange: value })}
                  />
                </CollapsibleContent>
              </Collapsible>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => updateFilters({ verifiedOnly: checked })}
                  />
                  <Label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                    Verified Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={filters.availableOnly}
                    onCheckedChange={(checked) => updateFilters({ availableOnly: checked })}
                  />
                  <Label htmlFor="available" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                    Available Only
                  </Label>
                </div>
              </div>

              <div>
                <Label>Minimum Likes: {filters.likesMinimum}</Label>
                <Slider
                  defaultValue={[filters.likesMinimum]}
                  max={200}
                  step={10}
                  onValueChange={(value) => updateFilters({ likesMinimum: value[0] })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="text-center py-8">Loading talents...</div>
          ) : talents.length === 0 ? (
            <div className="text-center py-8">No talents found with the current filters.</div>
          ) : (
            <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {talents.map((talent) => (
                <Card key={talent.id} className="bg-card-gradient border-gold/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage src={talent.avatar} alt={talent.name} />
                          <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <CardTitle className="text-lg font-semibold">{talent.name}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {talent.role}
                          </CardDescription>
                        </div>
                      </div>
                      {talent.isPremium && (
                        <Badge variant="secondary" className="bg-gold/10 text-gold border-0">
                          <Crown className="h-4 w-4 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{talent.location}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(talent.joinedDate || talent.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-sm line-clamp-3 text-muted-foreground">{talent.bio}</p>

                    <div className="flex flex-wrap gap-2">
                      {talent.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {talent.skills.length > 3 && (
                        <Badge variant="outline">+ {talent.skills.length - 3} more</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-gold" />
                        <span>{talent.rating.toFixed(1)} ({talent.reviews} Reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{talent.likesCount} Likes</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleOpenProfile(talent.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleLike(talent.id)}
                          className={isLiked(talent.id) ? "text-red-500" : ""}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleWishlist(talent.id)}
                          className={isWishlisted(talent.id) ? "text-blue-500" : ""}
                        >
                          <Award className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  {isGridView ? null : (
                    <CardContent className="flex justify-between">
                      <Button size="sm" onClick={() => handleConnect(talent)}>
                        {getConnectionStatus(talent.userId) === 'pending' ? (
                          <>Pending...</>
                        ) : getConnectionStatus(talent.userId) === 'accepted' ? (
                          <>Connected <UserPlus className="h-4 w-4 ml-2" /></>
                        ) : (
                          <>Connect <UserPlus className="h-4 w-4 ml-2" /></>
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare(talent)}>
                          Share <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMessage(talent)}>
                          Message <MessageSquare className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {talents.length} of {totalCount} talents
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TalentProfileModal
        isOpen={profileOpen}
        onClose={handleCloseProfile}
        profileId={selectedProfileId}
        isLiked={selectedProfileId ? isLiked(selectedProfileId) : false}
        isWishlisted={selectedProfileId ? isWishlisted(selectedProfileId) : false}
        connectionStatus={selectedProfileId ? getConnectionStatus(selectedProfileId) : null}
        onConnect={selectedProfileId ? () => {
          const profile = talents.find(t => t.id === selectedProfileId);
          if (profile) handleConnect(profile);
        } : undefined}
        onShare={selectedProfileId ? () => {
          const profile = talents.find(t => t.id === selectedProfileId);
          if (profile) handleShare(profile);
        } : undefined}
        onMessage={selectedProfileId ? () => {
          const profile = talents.find(t => t.id === selectedProfileId);
          if (profile) handleMessage(profile);
        } : undefined}
        onLike={selectedProfileId ? () => handleLike(selectedProfileId) : undefined}
        onWishlist={selectedProfileId ? () => handleWishlist(selectedProfileId) : undefined}
      />
    </div>
  );
};

export default TalentDirectory;
