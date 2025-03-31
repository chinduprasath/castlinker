
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Eye } from "lucide-react";

const PortfolioSection = () => {
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
    </Tabs>
  );
};

export default PortfolioSection;
