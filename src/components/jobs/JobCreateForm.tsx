import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, DollarSign, MapPin, Calendar, Building, Users, Clock, Star, Award } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { JobType, LocationType, RoleCategory } from "@/types/jobTypes";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Partial<JobType>) => void;
  job?: JobType | null;
}

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, job }) => {
  const [title, setTitle] = useState(job?.title || "");
  const [company, setCompany] = useState(job?.company || "");
  const [companyLogo, setCompanyLogo] = useState(job?.company_logo || "");
  const [description, setDescription] = useState(job?.description || "");
  const [requirements, setRequirements] = useState(job?.requirements?.join("\n") || "");
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities?.join("\n") || "");
  const [jobType, setJobType] = useState<JobType>(job?.job_type || "Full-time");
  const [roleCategory, setRoleCategory] = useState<RoleCategory>(job?.role_category || "Acting");
  const [experienceLevel, setExperienceLevel] = useState(job?.experience_level || "");
  const [salaryMin, setSalaryMin] = useState(job?.salary_min || 0);
  const [salaryMax, setSalaryMax] = useState(job?.salary_max || 0);
  const [salaryCurrency, setSalaryCurrency] = useState(job?.salary_currency || "USD");
  const [salaryPeriod, setSalaryPeriod] = useState(job?.salary_period || "yearly");
  const [location, setLocation] = useState(job?.location || "");
  const [locationType, setLocationType] = useState<LocationType>(job?.location_type || "On-site");
  const [tags, setTags] = useState(job?.tags?.join(", ") || "");
  const [applicationDeadline, setApplicationDeadline] = useState(job?.application_deadline || "");
  const [applicationUrl, setApplicationUrl] = useState(job?.application_url || "");
  const [applicationEmail, setApplicationEmail] = useState(job?.application_email || "");
  const [isFeatured, setIsFeatured] = useState(job?.is_featured || false);
  const [isVerified, setIsVerified] = useState(job?.is_verified || false);
  const [status, setStatus] = useState(job?.status || "active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const jobData: Partial<JobType> = {
      title,
      company,
      company_logo: companyLogo,
      description,
      requirements: requirements.split("\n").map((item: string) => item.trim()),
      responsibilities: responsibilities.split("\n").map((item: string) => item.trim()),
      job_type: jobType,
      role_category: roleCategory,
      experience_level: experienceLevel,
      salary_min: Number(salaryMin),
      salary_max: Number(salaryMax),
      salary_currency: salaryCurrency,
      salary_period: salaryPeriod,
      location,
      location_type: locationType,
      tags: tags.split(",").map((item: string) => item.trim()),
      application_deadline: applicationDeadline,
      application_url: applicationUrl,
      application_email: applicationEmail,
      is_featured: isFeatured,
      is_verified: isVerified,
      status,
    };

    try {
      await onSubmit(jobData);
      toast.success("Job saved successfully!");
      onClose();
    } catch (error: any) {
      toast.error(`Failed to save job: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
      <div className="relative m-4 md:m-8 lg:m-16">
        <Card className="max-w-3xl mx-auto bg-card-gradient border-gold/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              {job ? "Edit Job" : "Create New Job"}
            </CardTitle>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  type="url"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={jobType} onValueChange={(value) => setJobType(value as JobType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roleCategory">Role Category</Label>
                  <Select value={roleCategory} onValueChange={(value) => setRoleCategory(value as RoleCategory)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acting">Acting</SelectItem>
                      <SelectItem value="Directing">Directing</SelectItem>
                      <SelectItem value="Writing">Writing</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Cinematography">Cinematography</SelectItem>
                      <SelectItem value="Editing">Editing</SelectItem>
                      <SelectItem value="Sound">Sound</SelectItem>
                      <SelectItem value="Visual Effects">Visual Effects</SelectItem>
                      <SelectItem value="Animation">Animation</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Input
                  id="experienceLevel"
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Salary Min</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Salary Max</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salaryCurrency">Salary Currency</Label>
                  <Input
                    id="salaryCurrency"
                    type="text"
                    value={salaryCurrency}
                    onChange={(e) => setSalaryCurrency(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="salaryPeriod">Salary Period</Label>
                  <Input
                    id="salaryPeriod"
                    type="text"
                    value={salaryPeriod}
                    onChange={(e) => setSalaryPeriod(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select value={locationType} onValueChange={(value) => setLocationType(value as LocationType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="applicationUrl">Application URL</Label>
                <Input
                  id="applicationUrl"
                  type="url"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="applicationEmail">Application Email</Label>
                <Input
                  id="applicationEmail"
                  type="email"
                  value={applicationEmail}
                  onChange={(e) => setApplicationEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked)}
                />
                <Label htmlFor="isFeatured">Is Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVerified"
                  checked={isVerified}
                  onCheckedChange={(checked) => setIsVerified(checked)}
                />
                <Label htmlFor="isVerified">Is Verified</Label>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobForm;
