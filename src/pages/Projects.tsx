import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects, createProject } from '@/services/projectService';
import { db } from '@/integrations/firebase/client';
import { collection, deleteDoc, doc, addDoc } from 'firebase/firestore';

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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Planning');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState('Planning');

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching projects for user:', user.id);
        const projectsData = await fetchProjects(user.id);
        console.log('Fetched projects:', projectsData);
        setProjects(projectsData || []);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Failed to load projects',
          description: error.message || 'Please try again later',
          variant: 'destructive'
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user, toast]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to create a project',
        variant: 'destructive'
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Creating project with data:', { name, description, location, status });

      // Create the project
      const projectData = await createProject({
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        team_head_id: user.id,
        current_status: status
      });

      console.log('Project created:', projectData);

      // Add the creator as a member (automatically accepted)
      const projectMembersRef = collection(db, 'projectMembers');
      await addDoc(projectMembersRef, {
        project_id: projectData.id,
        user_id: user.id,
        status: 'accepted',
        joined_at: new Date()
      });

      toast({
        title: 'Project created',
        description: 'Your project has been created successfully',
      });

      // Reset form and close modal
      setName('');
      setDescription('');
      setLocation('');
      setStatus('Planning');
      setIsCreateModalOpen(false);

      // Refresh projects list
      const updatedProjects = await fetchProjects(user.id);
      setProjects(updatedProjects || []);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Failed to create project',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted',
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Failed to delete project',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || '');
    setEditLocation(project.location || '');
    setEditStatus(project.current_status);
    setEditModalOpen(true);
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !user) return;
    try {
      setIsSubmitting(true);
      // Update project in Firestore
      await updateProject(editingProject.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        location: editLocation.trim(),
        current_status: editStatus,
      });
      toast({
        title: 'Project updated',
        description: 'Project details have been updated.',
      });
      setEditModalOpen(false);
      setEditingProject(null);
      // Refresh projects list
      const updatedProjects = await fetchProjects(user.id);
      setProjects(updatedProjects || []);
    } catch (error: any) {
      toast({
        title: 'Failed to update project',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Please sign in to view your projects.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gold-gradient-text">My Projects</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold border-solid"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="bg-card-gradient border-gold/10 p-8 text-center">
          <div className="space-y-3">
            <Film className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-medium">
              {projects.length === 0 ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-foreground/70">
              {projects.length === 0 
                ? 'Get started by creating your first project.' 
                : 'Try adjusting your search criteria.'
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 bg-gold hover:bg-gold/90 text-black">
                Create Project
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card 
              key={project.id} 
              className="bg-[#181818] border border-[#3a2e13] rounded-xl shadow-none cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gold/30 text-white relative min-h-[180px]"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="p-5 pb-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xl font-bold leading-tight mb-1 text-white">
                        {project.name}
                      </div>
                      <div className="text-sm text-[#b3b3b3] mb-1">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#3a2e13] text-[#e2b93b] text-xs font-medium ml-2 select-none">
                        {project.current_status}
                      </span>
                    </div>
                  </div>
                  <div className="text-[#b3b3b3] text-base mb-6 min-h-[24px]">
                    {project.description || 'No description provided'}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#232323] mt-auto">
                  <div className="flex items-center gap-1 text-[#b3b3b3] text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    1
                  </div>
                  <div className="flex items-center gap-1 text-[#b3b3b3] text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    0 milestones
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Film className="h-5 w-5 text-gold" />
              Create New Project
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create your new project
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name <span className="text-red-500">*</span></Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this project is about"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-location" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </Label>
              <Input
                id="project-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Los Angeles, Remote, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-status">Current Status</Label>
              <select
                id="project-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
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
              <Textarea
                id="edit-project-description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Describe what this project is about"
                className="min-h-[100px]"
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !editName.trim()}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
