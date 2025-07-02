import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

interface JobCreateFormProps {
  onJobCreated?: () => void;
  initialValues?: Partial<any>;
  onUpdate?: (jobId: string, jobData: any) => Promise<void>;
}

const ROLE_CATEGORIES = [
  "Actor",
  "Director",
  "Producer",
  "Screenwriter",
  "Cinematographer",
  "Casting Director",
  "Agent",
  "Production Company",
  "Editor",
  "Sound Designer",
  "Production Designer",
  "Costume Designer",
  "Makeup Artist",
  "Stunt Coordinator",
  "Visual Effects Artist",
  "Music Composer",
  "Art Director",
  "Location Manager",
  "other"
];

const JobCreateForm = ({ onJobCreated, initialValues, onUpdate }: JobCreateFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [company, setCompany] = useState(initialValues?.company || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [requirements, setRequirements] = useState(initialValues?.requirements ? Array.isArray(initialValues.requirements) ? initialValues.requirements.join('\n') : initialValues.requirements : "");
  const [responsibilities, setResponsibilities] = useState(initialValues?.responsibilities ? Array.isArray(initialValues.responsibilities) ? initialValues.responsibilities.join('\n') : initialValues.responsibilities : "");
  const [jobType, setJobType] = useState(initialValues?.job_type || "");
  const [roleCategory, setRoleCategory] = useState(initialValues?.role_category || "");
  const [experienceLevel, setExperienceLevel] = useState(initialValues?.experience_level || "");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [locationType, setLocationType] = useState(initialValues?.location_type || "");
  const [salaryMin, setSalaryMin] = useState(initialValues?.salary_min ? String(initialValues.salary_min) : "");
  const [salaryMax, setSalaryMax] = useState(initialValues?.salary_max ? String(initialValues.salary_max) : "");
  const [salaryCurrency, setSalaryCurrency] = useState(initialValues?.salary_currency || "INR");
  const [salaryPeriod, setSalaryPeriod] = useState(initialValues?.salary_period || "yearly");
  const [applicationDeadline, setApplicationDeadline] = useState(initialValues?.application_deadline ? (typeof initialValues.application_deadline === 'string' ? initialValues.application_deadline : (initialValues.application_deadline?.seconds ? new Date(initialValues.application_deadline.seconds * 1000).toISOString().slice(0,10) : '')) : "");
  const [experience, setExperience] = useState(initialValues?.experience || "");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setCompany(initialValues.company || "");
      setDescription(initialValues.description || "");
      setRequirements(initialValues.requirements ? Array.isArray(initialValues.requirements) ? initialValues.requirements.join('\n') : initialValues.requirements : "");
      setResponsibilities(initialValues.responsibilities ? Array.isArray(initialValues.responsibilities) ? initialValues.responsibilities.join('\n') : initialValues.responsibilities : "");
      setJobType(initialValues.job_type || "");
      setRoleCategory(initialValues.role_category || "");
      setExperienceLevel(initialValues.experience_level || "");
      setLocation(initialValues.location || "");
      setLocationType(initialValues.location_type || "");
      setSalaryMin(initialValues.salary_min ? String(initialValues.salary_min) : "");
      setSalaryMax(initialValues.salary_max ? String(initialValues.salary_max) : "");
      setSalaryCurrency(initialValues.salary_currency || "INR");
      setSalaryPeriod(initialValues.salary_period || "yearly");
      setApplicationDeadline(initialValues.application_deadline ? (typeof initialValues.application_deadline === 'string' ? initialValues.application_deadline : (initialValues.application_deadline?.seconds ? new Date(initialValues.application_deadline.seconds * 1000).toISOString().slice(0,10) : '')) : "");
      setExperience(initialValues.experience || "");
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a job posting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const jobData = {
        title,
        company,
        description,
        requirements: requirements.split('\n').filter(req => req.trim()),
        responsibilities: responsibilities.split('\n').filter(resp => resp.trim()),
        job_type: jobType,
        role_category: roleCategory,
        experience_level: experienceLevel,
        location,
        location_type: locationType,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_currency: salaryCurrency,
        salary_period: salaryPeriod,
        application_deadline: applicationDeadline || null,
        experience,
        status: 'active',
        is_featured: false,
        created_at: initialValues?.created_at || serverTimestamp(),
        created_by: user.id,
      };

      if (initialValues && initialValues.id && onUpdate) {
        await onUpdate(initialValues.id, jobData);
        return;
      }

      await addDoc(collection(db, 'film_jobs'), jobData);

      toast({
        title: "Job posted successfully!",
        description: "Your job posting has been created and is now live.",
      });

      // Reset form
      setTitle("");
      setCompany("");
      setDescription("");
      setRequirements("");
      setResponsibilities("");
      setJobType("");
      setRoleCategory("");
      setExperienceLevel("");
      setLocation("");
      setLocationType("");
      setSalaryMin("");
      setSalaryMax("");
      setSalaryCurrency("INR");
      setSalaryPeriod("yearly");
      setApplicationDeadline("");
      setExperience("");

      // Call callback to close dialog and refresh jobs
      onJobCreated?.();
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast({
        title: "Error creating job",
        description: error.message || "There was an error creating your job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialValues ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
        <DialogDescription>
          {initialValues ? 'Edit your job opportunity details' : 'Post a new job opportunity for the film industry community'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={3}
            placeholder="One per line"
          />
          <span className="text-xs text-muted-foreground">One per line</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsibilities">Responsibilities</Label>
          <Textarea
            id="responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={3}
            placeholder="One per line"
          />
          <span className="text-xs text-muted-foreground">One per line</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleCategory">Role Category</Label>
            <Select value={roleCategory} onValueChange={setRoleCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select role category" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_CATEGORIES.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Min Salary (INR)</Label>
            <Input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Max Salary (INR)</Label>
            <Input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={salaryPeriod} onValueChange={setSalaryPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDeadline">Application Deadline</Label>
          <Input
            id="applicationDeadline"
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            placeholder="mm/dd/yyyy"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Job' : 'Create Job Posting'}
        </Button>
      </form>
    </>
  );
};

export default JobCreateForm;
