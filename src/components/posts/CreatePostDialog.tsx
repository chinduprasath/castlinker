import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image, Video, FileText, Eye, EyeOff, MapPin, Calendar, DollarSign, Users, Clock, Star, Award, Film, Camera, Mic, PenTool, Palette, Music, Briefcase, UserCheck, Globe, Building, Megaphone, Shield, Settings, Crown, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { db, storage } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [salary, setSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleMediaTypeChange = (type: 'image' | 'video' | null) => {
    setMediaType(type);
    setMediaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !description || !category || !mediaType || !mediaFile) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      let mediaUrl = '';
      const storageRef = ref(storage, `posts/${mediaFile.name}`);
      await uploadBytes(storageRef, mediaFile);
      mediaUrl = await getDownloadURL(storageRef);

      const postData = {
        title,
        description,
        category,
        location,
        media_type: mediaType,
        media_url: mediaUrl,
        is_public: isPublic,
        is_featured: isFeatured,
        salary: salary,
        application_deadline: applicationDeadline,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        website: website,
        tags: tags.split(',').map(tag => tag.trim()),
        like_count: 0,
        share_count: 0,
        view_count: 0,
        created_at: serverTimestamp(),
        user_id: user?.id,
      };

      const postsRef = collection(db, 'castlinker_posts');
      await addDoc(postsRef, postData);

      toast.success('Post created successfully!');
      onClose();
      onSubmit(postData);
      resetForm();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(`Failed to create post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setMediaType(null);
    setMediaFile(null);
    setIsPublic(true);
    setIsFeatured(false);
    setSalary('');
    setApplicationDeadline('');
    setContactEmail('');
    setContactPhone('');
    setWebsite('');
    setTags('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your creative projects, job opportunities, or industry news with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} defaultValue={category}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Film">Film</SelectItem>
                  <SelectItem value="Television">Television</SelectItem>
                  <SelectItem value="Theater">Theater</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Los Angeles, Remote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <div className="flex gap-2">
                <Badge
                  variant={mediaType === 'image' ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleMediaTypeChange('image')}
                >
                  <Image className="mr-2 h-4 w-4" /> Image
                </Badge>
                <Badge
                  variant={mediaType === 'video' ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleMediaTypeChange('video')}
                >
                  <Video className="mr-2 h-4 w-4" /> Video
                </Badge>
                <Badge
                  variant={mediaType === null ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleMediaTypeChange(null)}
                >
                  <FileText className="mr-2 h-4 w-4" /> None
                </Badge>
              </div>
            </div>
          </div>

          {mediaType && (
            <div className="space-y-2">
              <Label htmlFor="mediaFile">Upload Media</Label>
              <Input
                type="file"
                id="mediaFile"
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                required={!!mediaType}
                ref={fileInputRef}
              />
              {mediaFile && (
                <Badge variant="secondary">
                  {mediaFile.name} <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => { setMediaFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} />
                </Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary/Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  id="salary"
                  className="pl-8"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  id="applicationDeadline"
                  className="pl-10"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter website URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter comma-separated tags"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublic" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked)} />
            <Label htmlFor="isPublic">Make this post public</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isFeatured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(checked)} />
            <Label htmlFor="isFeatured">Mark as featured</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
