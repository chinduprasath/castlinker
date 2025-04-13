import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Eye, FileText, Music, Plus, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfessionContent {
  id: string;
  title: string;
  content?: string;
  file_url?: string;
  description?: string;
  content_type: 'script' | 'audio';
  created_at: string;
}

const PortfolioSection = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [professionContent, setProfessionContent] = useState<ProfessionContent[]>([]);
  const [newScript, setNewScript] = useState({ title: '', content: '', description: '' });
  const [newAudio, setNewAudio] = useState({ title: '', file: null as File | null, description: '' });

  // Fetch profession-specific content
  const fetchProfessionContent = async () => {
    try {
      const { data, error } = await supabase
        .from('profession_content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionContent(data || []);
    } catch (error) {
      console.error('Error fetching profession content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle script submission
  const handleScriptSubmit = async () => {
    if (!newScript.title || !newScript.content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profession_content')
        .insert({
          user_id: user?.id,
          content_type: 'script',
          title: newScript.title,
          content: newScript.content,
          description: newScript.description,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Script uploaded successfully.',
      });
      setNewScript({ title: '', content: '', description: '' });
      fetchProfessionContent();
    } catch (error) {
      console.error('Error uploading script:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload script. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle audio file upload
  const handleAudioUpload = async () => {
    if (!newAudio.title || !newAudio.file) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and select an audio file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (newAudio.file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Audio file must be less than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file duration (client-side check)
    const audio = new Audio(URL.createObjectURL(newAudio.file));
    audio.addEventListener('loadedmetadata', async () => {
      if (audio.duration > 60) {
        toast({
          title: 'Duration Too Long',
          description: 'Audio file must be 1 minute or less.',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
      try {
        // Upload file to Supabase Storage
        const fileExt = newAudio.file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audio-uploads')
          .upload(fileName, newAudio.file);

        if (uploadError) throw uploadError;

        // Create database entry
        const { error: dbError } = await supabase
          .from('profession_content')
          .insert({
            user_id: user?.id,
            content_type: 'audio',
            title: newAudio.title,
            file_url: uploadData.path,
            description: newAudio.description,
            metadata: { duration: audio.duration, size: newAudio.file.size }
          });

        if (dbError) throw dbError;

        toast({
          title: 'Success',
          description: 'Audio file uploaded successfully.',
        });
        setNewAudio({ title: '', file: null, description: '' });
        fetchProfessionContent();
      } catch (error) {
        console.error('Error uploading audio:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload audio file. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    });
  };

  // In a real app, this data would come from API/context
  const portfolio = {
    showreels: [
      {
        id: 1,
        title: "2023 Drama Reel",
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fG1vdmllJTIwc2NlbmV8ZW58MHx8MHx8fDA%3D",
        duration: "2:45",
        views: 542
      },
      {
        id: 2,
        title: "Action Sequences",
        thumbnail: "https://images.unsplash.com/photo-1523207911345-32501502db22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW92aWUlMjBzY2VuZXxlbnwwfHwwfHx8MA%3D%3D",
        duration: "3:12",
        views: 328
      }
    ],
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1513438205128-16af16280739?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGFjdG9yfGVufDB8fDB8fHww", category: "Headshots" },
      { id: 2, url: "https://images.unsplash.com/photo-1567522274681-f8b46d7f8651?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWN0b3J8ZW58MHx8MHx8fDA%3D", category: "Character" },
      { id: 3, url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0b3J8ZW58MHx8MHx8fDA%3D", category: "Headshots" },
      { id: 4, url: "https://images.unsplash.com/photo-1607466442075-1daa41bc6196?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fGFjdG9yfGVufDB8fDB8fHww", category: "Behind the Scenes" }
    ],
    projects: [
      {
        id: 1,
        title: "The Last Journey",
        role: "Supporting Actor",
        director: "Christopher Stevens",
        year: 2022,
        imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWV8ZW58MHx8MHx8fDA%3D"
      },
      {
        id: 2,
        title: "City Lights",
        role: "Lead Actor",
        director: "Sarah Johnson",
        year: 2021,
        imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW92aWV8ZW58MHx8MHx8fDA%3D"
      },
      {
        id: 3,
        title: "Eternal Echo",
        role: "Supporting Actor",
        director: "Michael Rodriguez",
        year: 2020,
        imageUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW92aWV8ZW58MHx8MHx8fDA%3D"
      }
    ]
  };

  return (
    <Tabs defaultValue="showreels">
      <TabsList className="bg-cinematic-dark/50 border border-gold/10">
        <TabsTrigger value="showreels">Showreels</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        {profile?.role === 'writer' && (
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
        )}
        {profile?.role === 'musician' && (
          <TabsTrigger value="audio">Audio</TabsTrigger>
        )}
      </TabsList>
      
      {/* Showreels Tab */}
      <TabsContent value="showreels" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.showreels.map((reel) => (
            <Card key={reel.id} className="bg-card-gradient border-gold/10 overflow-hidden">
              <div className="relative">
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-cinematic-dark/40 flex items-center justify-center">
                  <button className="bg-gold/90 hover:bg-gold text-cinematic-dark rounded-full p-3 transition-all transform hover:scale-110">
                    <Play className="h-8 w-8 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-cinematic-dark/70 text-foreground/80 text-xs px-2 py-1 rounded">
                  {reel.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{reel.title}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-foreground/60">
                  <Eye className="h-3 w-3" />
                  <span>{reel.views} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      {/* Photos Tab */}
      <TabsContent value="photos" className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolio.photos.map((photo) => (
            <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-gold/10">
              <img 
                src={photo.url} 
                alt={`Portfolio photo ${photo.id}`} 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cinematic-dark to-transparent px-3 py-2">
                <span className="text-xs text-foreground/80">{photo.category}</span>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      {/* Projects Tab */}
      <TabsContent value="projects" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.projects.map((project) => (
            <Card key={project.id} className="bg-card-gradient border-gold/10 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-foreground/70 text-sm mt-1">{project.role}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-foreground/60">
                  <span>Dir: {project.director}</span>
                  <span>{project.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Scripts Tab */}
      {profile?.role === 'writer' && (
        <TabsContent value="scripts" className="pt-6">
          <Card className="bg-card-gradient border-gold/10 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Script</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="script-title">Title</Label>
                  <Input
                    id="script-title"
                    value={newScript.title}
                    onChange={(e) => setNewScript(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter script title"
                  />
                </div>
                <div>
                  <Label htmlFor="script-content">Content</Label>
                  <Textarea
                    id="script-content"
                    value={newScript.content}
                    onChange={(e) => setNewScript(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Paste your script here"
                    className="min-h-[200px]"
                  />
                </div>
                <div>
                  <Label htmlFor="script-description">Description (Optional)</Label>
                  <Input
                    id="script-description"
                    value={newScript.description}
                    onChange={(e) => setNewScript(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a brief description"
                  />
                </div>
                <Button 
                  onClick={handleScriptSubmit} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Script
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionContent
              .filter(content => content.content_type === 'script')
              .map((script) => (
                <Card key={script.id} className="bg-card-gradient border-gold/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{script.title}</h3>
                        {script.description && (
                          <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
                        )}
                      </div>
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(script.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      )}

      {/* Audio Tab */}
      {profile?.role === 'musician' && (
        <TabsContent value="audio" className="pt-6">
          <Card className="bg-card-gradient border-gold/10 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload New Audio</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audio-title">Title</Label>
                  <Input
                    id="audio-title"
                    value={newAudio.title}
                    onChange={(e) => setNewAudio(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter audio title"
                  />
                </div>
                <div>
                  <Label htmlFor="audio-file">Audio File (Max 1 minute, MP3 or WAV)</Label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept=".mp3,.wav"
                    onChange={(e) => setNewAudio(prev => ({ 
                      ...prev, 
                      file: e.target.files?.[0] || null 
                    }))}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="audio-description">Description (Optional)</Label>
                  <Input
                    id="audio-description"
                    value={newAudio.description}
                    onChange={(e) => setNewAudio(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a brief description"
                  />
                </div>
                <Button 
                  onClick={handleAudioUpload} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Audio
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionContent
              .filter(content => content.content_type === 'audio')
              .map((audio) => (
                <Card key={audio.id} className="bg-card-gradient border-gold/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{audio.title}</h3>
                        {audio.description && (
                          <p className="text-sm text-muted-foreground mt-1">{audio.description}</p>
                        )}
                      </div>
                      <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {audio.file_url && (
                      <div className="mt-4">
                        <audio controls className="w-full">
                          <source src={`${supabase.storage.from('audio-uploads').getPublicUrl(audio.file_url).data.publicUrl}`} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(audio.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default PortfolioSection;
