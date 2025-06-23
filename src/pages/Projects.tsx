
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Planning');

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          toast({
            title: 'Not authenticated',
            description: 'Please sign in to view your projects',
            variant: 'destructive'
          });
          return;
        }
        const projectsData = await fetchProjects(user.id);
        setProjects(projectsData);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Failed to load projects',
          description: error.message || 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

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

    if (!name) {
      toast({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Insert the project
      const projectData = await createProject({
        name,
        description,
        location,
        team_head_id: user.id,
        current_status: status
      });

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
      const projectsData = await fetchProjects(user.id);
      setProjects(projectsData);
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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <CardContent>
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
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold border-solid"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="bg-card-gradient border-gold/10 p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-medium">No projects yet</h3>
            <p className="text-foreground/70">Get started by creating your first project.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 bg-gold hover:bg-gold/90 text-black">
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <Card key={project.id} className="bg-card-gradient border-gold/10 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/projects/${project.id}`)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">{project.current_status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>1</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>0 milestones</span>
                </div>
              </CardContent>
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
                disabled={isSubmitting || !name}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
