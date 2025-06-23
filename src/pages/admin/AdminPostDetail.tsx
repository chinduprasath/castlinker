import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Users, Heart, MessageSquare, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPostDetail = () => {
  const [post, setPost] = useState<any | null>(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Post ID is missing.",
          variant: "destructive",
        });
        return;
      }

      try {
        const postRef = doc(db, "castlinker_posts", id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          setPost(postSnap.data());
        } else {
          toast({
            title: "Error",
            description: "Post not found.",
            variant: "destructive",
          });
        }

        // Fetch application count
        const applicationsRef = collection(db, "post_applications");
        const q = query(applicationsRef, where("post_id", "==", id));
        const applicationsSnap = await getDocs(q);
        setApplicationCount(applicationsSnap.size);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load post details.",
          variant: "destructive",
        });
      }
    };

    fetchPost();
  }, [id, toast]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <CardDescription>
            {post.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-bold text-muted-foreground">Category</span>
              <p>{post.category}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Location</span>
              <p>{post.location || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Posted Date</span>
              <p>{formatDate(post.created_at)}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Likes</span>
              <p>{post.like_count}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Views</span>
              <p>{post.view_count}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Applications</span>
              <p>{applicationCount}</p>
            </div>
          </div>

          <Separator />

          <div>
            <span className="text-sm font-bold text-muted-foreground">Content</span>
            {post.media_type === 'image' && post.media_url ? (
              <img src={post.media_url} alt="Post Media" className="w-full rounded-md mt-2" />
            ) : post.media_type === 'video' && post.media_url ? (
              <video src={post.media_url} controls className="w-full rounded-md mt-2"></video>
            ) : (
              <p>No media available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPostDetail;
