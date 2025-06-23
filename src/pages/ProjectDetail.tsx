import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare,
  Users,
  Clock,
  Send,
  Edit,
  Trash2,
  UserPlus,
  Plus,
  Loader2
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddTeamMemberDialog from '@/components/admin/team/AddTeamMemberDialog';
import { createTeamMember } from '@/services/teamMemberService';
import { updateDoc, doc, collection, addDoc, serverTimestamp, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState('Planning');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [isMilestoneSubmitting, setIsMilestoneSubmitting] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchData();
      fetchMilestones();
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

  const fetchMilestones = async () => {
    if (!projectId) return;
    try {
      const milestonesRef = collection(db, 'project_milestones');
      const q = query(milestonesRef, where('project_id', '==', projectId));
      const querySnapshot = await getDocs(q);
      const milestoneList: any[] = [];
      querySnapshot.forEach((doc) => {
        milestoneList.push({ id: doc.id, ...doc.data() });
      });
      setMilestones(milestoneList);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Here you would implement the actual message sending logic
    console.log('Sending message:', message);
    setMessage('');
  };

  const openEditModal = () => {
    if (!project) return;
    setEditName(project.name);
    setEditDescription(project.description || '');
    setEditLocation(project.location || '');
    setEditStatus(project.current_status);
    setEditModalOpen(true);
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      setIsEditSubmitting(true);
      await updateDoc(doc(db, 'projects', project.id), {
        name: editName.trim(),
        description: editDescription.trim(),
        location: editLocation.trim(),
        current_status: editStatus,
        updated_at: serverTimestamp(),
      });
      toast({ title: 'Project updated', description: 'Project details updated.' });
      setEditModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Failed to update project', description: error.message || 'Please try again later', variant: 'destructive' });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      await deleteDoc(doc(db, 'projects', project.id));
      toast({ title: 'Project deleted', description: 'Project has been deleted.' });
      navigate('/projects');
    } catch (error: any) {
      toast({ title: 'Failed to delete project', description: error.message || 'Please try again later', variant: 'destructive' });
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      setIsMilestoneSubmitting(true);
      await addDoc(collection(db, 'project_milestones'), {
        project_id: project.id,
        title: milestoneTitle,
        description: milestoneDesc,
        due_date: milestoneDate,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      toast({ title: 'Milestone added', description: 'Milestone created.' });
      setShowAddMilestone(false);
      setMilestoneTitle('');
      setMilestoneDesc('');
      setMilestoneDate('');
      fetchMilestones();
    } catch (error: any) {
      toast({ title: 'Failed to add milestone', description: error.message || 'Please try again later', variant: 'destructive' });
    } finally {
      setIsMilestoneSubmitting(false);
    }
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
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-3xl font-bold gold-gradient-text">{project.name}</h1>
          <Badge variant="secondary" className="mt-1">{project.current_status}</Badge>
          {user && user.id === project.team_head_id && (
            <>
              <Button size="icon" variant="ghost" onClick={openEditModal} title="Edit Project">
                <Edit className="h-5 w-5 text-gold" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDeleteProject} title="Delete Project">
                <Trash2 className="h-5 w-5 text-red-400" />
              </Button>
            </>
          )}
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gold" />
                  Team Members
                </CardTitle>
                {user && user.id === project.team_head_id && (
                  <Button size="sm" className="gap-2 bg-gold text-black hover:bg-gold/90" onClick={() => setShowAddMember(true)}>
                    <UserPlus className="h-4 w-4" /> Add Team Member
                  </Button>
                )}
              </div>
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
          <AddTeamMemberDialog isOpen={showAddMember} onClose={() => setShowAddMember(false)} availableRoles={[]} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-gold/10 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  Milestones
                </CardTitle>
                {user && user.id === project.team_head_id && (
                  <Button size="sm" className="gap-2 bg-gold text-black hover:bg-gold/90" onClick={() => setShowAddMilestone(true)}>
                    <Plus className="h-4 w-4" /> Add Milestone
                  </Button>
                )}
              </div>
              <CardDescription>Track project progress</CardDescription>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <p className="text-muted-foreground">No milestones set for this project yet.</p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4 bg-[#181818]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-lg text-gold">{milestone.title}</div>
                        <div className="text-xs text-[#b3b3b3]">{milestone.due_date}</div>
                      </div>
                      <div className="text-[#b3b3b3]">{milestone.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Milestone</DialogTitle>
                <DialogDescription>Create a new milestone for this project.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMilestone} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="milestone-title">Title</Label>
                  <Input id="milestone-title" value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestone-desc">Description</Label>
                  <Input id="milestone-desc" value={milestoneDesc} onChange={e => setMilestoneDesc(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestone-date">Due Date</Label>
                  <Input id="milestone-date" type="date" value={milestoneDate} onChange={e => setMilestoneDate(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddMilestone(false)} disabled={isMilestoneSubmitting}>Cancel</Button>
                  <Button type="submit" disabled={isMilestoneSubmitting || !milestoneTitle.trim()} className="bg-gold hover:bg-gold/90 text-black gap-2">
                    {isMilestoneSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Add Milestone
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-gold" />
              Edit Project
            </DialogTitle>
            <DialogDescription>
              Update your project details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-project-name">Project Name <span className="text-red-500">*</span></Label>
              <Input
                id="edit-project-name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-description">Description</Label>
              <Input
                id="edit-project-description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Describe what this project is about"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-location" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </Label>
              <Input
                id="edit-project-location"
                value={editLocation}
                onChange={e => setEditLocation(e.target.value)}
                placeholder="e.g. Los Angeles, Remote, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-status">Current Status</Label>
              <select
                id="edit-project-status"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
              >
                <option value="Planning">Planning</option>
                <option value="Pre-production">Pre-production</option>
                <option value="Production">Production</option>
                <option value="Post-production">Post-production</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
                disabled={isEditSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isEditSubmitting || !editName.trim()}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                {isEditSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
