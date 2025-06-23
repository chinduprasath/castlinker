import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, FileText, Image, Film, Pencil, Trash, Music, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db, storage } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

// Define the types needed for this component
interface ProfessionContent {
  id: string;
  title: string;
  content_type: 'document' | 'image' | 'video' | 'audio';
  file_url?: string;
  thumbnail_url?: string;
  description?: string;
  created_at: string;
}

export function PortfolioSection() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<ProfessionContent[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Mock data for development
  const mockContents = [
    {
      id: '1',
      title: 'Acting Resume',
      content_type: 'document' as const,
      file_url: '/placeholder.pdf',
      description: 'My professional acting resume',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Headshot 2023',
      content_type: 'image' as const,
      file_url: 'https://i.pravatar.cc/300',
      thumbnail_url: 'https://i.pravatar.cc/300',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Acting Reel',
      content_type: 'video' as const,
      file_url: '/placeholder.mp4',
      thumbnail_url: 'https://i.pravatar.cc/300',
      description: 'Compilation of my recent performances',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Voice Sample',
      content_type: 'audio' as const,
      file_url: '/placeholder.mp3',
      description: 'My voice acting demo',
      created_at: new Date().toISOString()
    }
  ];
  
  // Load content
  useEffect(() => {
    if (!user) return;
    
    // For development, just use mock data
    setContents(mockContents);
    
    // Real implementation would use Firebase
    /* 
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // This would be the real implementation when the database is ready
        const q = query(collection(db, 'portfolio_content'), where('user_id', '==', user.id), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContents(items as ProfessionContent[]);
      } catch (error) {
        console.error('Error loading portfolio content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
    */
  }, [user]);
  
  // Validate audio file duration
  const validateAudioDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        // Check if audio is longer than 1 minute (60 seconds)
        if (audio.duration > 60) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      audio.src = URL.createObjectURL(file);
    });
  };
  
  // Handle file upload for audio
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, contentType: 'document' | 'image' | 'video' | 'audio') => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type based on contentType
    if (contentType === 'audio') {
      if (!file.type.includes('audio/')) {
        toast.error('Please upload a valid audio file');
        return;
      }
      
      // Check audio duration
      const isValidDuration = await validateAudioDuration(file);
      if (!isValidDuration) {
        toast.error('Audio files must be less than 1 minute long');
        return;
      }
    }
    
    // For now just add a mock entry, in a real app you would upload the file
    const newContent: ProfessionContent = {
      id: Date.now().toString(),
      title: file.name.split('.').slice(0, -1).join('.'),
      content_type: contentType,
      file_url: contentType === 'image' ? URL.createObjectURL(file) : undefined,
      thumbnail_url: contentType === 'image' ? URL.createObjectURL(file) : 
                    contentType === 'audio' ? '/lovable-uploads/73e4c862-e58e-4dab-a81c-4963b67ab461.png' : undefined,
      description: `New ${contentType} upload`,
      created_at: new Date().toISOString()
    };
    
    setContents([newContent, ...contents]);
    toast.success(`${contentType} uploaded successfully`);
  };
  
  // Add new content
  const handleAddContent = async (contentType: 'document' | 'image' | 'video' | 'audio') => {
    if (!user) return;
    
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    
    // Set accepted file types based on content type
    switch (contentType) {
      case 'document':
        fileInput.accept = '.pdf,.doc,.docx,.txt';
        break;
      case 'image':
        fileInput.accept = 'image/*';
        break;
      case 'video':
        fileInput.accept = 'video/*';
        break;
      case 'audio':
        fileInput.accept = 'audio/*';
        break;
    }
    
    // Add event listener for file selection
    fileInput.addEventListener('change', (e) => handleFileUpload(e as any, contentType));
    
    // Trigger file selection dialog
    fileInput.click();
  };
  
  // Filter content based on active tab
  const filteredContents = activeTab === 'all' 
    ? contents 
    : contents.filter(content => content.content_type === activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Portfolio</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddContent('document')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Add Document
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddContent('image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddContent('video')}
          >
            <Film className="h-4 w-4 mr-2" />
            Add Video
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddContent('audio')}
          >
            <Music className="h-4 w-4 mr-2" />
            Add Audio
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg border-muted">
              <PlusCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab + ' ' : ''}content yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handleAddContent(activeTab === 'all' ? 'document' : activeTab as any)}
              >
                Add {activeTab === 'all' ? 'Content' : activeTab}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map(content => (
                <Card key={content.id} className="overflow-hidden">
                  {content.content_type === 'image' && content.thumbnail_url && (
                    <div className="relative h-40 w-full">
                      <img 
                        src={content.thumbnail_url} 
                        alt={content.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {content.content_type === 'video' && content.thumbnail_url && (
                    <div className="relative h-40 w-full bg-black">
                      <img 
                        src={content.thumbnail_url} 
                        alt={content.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                          <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-black ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {content.content_type === 'document' && (
                    <div className="h-40 w-full bg-muted flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {content.content_type === 'audio' && (
                    <div className="h-40 w-full bg-muted flex flex-col items-center justify-center p-4">
                      <Music className="h-10 w-10 text-muted-foreground mb-2" />
                      {content.file_url && (
                        <audio 
                          ref={audioRef}
                          src={content.file_url} 
                          controls 
                          className="w-full max-w-[200px]"
                          preload="metadata"
                        />
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{content.title}</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {content.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{content.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Also export as default for backward compatibility
export default PortfolioSection;
