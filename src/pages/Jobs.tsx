import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Briefcase, Filter, Building2, Clock, Calendar, DollarSign } from "lucide-react";

const Jobs = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 border-b border-border/40 pb-5">
        <h1 className="text-3xl font-bold tracking-tight">Find Your Next Role</h1>
        <p className="text-muted-foreground">
          Browse thousands of casting calls, auditions, and job opportunities in the film industry
        </p>
      </div>

      <Card className="border-gold/10 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Job title, keyword, or company" 
              className="w-full h-12 pl-10 pr-4 bg-background border border-gold/20 rounded-md focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                placeholder="Location (city or remote)" 
                className="w-full h-12 pl-10 pr-4 bg-background border border-gold/20 rounded-md focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
              />
            </div>
            <Button className="h-12 px-6 bg-gold hover:bg-gold/90 text-black font-medium rounded-md transition-colors">
              Search Jobs
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 border-gold/10 shadow-sm p-5 h-fit">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h2>
            <Button variant="ghost" size="sm" className="text-sm text-gold h-8 px-2">
              Reset All
            </Button>
          </div>
          
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Type
              </h3>
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract", "Temporary"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`job-type-${type}`} />
                    <label htmlFor={`job-type-${type}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Role Category
              </h3>
              <div className="space-y-2">
                {["Acting", "Directing", "Production", "Cinematography", "Costume & Wardrobe", "Sound & Music"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`category-${category}`} />
                    <label htmlFor={`category-${category}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Posted Within
              </h3>
              <div className="space-y-2">
                {["Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days", "Last 30 days"].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox id={`time-${time}`} />
                    <label htmlFor={`time-${time}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {time}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-4">
              <Button className="w-full bg-background border border-gold/20 text-foreground hover:bg-muted transition-colors">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">42</span> results</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="text-sm bg-muted border border-border/40 rounded-md h-9 px-3">
                <option>Most Relevant</option>
                <option>Newest</option>
                <option>Highest Paying</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-gold/10 hover:border-gold/30 transition-colors p-5 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="md:w-16 md:h-16 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gold">SC</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-medium text-lg">Lead Actor for Independent Drama</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gold/10 border-gold/20 text-gold">
                            Featured
                          </Badge>
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">
                            New
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          Sunrise Cinema Productions
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Los Angeles, CA
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          Full-time
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          $1,500-2,000/day
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Posted 2 days ago
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Seeking a lead actor (30-40) for an independent drama exploring themes of redemption and family. Experience with dramatic roles required. Filming begins in October 2023.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Drama", "Lead Role", "SAG-AFTRA", "Feature Film"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full bg-muted text-muted-foreground font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-3">
                      <Button variant="outline" size="sm">
                        Save Job
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button size="sm" className="bg-gold hover:bg-gold/90 text-black">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-muted">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
