
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RecentConnections = () => {
  const connections = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "Director",
      avatar: "/placeholder.svg",
      isOnline: true,
      connectionDate: "Connected 2 days ago"
    },
    {
      id: 2,
      name: "Emma Wilson",
      role: "Casting Director",
      avatar: "/placeholder.svg",
      isOnline: false,
      connectionDate: "Connected 1 week ago"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Producer",
      avatar: "/placeholder.svg",
      isOnline: true,
      connectionDate: "Connected today"
    }
  ];

  return (
    <Card className="bg-card-gradient border-gold/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Connections</CardTitle>
        <Button variant="link" className="text-gold p-0 h-auto">View all</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => (
            <div 
              key={connection.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-cinematic-dark/50 border border-gold/5 hover:border-gold/20 transition-all"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={connection.avatar} alt={connection.name} />
                  <AvatarFallback className="bg-cinematic-light">
                    {connection.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {connection.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{connection.name}</h4>
                <p className="text-xs text-foreground/60">{connection.role}</p>
                <p className="text-xs text-foreground/40 mt-1">{connection.connectionDate}</p>
              </div>
              
              <Button size="sm" variant="ghost" className="text-foreground/70 hover:text-gold">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentConnections;
