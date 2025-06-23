import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Clock, Star, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminJobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;

      try {
        const jobDoc = await getDoc(doc(db, 'film_jobs', id));

        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        } else {
          toast({
            title: "Error",
            description: "Job not found.",
            variant: "destructive",
          });
          navigate("/admin/jobs");
        }

        // Fetch application count
        const applicationsQuery = query(
          collection(db, 'job_applications'),
          where('job_id', '==', id)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        setApplicationCount(applicationsSnapshot.size);

      } catch (error: any) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load job details",
          variant: "destructive",
        });
      }
    };

    fetchJobDetails();
  }, [id, navigate, toast]);

  if (!job) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading job details...
      </div>
    );
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/jobs")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Job Management
      </Button>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
          <CardDescription>
            Details for {job.title} - {job.company}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Job Information</h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Company:</span> {job.company}
                </p>
                <p>
                  <span className="font-bold">Category:</span> {job.role_category}
                </p>
                <p>
                  <span className="font-bold">Type:</span> {job.job_type}
                </p>
                <p>
                  <span className="font-bold">Location:</span> {job.location} ({job.location_type})
                </p>
                <p>
                  <span className="font-bold">Salary:</span> {job.salary_min} - {job.salary_max} {job.salary_currency} ({job.salary_period})
                </p>
                <p>
                  <span className="font-bold">Posted Date:</span> {formatDate(job.created_at)}
                </p>
                <Badge>
                  {job.status}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Job Description</h3>
              <Separator className="my-2" />
              <p>{job.description}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Requirements</h3>
            <Separator className="my-2" />
            <ul>
              {job.requirements && job.requirements.map((req: string, index: number) => (
                <li key={index} className="list-disc ml-6">{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Responsibilities</h3>
            <Separator className="my-2" />
            <ul>
              {job.responsibilities && job.responsibilities.map((resp: string, index: number) => (
                <li key={index} className="list-disc ml-6">{resp}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Total applications for this job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{applicationCount} Applications</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminJobDetail;
