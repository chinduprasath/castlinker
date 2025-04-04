
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Job } from "@/hooks/useJobsData";

interface JobApplicationFormProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: { resume_url?: string; cover_letter?: string; additional_files?: string[] }) => Promise<boolean>;
}

const JobApplicationForm = ({ job, isOpen, onClose, onSubmit }: JobApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAdditionalFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    // Simple validation
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // In a real app, we would upload files to Supabase Storage first
    // For this demo, we'll just mock the file URLs
    const mockResumeUrl = "https://storage.example.com/resume-" + resume.name;
    const mockAdditionalUrls = additionalFiles.map(file => "https://storage.example.com/" + file.name);

    const result = await onSubmit({
      resume_url: mockResumeUrl,
      cover_letter: coverLetter,
      additional_files: mockAdditionalUrls.length > 0 ? mockAdditionalUrls : undefined,
    });

    setIsSubmitting(false);
    
    if (result) {
      // Reset form on success
      setCoverLetter("");
      setResume(null);
      setAdditionalFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Complete the application form below to apply for this position at {job.company}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resume Upload Section */}
          <div>
            <Label htmlFor="resume" className="block mb-2">Resume (Required)</Label>
            {resume ? (
              <div className="flex items-center gap-2 p-3 bg-cinematic-dark/30 rounded-md border border-gold/10">
                <FileText className="h-5 w-5 text-gold" />
                <span className="flex-1 truncate">{resume.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={() => setResume(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gold/30 rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gold/50 mb-2" />
                <p className="text-sm text-foreground/70 mb-2">
                  Upload your resume (PDF, DOC, DOCX)
                </p>
                <input
                  id="resume"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('resume')?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Cover Letter Section */}
          <div>
            <Label htmlFor="cover-letter" className="block mb-2">Cover Letter (Optional)</Label>
            <Textarea
              id="cover-letter"
              placeholder="Tell us why you're a great fit for this role..."
              className="min-h-32 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Additional Files Section */}
          <div>
            <Label htmlFor="additional-files" className="block mb-2">Additional Files (Optional)</Label>
            <div className="space-y-3">
              {additionalFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-cinematic-dark/30 rounded-md border border-gold/10">
                  <FileText className="h-5 w-5 text-foreground/60" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => removeAdditionalFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="border border-dashed border-gold/20 rounded-md p-4 text-center">
                <p className="text-sm text-foreground/70 mb-2">
                  Upload portfolio samples or other supporting documents
                </p>
                <input
                  id="additional-files"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleAdditionalFilesChange}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('additional-files')?.click()}
                >
                  Add Files
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-gold hover:bg-gold-dark text-cinematic" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
