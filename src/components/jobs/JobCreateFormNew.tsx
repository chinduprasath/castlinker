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
import { Loader2, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface JobCreateFormNewProps {
  onJobCreated?: () => void;
  initialValues?: Partial<any>;
  onUpdate?: (jobId: string, jobData: any) => Promise<void>;
}

const ROLE_CATEGORIES = [
  "Acting",
  "Directing", 
  "Producing",
  "Writing",
  "Cinematography",
  "Casting",
  "Agent",
  "Production Company",
  "Editing",
  "Sound Design",
  "Production Design",
  "Costume Design",
  "Makeup",
  "Stunts",
  "Visual Effects",
  "Music",
  "Art Direction",
  "Location Management",
  "Other"
];

const JobCreateFormNew = ({ onJobCreated, initialValues, onUpdate }: JobCreateFormNewProps) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [company, setCompany] = useState(initialValues?.company || "");
  const [companyLogoUrl, setCompanyLogoUrl] = useState(initialValues?.company_logo_url || "");
  const [jobType, setJobType] = useState(initialValues?.job_type || "");
  const [roleCategory, setRoleCategory] = useState(initialValues?.role_category || "");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [locationType, setLocationType] = useState(initialValues?.location_type || "");
  const [salaryMin, setSalaryMin] = useState(initialValues?.salary_min ? String(initialValues.salary_min) : "");
  const [salaryMax, setSalaryMax] = useState(initialValues?.salary_max ? String(initialValues.salary_max) : "");
  const [salaryCurrency, setSalaryCurrency] = useState(initialValues?.salary_currency || "INR");
  const [salaryPeriod, setSalaryPeriod] = useState(initialValues?.salary_period || "Yearly");
  const [applicationDeadline, setApplicationDeadline] = useState(initialValues?.application_deadline ? (typeof initialValues.application_deadline === 'string' ? initialValues.application_deadline : (initialValues.application_deadline?.seconds ? new Date(initialValues.application_deadline.seconds * 1000).toISOString().slice(0,10) : '')) : "");
  const [experienceLevel, setExperienceLevel] = useState(initialValues?.experience_level || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [requirements, setRequirements] = useState<string[]>(initialValues?.requirements || []);
  const [responsibilities, setResponsibilities] = useState<string[]>(initialValues?.responsibilities || []);
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [applicationUrl, setApplicationUrl] = useState(initialValues?.application_url || "");
  const [applicationEmail, setApplicationEmail] = useState(initialValues?.application_email || "");
  const [isFeatured, setIsFeatured] = useState(initialValues?.is_featured || false);
  const [isLoading, setIsLoading] = useState(false);

  // Input field states for adding items
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newTag, setNewTag] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setCompany(initialValues.company || "");
      setCompanyLogoUrl(initialValues.company_logo_url || "");
      setJobType(initialValues.job_type || "");
      setRoleCategory(initialValues.role_category || "");
      setLocation(initialValues.location || "");
      setLocationType(initialValues.location_type || "");
      setSalaryMin(initialValues.salary_min ? String(initialValues.salary_min) : "");
      setSalaryMax(initialValues.salary_max ? String(initialValues.salary_max) : "");
      setSalaryCurrency(initialValues.salary_currency || "INR");
      setSalaryPeriod(initialValues.salary_period || "Yearly");
      setApplicationDeadline(initialValues.application_deadline ? (typeof initialValues.application_deadline === 'string' ? initialValues.application_deadline : (initialValues.application_deadline?.seconds ? new Date(initialValues.application_deadline.seconds * 1000).toISOString().slice(0,10) : '')) : "");
      setExperienceLevel(initialValues.experience_level || "");
      setDescription(initialValues.description || "");
      setRequirements(initialValues.requirements || []);
      setResponsibilities(initialValues.responsibilities || []);
      setTags(initialValues.tags || []);
      setApplicationUrl(initialValues.application_url || "");
      setApplicationEmail(initialValues.application_email || "");
      setIsFeatured(initialValues.is_featured || false);
    }
  }, [initialValues]);

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

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
        company_logo_url: companyLogoUrl,
        job_type: jobType,
        role_category: roleCategory,
        location,
        location_type: locationType,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_currency: salaryCurrency,
        salary_period: salaryPeriod,
        application_deadline: applicationDeadline || null,
        experience_level: experienceLevel,
        description,
        requirements,
        responsibilities,
        tags,
        application_url: applicationUrl,
        application_email: applicationEmail,
        is_featured: isFeatured,
        status: 'active',
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
      setCompanyLogoUrl("");
      setJobType("");
      setRoleCategory("");
      setLocation("");
      setLocationType("");
      setSalaryMin("");
      setSalaryMax("");
      setSalaryCurrency("INR");
      setSalaryPeriod("Yearly");
      setApplicationDeadline("");
      setExperienceLevel("");
      setDescription("");
      setRequirements([]);
      setResponsibilities([]);
      setTags([]);
      setApplicationUrl("");
      setApplicationEmail("");
      setIsFeatured(false);

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
    <div className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Job Listing</DialogTitle>
        <DialogDescription>
          Fill in the details for your new job opportunity in the film industry.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Job title*</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Lead Actor for Indie Film"
            required
          />
        </div>

        {/* Company and Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company/Studio*</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Sunrise Productions"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyLogoUrl">Company Logo URL</Label>
            <Input
              id="companyLogoUrl"
              value={companyLogoUrl}
              onChange={(e) => setCompanyLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        {/* Job Type and Role Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type*</Label>
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
            <Label htmlFor="roleCategory">Role Category*</Label>
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

        {/* Location and Location Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Los Angeles, CA or Remote"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type*</Label>
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

        {/* Salary Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Min Salary</Label>
            <Input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Max Salary</Label>
            <Input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g., 80000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={salaryCurrency} onValueChange={setSalaryCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Payment Period</Label>
            <Select value={salaryPeriod} onValueChange={setSalaryPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Application Deadline and Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Job job_description*</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Provide a detailed job_description of the job..."
            required
          />
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" variant="outline" onClick={addRequirement}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1">{req}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="space-y-2">
          <Label>Responsibilities</Label>
          <div className="flex gap-2">
            <Input
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              placeholder="Add a responsibility"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
            />
            <Button type="button" variant="outline" onClick={addResponsibility}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {responsibilities.map((resp, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1">{resp}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResponsibility(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags (Optional)</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag (e.g., Feature Film, Voice Over)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1">{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="applicationUrl">Application URL</Label>
            <Input
              id="applicationUrl"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://example.com/apply"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationEmail">Application Email</Label>
            <Input
              id="applicationEmail"
              type="email"
              value={applicationEmail}
              onChange={(e) => setApplicationEmail(e.target.value)}
              placeholder="jobs@example.com"
            />
          </div>
        </div>

        {/* Featured Job */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
          <Label htmlFor="isFeatured">Mark as Featured Job (gives higher visibility)</Label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialValues ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobCreateFormNew;