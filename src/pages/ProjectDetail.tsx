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
import { sendProjectMessage, subscribeToProjectChat } from '@/services/projectChatService';

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
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchData();
      fetchMilestones();
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const unsub = subscribeToProjectChat(projectId, setChatMessages);
    return () => unsub();
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
      setTeamMembers(teamData || []);
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
      const milestonesRef = collection(db, 'projects', projectId, 'milestones');
      const querySnapshot = await getDocs(milestonesRef);
      const milestoneList: any[] = [];
      querySnapshot.forEach((doc) => {
        milestoneList.push({ id: doc.id, ...doc.data() });
      });
      setMilestones(milestoneList);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const isTeamMember = !!user && !!project && (
    user.id === project.team_head_id ||
    teamMembers.some((m) => m.email === user.email)
  );

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user || !isTeamMember) return;
    await sendProjectMessage(projectId, {
      text: chatInput,
      senderId: user.id,
      senderName: user.name || user.email,
      senderAvatar: user.avatar || '',
    });
    setChatInput('');
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
      await addDoc(collection(db, 'projects', project.id, 'milestones'), {
        title: milestoneTitle,
        description: milestoneDesc,
        due_date: milestoneDate,
        status: 'pending',
        created_by: user.id,
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

  const handleStatusChange = async (milestoneId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId, 'milestones', milestoneId), {
        status: newStatus,
        updated_at: serverTimestamp(),
      });
      fetchMilestones();
      toast({ title: 'Milestone status updated', description: `Status set to ${newStatus}.` });
    } catch (error: any) {
      toast({ title: 'Failed to update status', description: error.message || 'Please try again later', variant: 'destructive' });
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
              <div
                className="min-h-[500px] max-h-[600px] overflow-y-auto flex flex-col gap-4 border-2 border-dashed border-border rounded-lg p-4 bg-background relative"
                ref={el => {
                  if (el) el.scrollTop = el.scrollHeight;
                }}
              >
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col justify-center items-center text-center flex-1">
                    <MessageSquare className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium text-muted-foreground">No messages yet. Start the conversation!</h3>
                    </div>
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isOwn = user && msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse self-end' : 'self-start'}`}
                        style={{ maxWidth: '100%' }}
                      >
                        <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold text-base overflow-hidden">
                          {msg.senderAvatar
                            ? <img src={msg.senderAvatar} alt={msg.senderName} className="h-10 w-10 rounded-full object-cover" />
                            : (msg.senderName?.[0]?.toUpperCase() || '?')}
                        </div>
                        <div className={`bg-gray-100 dark:bg-[#232323] rounded-xl px-4 py-2 min-w-[200px] w-auto max-w-[50%] ${isOwn ? 'text-right' : ''}`}> 
                          <div className="flex items-center gap-2 mb-1 whitespace-nowrap">
                            <span className="text-xs text-gray-400">{msg.createdAt?.toDate?.() ? msg.createdAt.toDate().toLocaleString() : ''}</span>
                            <span className="font-semibold text-xs text-gold">{msg.senderName}</span>
                          </div>
                          <div className="text-sm break-words whitespace-pre-line text-justify">{msg.text}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {isTeamMember ? (
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-gold hover:bg-gold/90 text-black">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="text-center text-muted-foreground text-sm">Only team members can send messages.</div>
              )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex flex-col justify-between p-5 rounded-xl border bg-white dark:bg-[#181818] shadow min-h-[140px] h-full">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center">
                          <Users className="h-7 w-7 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-lg truncate">{member.name || 'Team Member'}</p>
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-[#232323]">
                        <span className="text-xs font-medium text-muted-foreground truncate">{member.roleId || member.role || 'Member'}</span>
                        <span className={`inline-block px-3 py-1 rounded text-xs ml-2 ${member.status === 'accepted' ? 'bg-green-100 text-green-700' : member.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{member.status || 'unknown'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <AddTeamMemberDialog isOpen={showAddMember} onClose={() => setShowAddMember(false)} availableRoles={[]} projectId={project.id} projectName={project?.name || ''} onSuccess={fetchData} />
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
                    <div
                      key={milestone.id}
                      className="rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between transition-colors
                        bg-[#f7f7f7] text-gray-900 dark:bg-[#181818] dark:text-gold border border-transparent dark:border-[#232323]"
                    >
                      <div>
                        <div className="font-semibold text-lg text-gold">{milestone.title}</div>
                        <div className="text-[#b3b3b3] dark:text-gray-400">{milestone.description}</div>
                      </div>
                      <div className="flex flex-col md:items-end md:justify-between gap-2 mt-2 md:mt-0">
                        <div className="text-xs text-gray-500 dark:text-gray-300">{milestone.due_date}</div>
                        {milestone.created_by === user?.id ? (
                          <select
                            className="ml-2 rounded bg-white dark:bg-[#222] text-gold px-2 py-1 border border-gold"
                            value={milestone.status || 'pending'}
                            onChange={e => handleStatusChange(milestone.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          <span className="ml-2 text-xs px-2 py-1 rounded bg-gold/10 text-gold border border-gold">{milestone.status || 'pending'}</span>
                        )}
                      </div>
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
