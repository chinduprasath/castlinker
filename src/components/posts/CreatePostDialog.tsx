import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Upload, Image, Video, FileText, Eye, EyeOff, MapPin, DollarSign, Users, Clock, Star, Award, Film, Camera, Mic, PenTool, Palette, Music, Briefcase, UserCheck, Globe, Building, Megaphone, Shield, Settings, Crown, Wrench, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { db, storage } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createPost } from '@/services/postsService';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (postData: any) => void;
  initialValues?: Partial<any>;
  onUpdate?: (postId: string, postData: any) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ isOpen, onClose, onSubmit, initialValues, onUpdate }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [salary, setSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState<Date | undefined>(initialValues?.event_date ? new Date(initialValues.event_date) : undefined);
  const [externalUrl, setExternalUrl] = useState(initialValues?.external_url || '');
  const [placeName, setPlaceName] = useState(initialValues?.place || '');
  const [pincode, setPincode] = useState(initialValues?.pincode || '');
  const [landmark, setLandmark] = useState(initialValues?.landmark || '');
  const [tagsInput, setTagsInput] = useState('');

  React.useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setCategory(initialValues.category || '');
      setLocation(initialValues.location || '');
      setTags(initialValues.tags || []);
      setEventDate(initialValues.event_date ? new Date(initialValues.event_date) : undefined);
      setExternalUrl(initialValues.external_url || '');
      setPlaceName(initialValues.place || '');
      setPincode(initialValues.pincode || '');
      setLandmark(initialValues.landmark || '');
    }
  }, [initialValues, isOpen]);

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
      const isImage = file.type.startsWith('image');
      const isVideo = file.type.startsWith('video');
      const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
      if (file.size > maxSize) {
        toast.error(`File is too large. Max size is ${isImage ? '10MB' : '50MB'}.`);
        return;
      }
      setMediaFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !description || !category) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      let mediaUrl = initialValues?.media_url || '';
      let mediaType = initialValues?.media_type || null;
      if (mediaFile) {
        const storageRef = ref(storage, `posts/${mediaFile.name}`);
        await uploadBytes(storageRef, mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = mediaFile.type.startsWith('image') ? 'image' : 'video';
      }
      const postData = {
        title,
        description,
        category,
        location,
        media_type: mediaType,
        media_url: mediaUrl,
        event_date: eventDate ? eventDate.toISOString() : null,
        external_url: externalUrl,
        place: placeName,
        pincode,
        landmark,
        tags,
        created_by: user?.id || '',
        creator_name: user?.name || null,
        creator_profession: user?.role || null,
      };
      if (initialValues && initialValues.id && onUpdate) {
        await onUpdate(initialValues.id, postData);
        toast.success('Post updated successfully!');
        setIsLoading(false);
        onClose();
      } else if (onSubmit) {
        const created = await createPost(postData);
        if (created) {
          toast.success('Post created successfully!');
          setIsLoading(false);
          onClose();
          onSubmit(created);
          resetForm();
        } else {
          toast.error('Failed to create post.');
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Error creating/updating post:', error);
      toast.error(`Failed to save post: ${error.message}`);
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
    setTags([]);
    setEventDate(undefined);
    setExternalUrl('');
    setPlaceName('');
    setPincode('');
    setLandmark('');
    setTagsInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share an opportunity with the community. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity in detail..."
              rows={5}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casting">Casting</SelectItem>
                <SelectItem value="audition">Audition</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="media">Media (Image or Video)</Label>
            <Button asChild variant="outline" className="w-fit flex items-center gap-2">
              <label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="h-4 w-4" /> Upload Media
                <Input id="media-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="sr-only" />
              </label>
            </Button>
            {mediaFile && <span className="text-xs text-muted-foreground mt-1">{mediaFile.name}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="event-date">Event/Deadline Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground">Select a date for this opportunity (optional)</span>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="external-url">External URL (Optional)</Label>
            <Input
              id="external-url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <span className="text-xs text-muted-foreground">Add a relevant external link (e.g. registration form, YouTube link)</span>
          </div>
          <div className="flex flex-col gap-2 border border-muted-foreground/10 rounded-lg p-3 mt-2">
            <Label className="text-base font-semibold mb-0">Address Information (Optional)</Label>
            <Input
              id="place-name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Studio name, building, etc."
            />
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Area/locality"
              />
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Postal/zip code"
              />
            </div>
            <Input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Add tags..."
              />
              <Button type="button" variant="outline" className="px-4" onClick={() => { if (tagsInput.trim()) { setTags([...tags, tagsInput.trim()]); setTagsInput(''); } }}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isLoading} className="px-6 py-2 text-base font-medium">
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="px-6 py-2 text-base font-medium">Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
