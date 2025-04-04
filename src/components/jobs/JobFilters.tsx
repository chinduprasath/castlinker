
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";
import { 
  JobType, 
  LocationType, 
  RoleCategory, 
  ExperienceLevel, 
  PostedWithin,
  JobFilters as JobFiltersType
} from "@/hooks/useJobsData";

interface JobFiltersProps {
  onFilterChange: (filters: Partial<JobFiltersType>) => void;
  onResetFilters: () => void;
}

const JobFilters = ({ onFilterChange, onResetFilters }: JobFiltersProps) => {
  // State for all filters
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [roleCategories, setRoleCategories] = useState<RoleCategory[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[]>([]);
  const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
  const [postedWithin, setPostedWithin] = useState<PostedWithin | undefined>(undefined);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([10, 150]);
  const [minSalary, setMinSalary] = useState("10000");
  const [maxSalary, setMaxSalary] = useState("150000");

  // Job type options
  const jobTypeOptions: JobType[] = ["Full-time", "Part-time", "Contract", "Temporary"];
  
  // Role category options
  const roleCategoryOptions: RoleCategory[] = [
    "Acting", "Directing", "Production", "Cinematography", 
    "Writing", "Editing", "Sound", "VFX", "Costume", "Makeup"
  ];
  
  // Experience level options
  const experienceLevelOptions: ExperienceLevel[] = [
    "Entry Level", "Mid Level", "Senior Level", "Executive"
  ];
  
  // Location type options
  const locationTypeOptions: LocationType[] = ["On-site", "Remote", "Hybrid"];
  
  // Posted within options
  const postedWithinOptions = [
    { label: "Past 24 hours", value: "24h" as PostedWithin },
    { label: "Past 3 days", value: "3d" as PostedWithin },
    { label: "Past week", value: "7d" as PostedWithin },
    { label: "Past 2 weeks", value: "14d" as PostedWithin },
    { label: "Past month", value: "30d" as PostedWithin },
    { label: "Any time", value: "any" as PostedWithin }
  ];

  // Toggle job type
  const toggleJobType = (type: JobType) => {
    setJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Toggle role category
  const toggleRoleCategory = (category: RoleCategory) => {
    setRoleCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle experience level
  const toggleExperienceLevel = (level: ExperienceLevel) => {
    setExperienceLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  // Toggle location type
  const toggleLocationType = (type: LocationType) => {
    setLocationTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Toggle posted within
  const togglePostedWithin = (value: PostedWithin) => {
    setPostedWithin(prev => prev === value ? undefined : value);
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      jobTypes: jobTypes.length > 0 ? jobTypes : undefined,
      roleCategories: roleCategories.length > 0 ? roleCategories : undefined,
      experienceLevels: experienceLevels.length > 0 ? experienceLevels : undefined,
      locationTypes: locationTypes.length > 0 ? locationTypes : undefined,
      postedWithin: postedWithin,
      salaryMin: parseInt(minSalary) || undefined,
      salaryMax: parseInt(maxSalary) || undefined
    });
  };

  // Reset filters
  const resetFilters = () => {
    setJobTypes([]);
    setRoleCategories([]);
    setExperienceLevels([]);
    setLocationTypes([]);
    setPostedWithin(undefined);
    setSalaryRange([10, 150]);
    setMinSalary("10000");
    setMaxSalary("150000");
    onResetFilters();
  };

  // Update when slider changes
  useEffect(() => {
    setMinSalary((salaryRange[0] * 1000).toString());
    setMaxSalary((salaryRange[1] * 1000).toString());
  }, [salaryRange]);

  return (
    <Card className="bg-card-gradient border-gold/10 sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-foreground/70 hover:text-gold"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="space-y-6">
          {/* Job Type */}
          <div>
            <h3 className="text-sm font-medium mb-3">Job Type</h3>
            <div className="space-y-2">
              {jobTypeOptions.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox 
                    id={`job-type-${type.toLowerCase()}`} 
                    checked={jobTypes.includes(type)}
                    onCheckedChange={() => toggleJobType(type)}
                  />
                  <Label 
                    htmlFor={`job-type-${type.toLowerCase()}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Role Category */}
          <div>
            <h3 className="text-sm font-medium mb-3">Role Category</h3>
            <div className="space-y-2">
              {roleCategoryOptions.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox 
                    id={`category-${category.toLowerCase().replace('/', '-')}`}
                    checked={roleCategories.includes(category)}
                    onCheckedChange={() => toggleRoleCategory(category)}
                  />
                  <Label 
                    htmlFor={`category-${category.toLowerCase().replace('/', '-')}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Experience Level */}
          <div>
            <h3 className="text-sm font-medium mb-3">Experience Level</h3>
            <div className="space-y-2">
              {experienceLevelOptions.map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox 
                    id={`level-${level.toLowerCase().replace(' ', '-')}`}
                    checked={experienceLevels.includes(level)}
                    onCheckedChange={() => toggleExperienceLevel(level)}
                  />
                  <Label 
                    htmlFor={`level-${level.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Pay Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Pay Range</h3>
              <span className="text-xs text-gold">${parseInt(minSalary).toLocaleString()} - ${parseInt(maxSalary).toLocaleString()}</span>
            </div>
            <Slider
              value={salaryRange}
              max={150}
              min={0}
              step={5}
              className="my-4"
              onValueChange={setSalaryRange}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="min-pay" className="text-xs mb-1 block">Min ($)</Label>
                <Input 
                  id="min-pay" 
                  type="number" 
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 h-8 text-sm" 
                />
              </div>
              <div>
                <Label htmlFor="max-pay" className="text-xs mb-1 block">Max ($)</Label>
                <Input 
                  id="max-pay" 
                  type="number" 
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 h-8 text-sm" 
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Location Type */}
          <div>
            <h3 className="text-sm font-medium mb-3">Location Type</h3>
            <div className="space-y-2">
              {locationTypeOptions.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox 
                    id={`location-${type.toLowerCase()}`}
                    checked={locationTypes.includes(type)}
                    onCheckedChange={() => toggleLocationType(type)}
                  />
                  <Label 
                    htmlFor={`location-${type.toLowerCase()}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Posted Date */}
          <div>
            <h3 className="text-sm font-medium mb-3">Posted Date</h3>
            <div className="space-y-2">
              {postedWithinOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox 
                    id={`time-${option.value}`}
                    checked={postedWithin === option.value}
                    onCheckedChange={() => togglePostedWithin(option.value)}
                  />
                  <Label 
                    htmlFor={`time-${option.value}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full bg-gold hover:bg-gold-dark text-cinematic mt-2"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for the salary input
const Input = ({ className, ...props }) => {
  return (
    <input
      className={`w-full px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gold ${className}`}
      {...props}
    />
  );
};

export default JobFilters;
