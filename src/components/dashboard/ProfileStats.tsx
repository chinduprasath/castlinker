
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Star, ThumbsUp, UserPlus } from "lucide-react";

const ProfileStats = () => {
  const stats = [
    { 
      label: "Profile Views", 
      value: 2845, 
      change: "+12%", 
      positive: true,
      icon: Eye 
    },
    { 
      label: "Connection Requests", 
      value: 28, 
      change: "+5", 
      positive: true,
      icon: UserPlus 
    },
    { 
      label: "Endorsements", 
      value: 142, 
      change: "+3", 
      positive: true,
      icon: ThumbsUp 
    },
    { 
      label: "Rating", 
      value: "4.8", 
      change: "+0.2", 
      positive: true,
      icon: Star 
    }
  ];

  return (
    <Card className="bg-card-gradient border-gold/10">
      <CardHeader>
        <CardTitle className="text-lg">Profile Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-cinematic-dark/50 border border-gold/5">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-gold" />
                <span className="text-xs text-foreground/60">{stat.label}</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-xl font-semibold">{stat.value}</span>
                <span className={`text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
