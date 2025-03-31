
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UpcomingAuditions = () => {
  const auditions = [
    {
      id: 1,
      title: "Television Commercial - Athletic Wear",
      company: "SportsFusion Media",
      type: "Virtual",
      date: "Nov 28, 2023",
      time: "3:00 PM PST",
      status: "Confirmed"
    },
    {
      id: 2,
      title: "Feature Film Casting Call",
      company: "Universal Studios",
      type: "In-person",
      location: "Studio 8, Hollywood",
      date: "Dec 2, 2023",
      time: "10:00 AM PST",
      status: "Preparation"
    }
  ];

  return (
    <Card className="bg-card-gradient border-gold/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming Auditions</CardTitle>
        <Button variant="link" className="text-gold p-0 h-auto">View all</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditions.map((audition) => (
            <div 
              key={audition.id} 
              className="p-4 rounded-lg bg-cinematic-dark/50 border border-gold/5 hover:border-gold/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{audition.title}</h3>
                  <p className="text-sm text-foreground/70 mt-1">{audition.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-foreground/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{audition.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{audition.time}</span>
                    </div>
                    
                    {audition.type === "Virtual" ? (
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        <span>Virtual Audition</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{audition.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Badge 
                  className={`
                    ${audition.status === "Confirmed" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"}
                    border
                  `}
                >
                  {audition.status}
                </Badge>
              </div>
              
              <div className="mt-4 flex gap-2">
                {audition.type === "Virtual" ? (
                  <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
                    Join Virtual Audition
                  </Button>
                ) : (
                  <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
                    Prepare Materials
                  </Button>
                )}
                <Button size="sm" variant="outline" className="border-gold/30 hover:border-gold">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAuditions;
