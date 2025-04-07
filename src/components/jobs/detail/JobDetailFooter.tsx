
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface JobDetailFooterProps {
  jobId: string;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApplyTab: () => void;
}

const JobDetailFooter = ({ jobId, isSaved, onToggleSave, onApplyTab }: JobDetailFooterProps) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-gold/10">
      <Button
        variant="outline"
        className={`flex-1 ${isSaved ? "border-gold/30 text-gold" : "border-gold/10"}`}
        onClick={() => onToggleSave(jobId)}
      >
        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-gold" : ""}`} />
        {isSaved ? "Saved" : "Save Job"}
      </Button>
      <Button className="flex-1 bg-gold hover:bg-gold-dark text-cinematic" onClick={onApplyTab}>
        Apply Now
      </Button>
    </div>
  );
};

export default JobDetailFooter;
