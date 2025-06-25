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
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a job posting.",
        variant: "destructive"
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
        user_id: user.id
      };
      await addDoc(collection(db, 'film_jobs'), jobData);
      toast({
        title: "Job posted successfully!",
        description: "Your job posting has been created and is now live."
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
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="max-w-4xl mx-auto">
      
      
    </Card>;
};
export default JobCreateForm;