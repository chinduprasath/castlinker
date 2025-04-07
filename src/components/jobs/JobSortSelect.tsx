
import { JobSort } from "@/types/jobTypes";

interface JobSortSelectProps {
  onSort: (sort: JobSort) => void;
  defaultValue?: string;
}

const JobSortSelect = ({ onSort, defaultValue = "relevance" }: JobSortSelectProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sort: JobSort;
    
    switch(value) {
      case "date":
        sort = { field: "created_at", direction: "desc" };
        break;
      case "salary":
        sort = { field: "salary_max", direction: "desc" };
        break;
      default:
        sort = { field: "relevance", direction: "desc" };
    }
    
    onSort(sort);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm mr-2">Sort by:</span>
      <select
        className="bg-background border border-input rounded-md px-3 py-1 text-sm shadow-sm focus:border-gold focus:outline-none"
        onChange={handleSortChange}
        defaultValue={defaultValue}
      >
        <option value="relevance">Most Relevant</option>
        <option value="date">Most Recent</option>
        <option value="salary">Highest Pay</option>
      </select>
    </div>
  );
};

export default JobSortSelect;
