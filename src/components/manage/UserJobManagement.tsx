import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Users } from "lucide-react";
import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const dummyJobs = [
  {
    id: "job_001",
    title: "Frontend Developer",
    description: "Develop and maintain user interfaces.",
    companyName: "Innovate Solutions",
    category: "Technology",
    jobType: "Full-time",
    location: "Remote",
    salaryRange: "$80,000 - $100,000",
    requiredSkills: ["React", "TypeScript", "CSS"],
    experienceLevel: "Mid-Level",
    languageRequirements: ["English"],
    applicationDeadline: "2023-12-31",
    numberOfOpenings: 2,
    genderPreference: "Any",
    postedDate: "2023-11-15",
    expiryDate: "2024-01-15",
    status: "active",
    applicants: [
      { id: "APP-001", name: "Alice Smith", role: "Frontend Developer", location: "London", status: "New" },
      { id: "APP-002", name: "Bob Johnson", role: "UI/UX Designer", location: "New York", status: "Selected" },
      { id: "APP-003", name: "Charlie Brown", role: "Marketing Intern", location: "San Francisco", status: "Rejected" },
    ]
  },
  {
    id: "job_002",
    title: "Marketing Specialist",
    description: "Plan and execute marketing campaigns.",
    companyName: "Creative Minds",
    category: "Marketing",
    jobType: "Part-time",
    location: "San Francisco",
    salaryRange: "$40,000 - $50,000",
    requiredSkills: ["SEO", "Content Marketing"],
    experienceLevel: "Entry-Level",
    languageRequirements: ["English"],
    applicationDeadline: "2024-01-15",
    numberOfOpenings: 1,
    genderPreference: "Any",
    postedDate: "2023-11-20",
    expiryDate: "2024-02-20",
    status: "active",
    applicants: [
      { id: "APP-004", name: "David Green", role: "Marketing Coordinator", location: "San Francisco", status: "New" },
    ]
  }
];

const UserJobManagement = () => {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applicantFilter, setApplicantFilter] = useState<'All' | 'New' | 'Selected' | 'Rejected'>('All');

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleChat = (applicantId: string) => {
    console.log('Chat with applicant:', applicantId);
    // Implement chat functionality
  };

  const handleSelect = (applicantId: string) => {
    console.log('Select applicant:', applicantId);
    // Implement select functionality
  };

  const handleReject = (applicantId: string) => {
    console.log('Reject applicant:', applicantId);
    // Implement reject functionality
  };

  // Placeholder function for editing a job
  const handleEditJob = (jobId: string) => {
    console.log('Edit job:', jobId);
    // Implement edit functionality (e.g., open a modal or navigate to an edit page)
  };

  // Placeholder function for deleting a job
  const handleDeleteJob = (jobId: string) => {
    console.log('Delete job:', jobId);
    // Implement delete functionality (e.g., show a confirmation dialog and make an API call)
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getApplicantStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'New':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredApplicants = (applicants: typeof dummyJobs[0]['applicants']) => {
    if (applicantFilter === 'All') {
      return applicants;
    }
    return applicants.filter(applicant => applicant.status === applicantFilter);
  };

  const generateJobId = (id: string) => {
    // Simple hash based on ID for demonstration
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const jobIdNumber = Math.abs(hash).toString().padStart(6, '0').slice(0, 6);
    return `JB-${jobIdNumber}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Job Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter buttons for applicants */}
        <div className="mb-4 flex items-center">
          <span className="mr-2">Filter Applicants:</span>
          <Button variant={applicantFilter === 'All' ? 'default' : 'outline'} size="sm" className="mr-2" onClick={() => setApplicantFilter('All')}>All ({dummyJobs.reduce((acc, job) => acc + job.applicants.length, 0)})</Button>
          <Button variant={applicantFilter === 'New' ? 'default' : 'outline'} size="sm" className="mr-2" onClick={() => setApplicantFilter('New')}>New ({dummyJobs.reduce((acc, job) => acc + job.applicants.filter(app => app.status === 'New').length, 0)})</Button>
          <Button variant={applicantFilter === 'Selected' ? 'default' : 'outline'} size="sm" className="mr-2" onClick={() => setApplicantFilter('Selected')}>Selected ({dummyJobs.reduce((acc, job) => acc + job.applicants.filter(app => app.status === 'Selected').length, 0)})</Button>
          <Button variant={applicantFilter === 'Rejected' ? 'default' : 'outline'} size="sm" onClick={() => setApplicantFilter('Rejected')}>Rejected ({dummyJobs.reduce((acc, job) => acc + job.applicants.filter(app => app.status === 'Rejected').length, 0)})</Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyJobs.map((job) => (
                <React.Fragment key={job.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link to={`/manage/jobs/${job.id}`} className="text-primary hover:underline">
                        {generateJobId(job.id)}
                      </Link>
                    </TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.category}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.postedDate}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge></TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {job.applicants.length}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleExpand(job.id)}>
                            {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditJob(job.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteJob(job.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedJobId === job.id && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-0">
                        <div className="p-4 bg-muted/20">
                          <h5 className="font-semibold mb-2">Applicants ({filteredApplicants(job.applicants).length})</h5>
                          {filteredApplicants(job.applicants).length === 0 ? (
                            <p className="text-muted-foreground text-sm">No applicants found with the selected filter.</p>
                          ) : (
                            <div className="space-y-3">
                              {filteredApplicants(job.applicants).map((applicant) => (
                                <div key={applicant.id} className="flex items-center justify-between p-3 border rounded-md bg-background">
                                  <div>
                                    <p className="font-medium">{applicant.name}</p>
                                    <p className="text-muted-foreground text-sm">{applicant.role} - {applicant.location}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge variant={getApplicantStatusBadgeVariant(applicant.status)}>{applicant.status}</Badge>
                                    <Button variant="ghost" size="icon" onClick={() => handleChat(applicant.id)} title="Chat">
                                      <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleSelect(applicant.id)} title="Select">
                                      <Check className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleReject(applicant.id)} title="Reject">
                                      <X className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserJobManagement; 