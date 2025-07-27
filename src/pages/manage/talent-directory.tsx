import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, MessageCircle, UserPlus, ExternalLink, Bookmark, X, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTalentDirectory } from "@/hooks/useTalentDirectory";
import { TalentProfile } from "@/types/talentTypes";
import { db } from '@/integrations/firebase/client';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ConnectDialog } from "@/components/talent/ConnectDialog";
import { MessageDialog } from "@/components/talent/MessageDialog";

interface ConnectionRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  createdAt: string;
}

const ManageTalentDirectory = () => {
  const [activeTab, setActiveTab] = useState("request-profiles");
  const [requestedProfiles, setRequestedProfiles] = useState<TalentProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<TalentProfile[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useTheme();
  const { talents } = useTalentDirectory();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchConnectionRequests();
      fetchSavedProfiles();
    }
  }, [user, talents]);

  const fetchConnectionRequests = async () => {
    if (!user) return;
    
    try {
      const requestsQuery = query(
        collection(db, 'connection_requests'),
        where('requesterId', '==', user.id)
      );
      const querySnapshot = await getDocs(requestsQuery);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConnectionRequest[];
      
      setConnectionRequests(requests);
      
      // Get talent profiles for requested connections
      const requestedIds = requests.map(req => req.recipientId);
      const requestedTalents = talents.filter(talent => requestedIds.includes(talent.id));
      setRequestedProfiles(requestedTalents);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedProfiles = async () => {
    if (!user) return;
    
    try {
      // Mock saved profiles - in real app, this would come from user preferences
      // For now, we'll show a subset of talents as "saved"
      const mockSavedIds = talents.slice(0, 3).map(t => t.id);
      const saved = talents.filter(talent => mockSavedIds.includes(talent.id));
      setSavedProfiles(saved);
    } catch (error) {
      console.error('Error fetching saved profiles:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'connection_requests', requestId));
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
      setRequestedProfiles(prev => prev.filter(profile => 
        !connectionRequests.find(req => req.id === requestId && req.recipientId === profile.id)
      ));
      toast.success('Connection request cancelled');
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const handleRemoveFromSaved = (talentId: string) => {
    setSavedProfiles(prev => prev.filter(profile => profile.id !== talentId));
    toast.success('Profile removed from saved');
  };

  const handleConnect = (talent: TalentProfile) => {
    setSelectedTalent(talent);
    setIsConnectDialogOpen(true);
  };

  const handleMessage = (talent: TalentProfile) => {
    setSelectedTalent(talent);
    setIsMessageDialogOpen(true);
  };

  const getRequestStatus = (talentId: string) => {
    const request = connectionRequests.find(req => req.recipientId === talentId);
    return request?.status || 'none';
  };

  const TalentCard = ({ talent, showActions = true, onRemove }: { 
    talent: TalentProfile; 
    showActions?: boolean; 
    onRemove?: () => void;
  }) => (
    <Card className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-200' : 'bg-gray-900 text-white border-gray-700'} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={talent.avatar_url} alt={talent.full_name} />
              <AvatarFallback className={`${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-white'}`}>
                {talent.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold text-lg truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {talent.full_name}
              </h3>
              <div className={`flex items-center justify-between text-sm mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="truncate">{talent.profession_type}</span>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{talent.location}</span>
                </div>
              </div>
            </div>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {talent.rating || 0}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {talent.experience_years}+ years
          </Badge>
          <Badge variant="outline" className="text-xs">
            {talent.availability_status}
          </Badge>
        </div>

        <p className={`text-sm mb-4 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          {talent.description || 'No description available'}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {talent.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {talent.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{talent.skills.length - 3} more
            </Badge>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            {activeTab === "request-profiles" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const request = connectionRequests.find(req => req.recipientId === talent.id);
                    if (request) handleCancelRequest(request.id);
                  }}
                  className="flex-1"
                >
                  Cancel Request
                </Button>
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  {getRequestStatus(talent.id)}
                </Badge>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessage(talent)}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConnect(talent)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-background text-foreground'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-background text-foreground'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/talent-directory')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Manage Talent Directory
          </h1>
          <p className={`text-lg ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Manage your talent connections and saved profiles
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-9">
            <TabsTrigger value="request-profiles" className="text-sm">Requests</TabsTrigger>
            <TabsTrigger value="saved-profiles" className="text-sm">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="request-profiles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Request Profiles
              </h2>
              <Badge variant="secondary">
                {requestedProfiles.length} profile{requestedProfiles.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {requestedProfiles.length === 0 ? (
              <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No requests sent yet</h3>
                <p>Connection requests you send will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requestedProfiles.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved-profiles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Saved Profiles
              </h2>
              <Badge variant="secondary">
                {savedProfiles.length} profile{savedProfiles.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {savedProfiles.length === 0 ? (
              <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No saved profiles found</h3>
                <p>Profiles you bookmark will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProfiles.map((talent) => (
                  <TalentCard 
                    key={talent.id} 
                    talent={talent} 
                    onRemove={() => handleRemoveFromSaved(talent.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Connect Dialog */}
      <ConnectDialog
        talent={selectedTalent}
        isOpen={isConnectDialogOpen}
        onClose={() => {
          setIsConnectDialogOpen(false);
          setSelectedTalent(null);
        }}
      />

      {/* Message Dialog */}
      <MessageDialog
        talent={selectedTalent}
        isOpen={isMessageDialogOpen}
        onClose={() => {
          setIsMessageDialogOpen(false);
          setSelectedTalent(null);
        }}
        onSendMessage={async (subject, message) => {
          toast.success('Message sent successfully!');
          setIsMessageDialogOpen(false);
          setSelectedTalent(null);
          return true;
        }}
      />
    </div>
  );
};

export default ManageTalentDirectory;