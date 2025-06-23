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
  MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects } from '@/services/projectService';
import { db } from '@/integrations/firebase/client';
import { collection, deleteDoc, doc } from 'firebase/firestore';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
        <Button asChild>
          <Link to="/project-create" className="bg-gold hover:bg-gold/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
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
            <Button asChild className="mt-4 bg-gold hover:bg-gold/90 text-black">
              <Link to="/project-create">Create Project</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <Card key={project.id} className="bg-card-gradient border-gold/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-gold" />
                  {project.name}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location || 'Unknown'}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Team Size: 3 / 10
                </div>
                <Badge variant="secondary">{project.current_status}</Badge>
              </CardContent>
              <div className="flex justify-between items-center p-4">
                <Button variant="link" asChild>
                  <Link to={`/projects/${project.id}`} className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/project-edit/${project.id}`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
