import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchPostsByUser, Post, getApplicationsForPost, deletePost, updatePost, togglePostLike, checkIfLiked, getLikeCountForPost } from '@/services/postsService';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreatePostDialog from '@/components/posts/CreatePostDialog';

const ManagePostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [postId: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>({});

  useEffect(() => {
    const loadPosts = async () => {
      if (!user) {
        console.log('No user found');
        return;
      }
      setLoading(true);
      console.log('Current user.id:', user.id);
      const userPosts = await fetchPostsByUser(user.id);
      console.log('Fetched posts:', userPosts);
      setPosts(userPosts);
      // Check liked state and like count for each post
      const likedMap: { [postId: string]: boolean } = {};
      const likeCountMap: { [postId: string]: number } = {};
      for (const post of userPosts) {
        likedMap[post.id] = await checkIfLiked(post.id, user.id);
        likeCountMap[post.id] = await getLikeCountForPost(post.id);
      }
      setLikedPosts(likedMap);
      setLikeCounts(likeCountMap);
      setLoading(false);
    };
    loadPosts();
  }, [user]);

  const handleShowDetails = async (post: Post) => {
    setEditPost(null);
    setSelectedPost(post);
    setShowDialog(true);
    // Fetch applicants
    const apps = await getApplicationsForPost(post.id);
    setApplicants(apps);
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    const success = await deletePost(postToDelete.id);
    if (success) {
      toast({ title: 'Post deleted', description: 'The post has been deleted.' });
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      setShowDialog(false);
    } else {
      toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
    }
  };

  const handleEditPost = (post: Post) => {
    setShowDialog(false);
    setEditPost(post);
    setShowEditDialog(true);
  };

  const handleUpdatePost = async (postId: string, postData: any) => {
    const updated = await updatePost(postId, postData);
    if (updated) {
      toast({ title: 'Post updated', description: 'The post has been updated.' });
      setPosts(posts.map(p => (p.id === postId ? { ...p, ...postData } : p)));
      setShowEditDialog(false);
      setEditPost(null);
      setShowDialog(false);
    } else {
      toast({ title: 'Error', description: 'Failed to update post.', variant: 'destructive' });
    }
  };

  const handleToggleLike = async (post: Post) => {
    if (!user) return;
    const newLiked = await togglePostLike(post.id, user.id);
    setLikedPosts((prev) => ({ ...prev, [post.id]: newLiked }));
    // Refetch like count from DB
    const newCount = await getLikeCountForPost(post.id);
    setLikeCounts((prev) => ({ ...prev, [post.id]: newCount }));
  };

  const formatPostId = (index: number) => {
    return `PD-${(index + 1).toString().padStart(6, '0')}`;
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">No posts found.</TableCell>
                  </TableRow>
                ) : posts.map((post, idx) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <button
                        className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                        onClick={() => handleShowDetails(post)}
                        style={{ background: 'none' }}
                      >
                        {formatPostId(idx)}
                      </button>
                    </TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell><Badge variant="secondary">{post.category}</Badge></TableCell>
                    <TableCell>{'Active'}</TableCell>
                    <TableCell>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</TableCell>
                    <TableCell>{likeCounts[post.id] ?? 0}
                      <Button size="icon" variant="ghost" onClick={() => handleToggleLike(post)}>
                        <Heart className={likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => handleEditPost(post)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeletePost(post)}><Trash className="w-4 h-4 text-red-500" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Post Dialog (standalone, not nested) */}
      {editPost && (
        <CreatePostDialog
          isOpen={showEditDialog}
          onClose={() => { setShowEditDialog(false); setEditPost(null); }}
          initialValues={editPost}
          onUpdate={handleUpdatePost}
        />
      )}

      {/* Post Details Dialog (standalone, not nested) */}
      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) setSelectedPost(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>
              {selectedPost && (
                <div className="space-y-2 mt-2">
                  <div><strong>Title:</strong> {selectedPost.title}</div>
                  <div><strong>Description:</strong> {selectedPost.description}</div>
                  <div><strong>Category:</strong> {selectedPost.category}</div>
                  <div><strong>Location:</strong> {selectedPost.location || '-'}</div>
                  <div><strong>Tags:</strong> {selectedPost.tags?.join(', ') || '-'}</div>
                  <div><strong>Date Posted:</strong> {selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleString() : '-'}</div>
                  <div><strong>Likes:</strong> {selectedPost.like_count || 0}</div>
                  <div><strong>Creator:</strong> {selectedPost.creator_name || '-'} ({selectedPost.creator_profession || '-'})</div>
                  {selectedPost.media_url && (
                    <div>
                      <strong>Media:</strong> <a href={selectedPost.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                    </div>
                  )}
                  {selectedPost.external_url && (
                    <div>
                      <strong>External Link:</strong> <a href={selectedPost.external_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPost.external_url.length > 50 ? selectedPost.external_url.slice(0, 50) + '...' : selectedPost.external_url}</a>
                    </div>
                  )}
                  {selectedPost.event_date && (
                    <div><strong>Event Date:</strong> {new Date(selectedPost.event_date).toLocaleString()}</div>
                  )}
                  {selectedPost.place && (
                    <div><strong>Place:</strong> {selectedPost.place}</div>
                  )}
                  {selectedPost.pincode && (
                    <div><strong>Pincode:</strong> {selectedPost.pincode}</div>
                  )}
                  {selectedPost.landmark && (
                    <div><strong>Landmark:</strong> {selectedPost.landmark}</div>
                  )}
                  {/* Applicants Section */}
                  <div className="mt-4">
                    <strong>Applicants:</strong>
                    {applicants.length === 0 ? (
                      <div className="text-muted-foreground">No applicants yet.</div>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {applicants.map(app => (
                          <li key={app.id} className="flex items-center gap-2 border-b pb-1">
                            {app.profile?.avatar_url && <img src={app.profile.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />}
                            <span>{app.profile?.full_name || app.profile?.email || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground">{app.profile?.profession_type || ''}</span>
                            <span className="text-xs text-muted-foreground">{app.profile?.location || ''}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDeletePost}>Delete</Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePostsPage; 