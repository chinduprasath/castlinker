
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Post, 
  fetchPosts, 
  checkIfApplied, 
  togglePostLike, 
  checkIfLiked, 
  getApplicationsForPost,
  deletePost
} from '@/services/postsService';
import { toast } from '@/hooks/use-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedPosts, setAppliedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState({
    category: 'all',
    searchTerm: ''
  });
  
  const { user } = useAuth();

  // Load all posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Check which posts the current user has applied to
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) return;
      
      const statusMap: Record<string, boolean> = {};
      
      for (const post of posts) {
        statusMap[post.id] = await checkIfApplied(post.id, user.id);
      }
      
      setAppliedPosts(statusMap);
    };

    checkApplicationStatus();
  }, [posts, user]);

  // Check which posts the current user has liked
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      const likeMap: Record<string, boolean> = {};
      
      for (const post of posts) {
        likeMap[post.id] = await checkIfLiked(post.id, user.id);
      }
      
      setLikedPosts(likeMap);
    };

    checkLikeStatus();
  }, [posts, user]);

  // Get application counts for all posts
  useEffect(() => {
    const loadApplicationCounts = async () => {
      const countsMap: Record<string, number> = {};
      
      for (const post of posts) {
        const applications = await getApplicationsForPost(post.id);
        countsMap[post.id] = applications.length;
      }
      
      setApplicationCounts(countsMap);
    };

    loadApplicationCounts();
  }, [posts]);

  // Filtered posts based on category and search term
  const filteredPosts = posts.filter(post => {
    const matchesCategory = filters.category === 'all' || post.category === filters.category;
    const matchesSearch = !filters.searchTerm || 
      post.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
      post.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  // Toggle like on a post
  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      const isLiked = await togglePostLike(postId, user.id);
      
      if (isLiked !== null) {
        setLikedPosts(prev => ({ ...prev, [postId]: isLiked }));
        
        // Update the like count in the UI without needing to refetch all posts
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  like_count: isLiked ? post.like_count + 1 : Math.max(0, post.like_count - 1) 
                } 
              : post
          )
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Apply to a post
  const handleApplyToPost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this opportunity.",
        variant: "destructive"
      });
      return;
    }

    if (appliedPosts[postId]) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this opportunity.",
      });
      return;
    }

    try {
      const result = await checkIfApplied(postId, user.id);
      
      if (result) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this opportunity.",
        });
        setAppliedPosts(prev => ({ ...prev, [postId]: true }));
        return;
      }
      
      const application = await applyToPost(postId, user.id);
      
      if (application) {
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
        });
        setAppliedPosts(prev => ({ ...prev, [postId]: true }));
        setApplicationCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Delete a post
  const handleDeletePost = async (postId: string) => {
    if (!user) return false;
    
    try {
      const success = await deletePost(postId);
      
      if (success) {
        // Remove the post from local state
        setPosts(prev => prev.filter(post => post.id !== postId));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting post:", err);
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ category: 'all', searchTerm: '' });
  };

  return {
    posts: filteredPosts,
    loading,
    error,
    appliedPosts,
    likedPosts,
    applicationCounts,
    handleLikePost,
    handleApplyToPost,
    handleDeletePost,
    filters,
    updateFilters,
    clearFilters
  };
};

import { applyToPost } from '@/services/postsService';
export { applyToPost };
export default usePosts;
