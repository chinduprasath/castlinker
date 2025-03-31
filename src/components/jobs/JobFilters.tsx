
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

const JobFilters = () => {
  return (
    <Card className="bg-card-gradient border-gold/10 sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 text-foreground/70 hover:text-gold">
          <RefreshCw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="space-y-6">
          {/* Job Type */}
          <div>
            <h3 className="text-sm font-medium mb-3">Job Type</h3>
            <div className="space-y-2">
              {["Full-time", "Part-time", "Contract", "Project", "Internship"].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox id={`job-type-${type.toLowerCase()}`} />
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
              {["Acting", "Directing", "Production", "Camera/Photography", "Writing", "Editing", "Music/Sound", "VFX/Animation"].map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox id={`category-${category.toLowerCase().replace('/', '-')}`} />
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
              {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox id={`level-${level.toLowerCase().replace(' ', '-')}`} />
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
              <span className="text-xs text-gold">$10k - $150k+</span>
            </div>
            <Slider
              defaultValue={[10, 150]}
              max={150}
              min={0}
              step={5}
              className="my-4"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="min-pay" className="text-xs mb-1 block">Min ($)</Label>
                <Input id="min-pay" type="number" defaultValue={10000} className="bg-cinematic-dark/50 border-gold/10 h-8 text-sm" />
              </div>
              <div>
                <Label htmlFor="max-pay" className="text-xs mb-1 block">Max ($)</Label>
                <Input id="max-pay" type="number" defaultValue={150000} className="bg-cinematic-dark/50 border-gold/10 h-8 text-sm" />
              </div>
            </div>
          </div>
          
          <Separator className="bg-gold/10" />
          
          {/* Location Type */}
          <div>
            <h3 className="text-sm font-medium mb-3">Location Type</h3>
            <div className="space-y-2">
              {["On-site", "Remote", "Hybrid"].map((location) => (
                <div key={location} className="flex items-center gap-2">
                  <Checkbox id={`location-${location.toLowerCase()}`} />
                  <Label 
                    htmlFor={`location-${location.toLowerCase()}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {location}
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
              {["Past 24 hours", "Past week", "Past month", "Any time"].map((time) => (
                <div key={time} className="flex items-center gap-2">
                  <Checkbox id={`time-${time.toLowerCase().replace(/\s+/g, '-')}`} />
                  <Label 
                    htmlFor={`time-${time.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic mt-2">
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
