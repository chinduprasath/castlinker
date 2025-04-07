
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useJobsData, JobFilters, JobSort } from "@/hooks/useJobsData";

// Import our components
import JobListingHeader from "@/components/jobs/JobListingHeader";
import JobFiltersComponent from "@/components/jobs/JobFilters";
import JobResults from "@/components/jobs/JobResults";
import JobCreateForm from "@/components/jobs/JobCreateForm";

const Jobs = () => {
  const { user } = useAuth();
  const { 
    jobs, 
    isLoading, 
    error,
    totalCount, 
    filters, 
    sort,
    savedJobs,
    updateFilters,
    updateSort,
    resetFilters,
    toggleSaveJob,
    applyForJob,
    refetchJobs
  } = useJobsData();

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    updateFilters(newFilters);
  };

  const handleSearch = (searchFilters: Partial<JobFilters>) => {
    updateFilters(searchFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2 border-b border-border/40 pb-5">
          <h1 className="text-3xl font-bold tracking-tight">Find Your Next Role</h1>
          <p className="text-muted-foreground">
            Browse thousands of casting calls, auditions, and job opportunities in the film industry
          </p>
        </div>
        
        {user && (
          <Button 
            className="bg-gold hover:bg-gold/90 text-white dark:text-black"
            onClick={() => setIsCreateFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        )}
      </div>

      <JobListingHeader onSearch={handleSearch} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64">
          <JobFiltersComponent 
            onFilterChange={handleFilterChange} 
            onResetFilters={resetFilters} 
          />
        </div>
        
        {/* Job Results */}
        <div className="flex-1 space-y-6">
          <JobResults 
            jobs={jobs}
            isLoading={isLoading}
            error={error}
            totalCount={totalCount}
            savedJobs={savedJobs}
            onSaveJob={toggleSaveJob}
            onApplyJob={applyForJob}
            onSort={updateSort}
            refetchJobs={refetchJobs}
          />
        </div>
      </div>

      {/* Job Create Form */}
      <JobCreateForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onJobCreated={refetchJobs}
      />
    </div>
  );
};

export default Jobs;
