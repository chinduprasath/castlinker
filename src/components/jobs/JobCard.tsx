
import { useState } from "react";
import { Bookmark, BookmarkCheck, Calendar, ChevronDown, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobTypes";
import { formatDate, formatSalary } from "./utils/jobFormatters";
import { useAuth } from "@/contexts/AuthContext";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onSaveClick: (jobId: string) => void;
  onViewDetailsClick: (job: Job) => void;
  onApplyClick: (job: Job) => void;
}

const JobCard = ({ 
  job, 
  isSaved, 
  onSaveClick, 
  onViewDetailsClick, 
  onApplyClick 
}: JobCardProps) => {
  const { user } = useAuth();
  const isFeatured = job.is_featured;
  const isRemote = job.location_type === 'Remote';
  
  return (
    <Card 
      className={`border-border/40 overflow-hidden transition-all hover:shadow-md hover:border-gold/20 cursor-pointer ${
        isFeatured ? 'border-l-4 border-l-gold' : ''
      }`}
      onClick={() => onViewDetailsClick(job)}
    >
      <CardContent className="p-0">
        {isFeatured && (
          <div className="bg-gold/10 py-1 px-4">
            <span className="text-gold text-xs font-medium">Featured Opportunity</span>
          </div>
        )}
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl">{job.title}</h3>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-gold"
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick(job.id);
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-gold" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm">
            {job.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
                {isRemote && <Badge variant="outline" className="ml-1">Remote</Badge>}
              </div>
            )}
            
            {job.created_at && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDate(job.created_at)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job)}</span>
            </div>
          </div>
          
          <p className="text-sm line-clamp-2">{job.description}</p>
          
          {job.requirements && job.requirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-muted text-foreground">{skill}</Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="secondary" className="bg-muted text-foreground">+{job.requirements.length - 3} more</Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-gold hover:bg-gold/5"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailsClick(job);
              }}
            >
              View Details
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            
            {user && (
              <Button 
                size="sm" 
                className="bg-gold hover:bg-gold/90 text-white dark:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyClick(job);
                }}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
