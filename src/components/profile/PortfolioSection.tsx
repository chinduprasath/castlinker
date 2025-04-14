
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, FileText, Image, Film, Pencil, Trash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Define the types needed for this component
interface ProfessionContent {
  id: string;
  title: string;
  content_type: 'document' | 'image' | 'video';
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
    }
  ];
  
  // Load content
  useEffect(() => {
    if (!user) return;
    
    // For development, just use mock data
    setContents(mockContents);
    
    // In a real implementation, we would fetch from Supabase
    // This is commented out since it won't work without the proper tables
    /*
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolio_content')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (data) {
          setContents(data as ProfessionContent[]);
        }
      } catch (error) {
        console.error('Error loading portfolio content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
    */
  }, [user]);
  
  // Add new content
  const handleAddContent = async (contentType: 'document' | 'image' | 'video') => {
    if (!user) return;
    
    // Mocked functionality
    const newContent: ProfessionContent = {
      id: Date.now().toString(),
      title: `New ${contentType} content`,
      content_type: contentType,
      file_url: contentType === 'image' ? 'https://i.pravatar.cc/300' : undefined,
      thumbnail_url: contentType === 'image' || contentType === 'video' ? 'https://i.pravatar.cc/300' : undefined,
      description: `Description for new ${contentType}`,
      created_at: new Date().toISOString()
    };
    
    setContents([newContent, ...contents]);
    
    // In a real implementation, we would save to Supabase
    /*
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .insert({
          user_id: user.id,
          title: `New ${contentType} content`,
          content_type: contentType,
          description: `Description for new ${contentType}`
        })
        .select();
        
      if (data) {
        setContents([data[0], ...contents]);
      }
    } catch (error) {
      console.error('Error adding portfolio content:', error);
    }
    */
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
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
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
