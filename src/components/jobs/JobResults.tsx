
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Clock, ExternalLink, MapPin, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JobResults = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  
  const toggleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  const jobs = [
    {
      id: 1,
      title: "Lead Actor for Indie Drama Film",
      company: "Brooklyn Films",
      companyRating: 4.8,
      location: "New York, NY",
      locationType: "On-site",
      salary: "$5,000 - $10,000 flat rate",
      description: "Seeking a lead actor for an independent drama film exploring themes of identity and reconciliation. Character is a 30-40 year old returning to their hometown after years away.",
      requirements: ["5+ years acting experience", "Drama experience", "Availability for 4-week shoot"],
      tags: ["Feature Film", "Drama", "SAG-AFTRA"],
      postedDate: "2 days ago",
      applicationDeadline: "Dec 15, 2023",
      isHot: true,
      isPremium: true
    },
    {
      id: 2,
      title: "Director of Photography - Feature Film",
      company: "Cinematic Productions",
      companyRating: 4.6,
      location: "Los Angeles, CA",
      locationType: "On-site",
      salary: "$800 - $1,200/day",
      description: "Award-winning production company seeks experienced Director of Photography for upcoming feature film. Looking for someone with a distinctive visual style and ability to work within indie budget constraints.",
      requirements: ["7+ years experience as DP", "Feature film experience", "Proficient with Arri Alexa"],
      tags: ["Feature Film", "Horror", "Union"],
      postedDate: "1 week ago",
      applicationDeadline: "Dec 20, 2023",
      isHot: false,
      isPremium: true
    },
    {
      id: 3,
      title: "Voice Actor for Animated Series",
      company: "ToonWorks Studio",
      companyRating: 4.9,
      location: "Remote",
      locationType: "Remote",
      salary: "$300 - $500 per episode",
      description: "Casting voice actor for animated children's series. Looking for someone who can perform multiple character voices and work remotely.",
      requirements: ["Voice acting experience", "Home recording setup", "Ability to take direction"],
      tags: ["Animation", "Voice Over", "Series"],
      postedDate: "3 days ago",
      applicationDeadline: "Dec 10, 2023",
      isHot: true,
      isPremium: false
    },
    {
      id: 4,
      title: "Production Assistant - Netflix Series",
      company: "Global Media Productions",
      companyRating: 4.2,
      location: "Toronto, Canada",
      locationType: "On-site",
      salary: "$150 - $200/day",
      description: "Fast-paced production company seeking reliable Production Assistants for upcoming Netflix series. Great opportunity to gain experience and connections in the industry.",
      requirements: ["Previous PA experience preferred", "Valid driver's license", "Flexible schedule"],
      tags: ["TV Series", "Entry Level", "Long Term"],
      postedDate: "4 days ago",
      applicationDeadline: "Dec 8, 2023",
      isHot: false,
      isPremium: false
    },
    {
      id: 5,
      title: "Screenwriter for Feature Film",
      company: "Indie Film Collective",
      companyRating: 4.7,
      location: "Remote with occasional meetings in LA",
      locationType: "Hybrid",
      salary: "$15,000 - $25,000 flat rate",
      description: "Seeking experienced screenwriter to develop feature-length screenplay from existing treatment. Psychological thriller with supernatural elements.",
      requirements: ["Previous produced screenwriting credits", "Experience in thriller/horror genres", "Ability to meet deadlines"],
      tags: ["Feature Film", "Thriller", "WGA"],
      postedDate: "1 week ago",
      applicationDeadline: "Dec 30, 2023",
      isHot: false,
      isPremium: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">{jobs.length} Jobs Found</h2>
          <p className="text-sm text-foreground/60">Showing all available opportunities</p>
        </div>
        
        <Tabs defaultValue="relevance" className="w-full sm:w-auto mt-4 sm:mt-0">
          <TabsList className="bg-cinematic-dark/50 border border-gold/10">
            <TabsTrigger value="relevance">Most Relevant</TabsTrigger>
            <TabsTrigger value="recent">Most Recent</TabsTrigger>
            <TabsTrigger value="salary">Highest Pay</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className={`bg-card-gradient overflow-hidden transition-all hover:border-gold/30 ${job.isPremium ? 'border-gold/20' : 'border-gold/10'}`}>
            {job.isPremium && (
              <div className="bg-gold/20 text-gold text-xs py-1 px-4 text-center">
                Featured Opportunity
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        {job.isHot && (
                          <Badge className="bg-amber-500/80 hover:bg-amber-500 text-cinematic-dark border-none">
                            HOT
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-foreground/70">{job.company}</span>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-gold fill-gold" />
                          <span className="text-sm text-foreground/70 ml-1">{job.companyRating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm text-foreground/60">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                          <Badge variant="outline" className="ml-1 text-xs bg-cinematic-dark/30 border-gold/10">
                            {job.locationType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className="font-medium text-gold">{job.salary}</span>
                      </div>
                      
                      <p className="mt-3 text-foreground/80">{job.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-foreground/70 text-sm">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-5">
                        {job.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-cinematic-dark/70 text-foreground/80 text-xs rounded-full border border-gold/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-foreground/50 hover:text-gold ${savedJobs.includes(job.id) ? 'text-gold' : ''}`}
                      onClick={() => toggleSaveJob(job.id)}
                    >
                      <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-gold' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-gold/10">
                <p className="text-sm text-foreground/60">
                  Application Deadline: <span className="font-medium text-foreground/80">{job.applicationDeadline}</span>
                </p>
                
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobResults;
