
import { Card, CardContent } from "@/components/ui/card";

const NoJobsFound = () => {
  return (
    <Card className="border-border/40 bg-background">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium mb-2">No jobs found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          No jobs match your current search criteria. Try adjusting your filters or search terms.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoJobsFound;
