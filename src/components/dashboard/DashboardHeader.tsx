
import { Button } from "@/components/ui/button";
import { Bell, Edit, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
  // In a real app, this would come from auth context
  const user = {
    name: "Sarah Johnson",
    role: "Actor",
    avatar: "/placeholder.svg",
    isVerified: true,
    profileCompleteness: 85,
  };

  return (
    <div className="rounded-xl bg-card-gradient border border-gold/10 p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-24 w-24 border-2 border-gold/30">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-cinematic-light text-xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.isVerified && (
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
          </div>
          <p className="text-foreground/70 mt-1">{user.role}</p>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-cinematic-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold-light to-gold" 
                  style={{ width: `${user.profileCompleteness}%` }}
                ></div>
              </div>
              <span className="text-xs text-foreground/70">
                {user.profileCompleteness}% Complete
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
