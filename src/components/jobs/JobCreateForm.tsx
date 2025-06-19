import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

const JobCreateForm = ({ isOpen, onClose, onJobCreated }: JobCreateFormProps) => {
  // Mock user - always show as logged in
  const user = { id: "mock-user", name: "Mock User" };
  const { toast } = useToast();

  const schema = z.object({
    title: z.string().nonempty("Job Title is required"),
    company: z.string().nonempty("Company/Studio is required"),
    description: z.string().nonempty("Job Description is required"),
    location: z.string().nonempty("Location is required"),
    job_type: z.string().nonempty("Job Type is required"),
    role_category: z.string().nonempty("Role Category is required"),
    location_type: z.string().nonempty("Location Type is required"),
    requirements: z.array(z.string()),
    responsibilities: z.array(z.string()),
    tags: z.array(z.string()),
    is_featured: z.boolean(),
    experience_level: z.string().nonempty("Experience Level is required"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      job_type: "Full-time",
      role_category: "Acting",
      location: "",
      location_type: "On-site",
      requirements: [],
      responsibilities: [],
      tags: [],
      is_featured: false,
      experience_level: "Entry level",
    },
  });

  const { handleSubmit, register, control, formState: { errors } } = form;

  const [currentRequirement, setCurrentRequirement] = useState("");
  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    form.setValue(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    form.setValue(name, value);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    form.setValue(name, checked);
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      form.setValue("requirements", [...(form.getValues("requirements") || []), currentRequirement.trim()]);
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    form.setValue("requirements", form.getValues("requirements")?.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    if (currentResponsibility.trim()) {
      form.setValue("responsibilities", [...(form.getValues("responsibilities") || []), currentResponsibility.trim()]);
      setCurrentResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    form.setValue("responsibilities", form.getValues("responsibilities")?.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      form.setValue("tags", [...(form.getValues("tags") || []), currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    form.setValue("tags", form.getValues("tags")?.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create jobs",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!form.getValues("title") || !form.getValues("company") || !form.getValues("description") || !form.getValues("location")) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        ...form.getValues(),
        created_by: user.id,
        application_deadline: deadlineDate?.toISOString(),
        status: "active",
        title: form.getValues("title") || "",
        company: form.getValues("company") || "",
        description: form.getValues("description") || "",
        location: form.getValues("location") || "",
        job_type: form.getValues("job_type") || "Full-time",
        role_category: form.getValues("role_category") || "Acting",
        location_type: form.getValues("location_type") || "On-site",
        experience_level: form.getValues("experience_level") || "Entry level",
      };

      // Cast to any to bypass TypeScript errors with the database schema
      const { data, error } = await supabase
        .from('film_jobs')
        .insert(jobData as any)
        .select();

      if (error) throw error;

      toast({
        title: "Job created successfully",
        description: "Your job listing has been published",
      });

      // Reset form and close
      form.reset({
        title: "",
        company: "",
        description: "",
        job_type: "Full-time",
        role_category: "Acting",
        location: "",
        location_type: "On-site",
        requirements: [],
        responsibilities: [],
        tags: [],
        is_featured: false,
        experience_level: "Entry level",
      });
      setDeadlineDate(undefined);
      onJobCreated();
      onClose();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast({
        title: "Error creating job",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Listing</DialogTitle>
          <DialogDescription>
            Fill in the details for your new job opportunity in the film industry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="block mb-2">Job Title*</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Lead Actor for Indie Film"
                value={form.getValues("title")}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="block mb-2">Company/Studio*</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g., Sunrise Productions"
                value={form.getValues("company")}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_logo" className="block mb-2">Company Logo URL</Label>
              <Input
                id="company_logo"
                name="company_logo"
                placeholder="https://example.com/logo.png"
                value={form.getValues("company_logo") || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="job_type" className="block mb-2">Job Type*</Label>
              <Select 
                value={form.getValues("job_type")} 
                onValueChange={(value) => handleSelectChange("job_type", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {["Full-time", "Part-time", "Contract", "Temporary", "Project"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role_category" className="block mb-2">Role Category*</Label>
              <Select 
                value={form.getValues("role_category")} 
                onValueChange={(value) => handleSelectChange("role_category", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select role category" />
                </SelectTrigger>
                <SelectContent>
                  {["Acting", "Directing", "Production", "Cinematography", "Writing", "Editing", "Sound", "VFX", "Costume", "Makeup", "Other"].map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="block mb-2">Location*</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Los Angeles, CA or Remote"
                value={form.getValues("location")}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="location_type" className="block mb-2">Location Type*</Label>
              <Select 
                value={form.getValues("location_type")} 
                onValueChange={(value) => handleSelectChange("location_type", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {["On-site", "Remote", "Hybrid"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary_min" className="block mb-2">Min Salary</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                placeholder="e.g., 50000"
                value={form.getValues("salary_min") || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="salary_max" className="block mb-2">Max Salary</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                placeholder="e.g., 80000"
                value={form.getValues("salary_max") || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            {/* New Experience Level Select */}
            <div>
              <Label htmlFor="experience_level" className="block mb-2">Experience Level*</Label>
              <Select 
                value={form.getValues("experience_level")} 
                onValueChange={(value) => handleSelectChange("experience_level", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {["Entry level", "Mid-level", "Senior level"].map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Existing Application Deadline */}
            <div>
              <Label className="block mb-2">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full bg-cinematic-dark/50 border-gold/10 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineDate ? format(deadlineDate, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black">
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={setDeadlineDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description" className="block mb-2">Job Description*</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a detailed description of the job..."
              value={form.getValues("description")}
              onChange={handleInputChange}
              className="min-h-32 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label className="block mb-2">Requirements</Label>
            <div className="space-y-2">
              {form.getValues("requirements")?.map((req, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-cinematic-dark/30 rounded-md">
                  <span className="flex-1">{req}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                />
                <Button 
                  variant="outline" 
                  onClick={addRequirement}
                  disabled={!currentRequirement.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <Label className="block mb-2">Responsibilities</Label>
            <div className="space-y-2">
              {form.getValues("responsibilities")?.map((resp, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-cinematic-dark/30 rounded-md">
                  <span className="flex-1">{resp}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => removeResponsibility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a responsibility"
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <Button 
                  variant="outline" 
                  onClick={addResponsibility}
                  disabled={!currentResponsibility.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="block mb-2">Tags</Label>
            <div className="space-y-2">
              {form.getValues("tags")?.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-cinematic-dark/30 rounded-md">
                  <span className="flex-1">{tag}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => removeTag(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button 
                  variant="outline" 
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Application Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="application_url" className="block mb-2">Application URL</Label>
              <Input
                id="application_url"
                name="application_url"
                placeholder="https://example.com/apply"
                value={form.getValues("application_url") || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="application_email" className="block mb-2">Application Email</Label>
              <Input
                id="application_email"
                name="application_email"
                placeholder="jobs@example.com"
                value={form.getValues("application_email") || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_featured"
              checked={form.getValues("is_featured") || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("is_featured", checked as boolean)
              }
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Mark as Featured Job (gives higher visibility)
            </Label>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
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
            {isSubmitting ? "Creating..." : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobCreateForm;
