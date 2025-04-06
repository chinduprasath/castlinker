
import { supabase } from "@/integrations/supabase/client";

export const seedJobsData = async () => {
  // Check if we already have jobs in the database
  const { data: existingJobs } = await (supabase
    .from('film_jobs')
    .select('id')
    .limit(1) as any);
    
  if (existingJobs && existingJobs.length > 0) {
    console.log('Jobs data already exists');
    return;
  }
  
  const jobsData = [
    {
      title: "Lead Actor for Feature Film",
      company: "Universal Studios",
      company_logo: "https://placehold.co/100x100?text=US",
      description: "We are seeking a talented lead actor for our upcoming feature film. The role requires exceptional dramatic skills and on-screen presence.",
      job_type: "Full-time",
      role_category: "Acting",
      experience_level: "Senior Level",
      location: "Los Angeles, CA",
      location_type: "On-site",
      salary_min: 80000,
      salary_max: 150000,
      salary_currency: "USD",
      salary_period: "yearly",
      requirements: ["5+ years acting experience", "Professional training", "Ability to perform dramatic scenes"],
      responsibilities: ["Memorize and perform scripted material", "Work collaboratively with directors", "Participate in promotional events"],
      status: "active",
      is_featured: true,
      created_at: "2024-05-15T10:00:00Z"
    },
    {
      title: "Supporting Actress",
      company: "Paramount Pictures",
      company_logo: "https://placehold.co/100x100?text=PP",
      description: "Seeking a talented supporting actress for a period drama set in the 1920s. Must have excellent character development skills.",
      job_type: "Contract",
      role_category: "Acting",
      experience_level: "Mid Level",
      location: "New York, NY",
      location_type: "On-site",
      salary_min: 50000,
      salary_max: 90000,
      salary_currency: "USD",
      salary_period: "fixed",
      requirements: ["3+ years acting experience", "Period drama experience a plus"],
      responsibilities: ["Support lead actors", "Maintain character consistency", "Participate in table reads"],
      status: "active",
      is_featured: false,
      created_at: "2024-05-12T14:30:00Z"
    },
    {
      title: "Voice Actor for Animation",
      company: "Pixar",
      company_logo: "https://placehold.co/100x100?text=PIX",
      description: "Voice actor needed for upcoming animated feature. Must have range and ability to create distinct character voices.",
      job_type: "Part-time",
      role_category: "Acting",
      experience_level: "Entry Level",
      location: "Remote",
      location_type: "Remote",
      requirements: ["Voice acting experience", "Ability to create multiple character voices"],
      responsibilities: ["Record dialogue", "Collaborate with animation team", "Attend virtual read-throughs"],
      status: "pending",
      is_featured: false,
      created_at: "2024-05-10T09:15:00Z"
    },
    {
      title: "Director of Photography",
      company: "Netflix Productions",
      company_logo: "https://placehold.co/100x100?text=NF",
      description: "Experienced Director of Photography needed for upcoming Netflix original series. Must have experience with cinematic lighting and camera work.",
      job_type: "Contract",
      role_category: "Cinematography",
      experience_level: "Senior Level",
      location: "Vancouver, BC",
      location_type: "On-site",
      salary_min: 120000,
      salary_max: 200000,
      salary_currency: "USD",
      salary_period: "yearly",
      requirements: ["7+ years experience", "Portfolio of cinematic work", "Experience with RED cameras"],
      responsibilities: ["Develop visual style with director", "Oversee camera and lighting departments", "Ensure visual quality of footage"],
      status: "active",
      is_featured: true,
      created_at: "2024-05-03T16:45:00Z"
    },
    {
      title: "Script Editor",
      company: "HBO",
      company_logo: "https://placehold.co/100x100?text=HBO",
      description: "Script editor needed for premium drama series. Must have excellent story structure understanding and character development skills.",
      job_type: "Full-time",
      role_category: "Writing",
      experience_level: "Mid Level",
      location: "New York, NY",
      location_type: "Hybrid",
      salary_min: 70000,
      salary_max: 110000,
      salary_currency: "USD",
      salary_period: "yearly",
      requirements: ["4+ years script editing experience", "Knowledge of premium TV formats", "Experience with writers' rooms"],
      responsibilities: ["Review and provide notes on scripts", "Work with writers to strengthen stories", "Ensure continuity across episodes"],
      status: "inactive",
      is_featured: false,
      created_at: "2024-04-28T11:20:00Z"
    }
  ];
  
  const { error } = await (supabase.from('film_jobs').insert(jobsData) as any);
  
  if (error) {
    console.error('Error seeding jobs data:', error);
  } else {
    console.log('Jobs data seeded successfully');
  }
};
