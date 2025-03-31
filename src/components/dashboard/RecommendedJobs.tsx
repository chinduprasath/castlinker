
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RecommendedJobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Supporting Actor for Netflix Series",
      company: "Netflix Productions",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$500-$800/day",
      rating: 4.8,
      tags: ["Action", "Drama", "Supporting Role"],
      postedDate: "2 days ago",
      deadline: "Nov 30, 2023",
      matchPercentage: 92
    },
    {
      id: 2,
      title: "Voice Actor for Animated Film",
      company: "Pixar Animation",
      location: "Remote",
      type: "Contract",
      salary: "$2,000-$5,000",
      rating: 4.9,
      tags: ["Animation", "Voice Acting"],
      postedDate: "1 week ago",
      deadline: "Dec 15, 2023",
      matchPercentage: 88
    },
    {
      id: 3,
      title: "Lead Actor for Independent Film",
      company: "Sundance Productions",
      location: "New York, NY",
      type: "Project",
      salary: "$5,000-$10,000",
      rating: 4.5,
      tags: ["Drama", "Lead Role", "Indie"],
      postedDate: "3 days ago",
      deadline: "Dec 5, 2023",
      matchPercentage: 85
    }
  ];

  return (
    <Card className="bg-card-gradient border-gold/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recommended Jobs</CardTitle>
        <Button variant="link" className="text-gold p-0 h-auto">View all</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="p-4 rounded-lg bg-cinematic-dark/50 border border-gold/5 hover:border-gold/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20 text-xs">
                      {job.matchPercentage}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">{job.company}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-foreground/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gold" />
                      <span>{job.rating}</span>
                    </div>
                    <span>{job.type}</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 bg-cinematic-light rounded-full text-xs text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-gold">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-4 text-xs text-foreground/60">
                <span>Posted {job.postedDate}</span>
                <span>Deadline: {job.deadline}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic w-full sm:w-auto">
                  Apply Now
                </Button>
                <Button size="sm" variant="outline" className="border-gold/30 hover:border-gold w-full sm:w-auto">
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

export default RecommendedJobs;
