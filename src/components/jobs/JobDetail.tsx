import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Calendar, Clock, DollarSign, ExternalLink, Mail, MapPin, Share2 } from "lucide-react";
import { Job } from "@/hooks/useJobsData";

interface JobDetailProps {
  job: Job | null;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: () => void;
  trigger?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetail = ({ job, isSaved, onToggleSave, onApply, trigger, isOpen, onClose }: JobDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  if (!isOpen) {
    return null;
  }
  
  if (!job) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Job not found</DialogTitle>
          </DialogHeader>
          <p className="text-center py-8">Sorry, the job details could not be loaded.</p>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return "Not specified";
    
    const currency = job.salary_currency || "USD";
    const period = job.salary_period || "yearly";
    
    let formattedPeriod = "";
    switch (period) {
      case "hourly": formattedPeriod = "/hour"; break;
      case "daily": formattedPeriod = "/day"; break;
      case "weekly": formattedPeriod = "/week"; break;
      case "monthly": formattedPeriod = "/month"; break;
      case "yearly": formattedPeriod = "/year"; break;
      default: formattedPeriod = ""; // for flat rate
    }
    
    const currencySymbol = currency === "USD" ? "$" : 
                           currency === "EUR" ? "€" : 
                           currency === "GBP" ? "£" : 
                           currency === "INR" ? "₹" : currency;
    
    if (job.salary_min && job.salary_max) {
      return `${currencySymbol}${job.salary_min.toLocaleString()} - ${currencySymbol}${job.salary_max.toLocaleString()}${formattedPeriod}`;
    } else if (job.salary_min) {
      return `${currencySymbol}${job.salary_min.toLocaleString()}${formattedPeriod}+`;
    } else if (job.salary_max) {
      return `Up to ${currencySymbol}${job.salary_max.toLocaleString()}${formattedPeriod}`;
    }
    
    return "Not specified";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
              {job.is_featured && (
                <Badge className="bg-gold/80 hover:bg-gold text-black border-none">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={isSaved ? "text-gold" : ""}
                onClick={() => onToggleSave(job.id)}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-gold" : ""}`} />
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex items-center gap-1">
              <span className="font-medium">{job.company}</span>
              {job.is_verified && (
                <Badge variant="outline" className="ml-1 text-xs border-blue-500/30 text-blue-400">
                  Verified
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <MapPin className="h-4 w-4 text-foreground/50" />
              <span>{job.location} • {job.location_type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <DollarSign className="h-4 w-4 text-foreground/50" />
              <span>{formatSalary()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Clock className="h-4 w-4 text-foreground/50" />
              <span>Posted: {formatDate(job.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Calendar className="h-4 w-4 text-foreground/50" />
              <span>Deadline: {formatDate(job.application_deadline)}</span>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-cinematic-dark/50 border border-gold/10">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 text-foreground/80 leading-relaxed">
            <h3 className="text-lg font-medium mb-2">Job Description</h3>
            <p>{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-cinematic-dark/70 border border-gold/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="mt-4">
            <h3 className="text-lg font-medium mb-2">Requirements</h3>
            {job.requirements && job.requirements.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-foreground/80">{req}</li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60">No specific requirements listed.</p>
            )}
          </TabsContent>
          
          <TabsContent value="responsibilities" className="mt-4">
            <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="text-foreground/80">{resp}</li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60">No specific responsibilities listed.</p>
            )}
          </TabsContent>
          
          <TabsContent value="apply" className="mt-4">
            <h3 className="text-lg font-medium mb-4">Apply for This Position</h3>
            <div className="space-y-6">
              <div className="bg-cinematic-dark/30 p-4 rounded-lg border border-gold/10">
                <h4 className="font-medium mb-2">Application Options:</h4>
                <div className="space-y-3">
                  {job.application_url && (
                    <div>
                      <Button variant="outline" className="w-full border-gold/30">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply on External Website
                      </Button>
                    </div>
                  )}
                  {job.application_email && (
                    <div>
                      <Button variant="outline" className="w-full border-gold/30">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Your Application
                      </Button>
                    </div>
                  )}
                  <div>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic" onClick={onApply}>
                      Apply Through CastLinker
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-foreground/60">
                <p>This job will be accepting applications until {formatDate(job.application_deadline)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-gold/10">
          <Button
            variant="outline"
            className={`flex-1 ${isSaved ? "border-gold/30 text-gold" : "border-gold/10"}`}
            onClick={() => onToggleSave(job.id)}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-gold" : ""}`} />
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          <Button className="flex-1 bg-gold hover:bg-gold-dark text-cinematic" onClick={() => {
            setActiveTab("apply");
          }}>
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetail;
