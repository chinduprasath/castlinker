
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare,
  Users,
  Clock,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjectById } from '@/services/projectService';
import { fetchTeamMembers } from '@/services/teamMemberService';

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
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
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
          name: (projectData as any).name || '',
          description: (projectData as any).description || '',
          current_status: (projectData as any).current_status || '',
          location: (projectData as any).location || '',
          team_head_id: (projectData as any).team_head_id || '',
          created_at: projectData.created_at || '',
          updated_at: projectData.updated_at || ''
        } as Project;
        setProject(projectWithDefaults);
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
      } else {
        setTeamMembers([]);
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Here you would implement the actual message sending logic
    console.log('Sending message:', message);
    setMessage('');
  };

  if (isLoading) {
    return <div className="text-center text-lg">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center text-lg">Project not found.</div>;
  }

  return (
    <div className="container mx-auto mt-8 space-y-6 max-w-6xl">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/projects')}
          className="rounded-full h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold gold-gradient-text">{project.name}</h1>
          <Badge variant="secondary" className="mt-1">{project.current_status}</Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Milestones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold" />
                Project Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[400px] flex flex-col justify-center items-center text-center space-y-4 border-2 border-dashed border-border rounded-lg">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">No messages yet. Start the conversation!</h3>
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="bg-gold hover:bg-gold/90 text-black">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                Team Members
              </CardTitle>
              <CardDescription>
                {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="text-muted-foreground">No team members yet.</p>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name || 'Team Member'}</p>
                        <p className="text-sm text-muted-foreground">{member.role || 'Member'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Milestones
              </CardTitle>
              <CardDescription>Track project progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No milestones set for this project yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
