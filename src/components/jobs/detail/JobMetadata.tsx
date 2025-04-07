
import { CalendarIcon, ClockIcon, DollarSign, MapPin } from "lucide-react";
import { Job } from "@/types/jobTypes";
import { formatDate, formatSalary } from "../utils/jobFormatters";

interface JobMetadataProps {
  job: Job;
}

const JobMetadata = ({ job }: JobMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <MapPin className="h-4 w-4 text-foreground/50" />
        <span>{job.location} • {job.location_type}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <DollarSign className="h-4 w-4 text-foreground/50" />
        <span>{formatSalary(job)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <ClockIcon className="h-4 w-4 text-foreground/50" />
        <span>Posted: {formatDate(job.created_at)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <CalendarIcon className="h-4 w-4 text-foreground/50" />
        <span>Deadline: {formatDate(job.application_deadline)}</span>
      </div>
    </div>
  );
};

export default JobMetadata;
