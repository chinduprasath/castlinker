
import { Badge } from "@/components/ui/badge";
import { Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobTypes";
import { formatDate } from "../utils/jobFormatters";

interface JobDetailHeaderProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onShare: () => void;
}

const JobDetailHeader = ({ job, isSaved, onToggleSave, onShare }: JobDetailHeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          {job.is_featured && (
            <Badge className="bg-gold/80 hover:bg-gold text-black border-none">
              Featured
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onShare}>
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
    </div>
  );
};

export default JobDetailHeader;
