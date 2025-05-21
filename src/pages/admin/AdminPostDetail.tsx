import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/services/postsService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

const AdminPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('castlinker_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;

        setPost(data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 text-center">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6 text-center text-destructive">
        Post not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Post Details</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('Edit post:', postId)} className="cursor-pointer flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Delete post:', postId)} className="text-destructive focus:text-destructive cursor-pointer flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Block post:', postId)} className="text-orange-500 focus:text-orange-500 cursor-pointer flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Block Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Toggle Verified Status for post:', postId)} className="cursor-pointer flex items-center">
                <Badge variant="secondary" className="mr-2">?</Badge>
                Toggle Verified Tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p className="text-lg">{post.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p className="text-lg"><Badge variant="outline">{post.category}</Badge></p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-lg">{post.location || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Posted Date</p>
            <p className="text-lg">{format(new Date(post.created_at), "MMM dd, yyyy HH:mm")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Event/Deadline Date</p>
            <p className="text-lg">{post.event_date ? format(new Date(post.event_date), "MMM dd, yyyy") : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">External URL</p>
            <p className="text-lg"><a href={post.external_url} target="_blank" rel="noopener noreferrer">{post.external_url || 'N/A'}</a></p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Place Name</p>
            <p className="text-lg">{post.place || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pincode</p>
            <p className="text-lg">{post.pincode || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Landmark</p>
            <p className="text-lg">{post.landmark || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tags</p>
            <p className="text-lg">{post.tags?.join(', ') || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">{post.description}</p>
        </CardContent>
      </Card>

      {post.media_url && (
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent>
            {post.media_type === 'image' ? (
              <img src={post.media_url} alt="Post media" className="max-w-full h-auto" />
            ) : post.media_type === 'video' ? (
              <video src={post.media_url} controls className="max-w-full h-auto" />
            ) : (
              <p>No media available</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Posted By</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground">User profile link goes here (Placeholder)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground">List of applicants here (Placeholder)</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default AdminPostDetail; 