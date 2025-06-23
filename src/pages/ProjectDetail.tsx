import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Film, 
  MapPin, 
  Calendar, 
  Users, 
  Settings, 
  ArrowLeft, 
  Edit,
  Clock,
  Star,
  MessageSquare,
  Share2,
  UserPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjectById } from '@/services/projectService';
import { fetchTeamMembers, requestToJoinTeam, respondToTeamRequest, removeTeamMember } from '@/services/teamMemberService';

interface Project {
  id: string;
  name: string;
  description?: string;
  current_status: string;
  location?: string;
  team_head_id: string;
  created_at: string;
  updated_at: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDescriptionEditOpen, setIsDescriptionEditOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const projectData = await fetchProjectById(projectId);
      if (projectData) {
        const projectWithDefaults = {
          id: projectData.id,
          name: projectData.name || '',
          description: projectData.description || '',
          current_status: projectData.current_status || '',
          location: projectData.location || '',
          team_head_id: projectData.team_head_id || '',
          created_at: projectData.created_at || '',
          updated_at: projectData.updated_at || ''
        } as Project;
        setProject(projectWithDefaults);
        setEditedDescription(projectWithDefaults.description || '');
      } else {
        toast({
          title: 'Project not found',
          description: 'The project you are looking for does not exist.',
          variant: 'destructive'
        });
        navigate('/projects');
        return;
      }

      const teamData = await fetchTeamMembers(projectId);
      if (teamData && typeof teamData === 'object' && 'accepted' in teamData) {
        setTeamMembers(teamData.accepted);
        setPendingRequests(teamData.pending);
      } else {
        setTeamMembers([]);
        setPendingRequests([]);
      }
    } catch (error: any) {
      console.error('Error fetching project details:', error);
      toast({
        title: 'Failed to load project',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToTeam = async () => {
    if (!user || !projectId) return;

    setIsApplying(true);
    try {
      await requestToJoinTeam(projectId, user.id);
      toast({
        title: 'Request sent',
        description: 'Your request to join the team has been sent.',
      });
      fetchData();
    } catch (error: any) {
      console.error('Error applying to team:', error);
      toast({
        title: 'Failed to send request',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRespondToRequest = async (memberId: string, action: 'accept' | 'reject') => {
    if (!projectId) return;

    setIsResponding(true);
    try {
      await respondToTeamRequest(projectId, memberId, action);
      toast({
        title: 'Request updated',
        description: `Team join request ${action === 'accept' ? 'accepted' : 'rejected'}.`,
      });
      fetchData();
    } catch (error: any) {
      console.error('Error responding to request:', error);
      toast({
        title: 'Failed to update request',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsResponding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return;

    setIsRemoving(true);
    try {
      await removeTeamMember(projectId, memberId);
      toast({
        title: 'Team member removed',
        description: 'The team member has been successfully removed from the project.',
      });
      fetchData();
    } catch (error: any) {
      console.error('Error removing team member:', error);
      toast({
        title: 'Failed to remove team member',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const isTeamHead = user && project && project.team_head_id === user.id;
  const isMember = user && teamMembers.some(member => member.user_id === user.id);
  const hasRequested = user && pendingRequests.some(req => req.user_id === user.id);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center text-lg">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center text-lg">Project not found.</div>;
  }

  return (
    <div className="container mx-auto mt-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/projects')}
          className="rounded-full h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold gold-gradient-text">{project.name}</h1>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5 text-gold" />
            Project Overview
          </CardTitle>
          <CardDescription>Details about this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="secondary">{project.current_status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created Date</p>
              <p>{formatDate(project.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </p>
              <p>{project.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Last Updated
              </p>
              <p>{formatDate(project.updated_at)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              {isTeamHead && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsDescriptionEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <p>{project.description || 'No description provided.'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            Team Members
          </CardTitle>
          <CardDescription>Current team and pending requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="team" className="space-y-4">
            <TabsList>
              <TabsTrigger value="team">Team</TabsTrigger>
              {isTeamHead && <TabsTrigger value="requests">Requests</TabsTrigger>}
            </TabsList>
            <TabsContent value="team" className="space-y-4">
              {teamMembers.length === 0 ? (
                <p>No team members yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="bg-card-gradient border-gold/10">
                      <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar_url || ""} alt={member.name || "Team Member"} />
                          <AvatarFallback>{member.name?.split(" ").map((n) => n[0]).join("") || "TM"}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-center">{member.name}</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                          {member.role || 'Member'}
                        </CardDescription>
                        {isTeamHead && member.user_id !== user?.id && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isRemoving}
                            onClick={() => handleRemoveMember(member.user_id)}
                          >
                            {isRemoving ? 'Removing...' : 'Remove'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            {isTeamHead && (
              <TabsContent value="requests">
                {pendingRequests.length === 0 ? (
                  <p>No pending requests.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} className="bg-card-gradient border-gold/10">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.avatar_url || ""} alt={request.name || "Applicant"} />
                              <AvatarFallback>{request.name?.split(" ").map((n) => n[0]).join("") || "AP"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{request.name}</CardTitle>
                              <CardDescription className="text-muted-foreground">
                                {request.role || 'Applicant'}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              disabled={isResponding}
                              onClick={() => handleRespondToRequest(request.user_id, 'accept')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={isResponding}
                              onClick={() => handleRespondToRequest(request.user_id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>

          {user && !isTeamHead && !isMember && !hasRequested && (
            <Button 
              className="w-full bg-gold hover:bg-gold/90 text-black"
              disabled={isApplying}
              onClick={handleApplyToTeam}
            >
              {isApplying ? 'Applying...' : 'Apply to Join'}
            </Button>
          )}

          {user && hasRequested && (
            <Alert className="w-full">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your request to join this project is pending approval.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Edit Description Dialog */}
      <Dialog open={isDescriptionEditOpen} onOpenChange={setIsDescriptionEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
            <DialogDescription>
              Update the project description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea 
                id="description" 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDescriptionEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
