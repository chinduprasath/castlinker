import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const JobCreateForm = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [jobType, setJobType] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [salaryPeriod, setSalaryPeriod] = useState("yearly");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

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
        status: 'active',
        is_featured: false,
        created_at: serverTimestamp(),
        user_id: user.id,
      };

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
      setSalaryCurrency("USD");
      setSalaryPeriod("yearly");
      setApplicationDeadline("");
      
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Job Posting</CardTitle>
        <CardDescription>
          Post a new job opportunity for the film industry community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select onValueChange={setJobType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleCategory">Role Category</Label>
              <Select onValueChange={setRoleCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select role category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acting">Acting</SelectItem>
                  <SelectItem value="Directing">Directing</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Cinematography">Cinematography</SelectItem>
                  <SelectItem value="Writing">Writing</SelectItem>
                  <SelectItem value="Post-Production">Post-Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationType">Location Type</Label>
              <Select onValueChange={setLocationType} required>
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
              <Label htmlFor="salaryMin">Min Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Max Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Currency</Label>
              <Select onValueChange={setSalaryCurrency} value={salaryCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryPeriod">Period</Label>
              <Select onValueChange={setSalaryPeriod} value={salaryPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
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
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Job...
              </>
            ) : (
              "Create Job Posting"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobCreateForm;
