import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobTypes";
import { formatDate } from "../utils/jobFormatters";

interface JobDetailTabsProps {
  job: Job;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onApply: () => void;
}

const JobDetailTabs = ({ job, activeTab, setActiveTab, onApply }: JobDetailTabsProps) => {
  return (
    <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="bg-cinematic-dark/50 border border-gold/10">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="requirements">Requirements</TabsTrigger>
        <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
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
    </Tabs>
  );
};

export default JobDetailTabs;
