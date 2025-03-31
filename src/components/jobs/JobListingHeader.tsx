
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

const JobListingHeader = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Your Next Role</h1>
        <p className="text-foreground/70">
          Browse thousands of casting calls, auditions, and job opportunities in the film industry
        </p>
      </div>
      
      <div className="rounded-xl bg-card-gradient border border-gold/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input 
              type="text"
              placeholder="Job title, keyword, or company"
              className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
            />
          </div>
          
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input 
              type="text"
              placeholder="Location (city or remote)"
              className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic h-10">
              Search Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingHeader;
