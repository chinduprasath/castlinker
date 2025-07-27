import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Bookmark, ChevronDown } from "lucide-react";
import { Job } from "@/hooks/useJobsData";
import { formatDate, formatSalary } from "./utils/jobFormatters";

interface SavedJobCardProps {
  job: Job;
  onRemove: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
}

const SavedJobCard = ({ job, onRemove, onViewDetails, onApply }: SavedJobCardProps) => {
  return (
    <Card className="bg-card-gradient border-gold/10 transition-colors hover:border-gold/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
            <p className="text-foreground/70 text-sm mt-1">{job.company}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(job.id)}
            className="text-gold hover:text-gold/70"
          >
            <Bookmark className="h-5 w-5 fill-gold" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div>
            <Badge variant="outline" className="text-xs">
              {job.job_type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(job.created_at)}</span>
          </div>
          <div className="text-sm font-medium">
            {formatSalary(job)}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-foreground/70 text-sm line-clamp-2">
            {job.description || 'No description available'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gold/20 hover:border-gold/30"
            onClick={() => onViewDetails(job)}
          >
            View Details
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button
            className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium"
            onClick={() => onApply(job)}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedJobCard;