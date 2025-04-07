
import { Job } from "@/types/jobTypes";

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatSalary = (job: Job): string => {
  if (!job.salary_min && !job.salary_max) return "Not specified";
  
  const currency = job.salary_currency || "USD";
  const period = job.salary_period || "yearly";
  
  let formattedPeriod = "";
  switch (period) {
    case "hourly": formattedPeriod = "/hour"; break;
    case "daily": formattedPeriod = "/day"; break;
    case "weekly": formattedPeriod = "/week"; break;
    case "monthly": formattedPeriod = "/month"; break;
    case "yearly": formattedPeriod = "/year"; break;
    default: formattedPeriod = ""; // for flat rate
  }
  
  const currencySymbol = currency === "USD" ? "$" : 
                         currency === "EUR" ? "€" : 
                         currency === "GBP" ? "£" : 
                         currency === "INR" ? "₹" : currency;
  
  if (job.salary_min && job.salary_max) {
    return `${currencySymbol}${job.salary_min.toLocaleString()} - ${currencySymbol}${job.salary_max.toLocaleString()}${formattedPeriod}`;
  } else if (job.salary_min) {
    return `${currencySymbol}${job.salary_min.toLocaleString()}${formattedPeriod}+`;
  } else if (job.salary_max) {
    return `Up to ${currencySymbol}${job.salary_max.toLocaleString()}${formattedPeriod}`;
  }
  
  return "Not specified";
};
