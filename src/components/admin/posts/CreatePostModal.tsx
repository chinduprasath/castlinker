import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void; // Replace any with a proper type later
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(''); // You might want a default category or list
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]); // For file uploads if needed for posts
  const [media, setMedia] = useState<File | null>(null);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [externalUrl, setExternalUrl] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedia(event.target.files[0] || null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Placeholder submission logic
    const postData = {
      title,
      description,
      category,
      event_date: eventDate ? format(eventDate, 'yyyy-MM-dd') : null,
      external_url: externalUrl || null,
      place: placeName || null,
      location: location || null,
      pincode: pincode || null,
      landmark: landmark || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      media: media
    };

    console.log('Submitting post:', postData);

    // In a real app, you would send this data to your backend/API
    // await yourApiCall({ title, category, description, attachments });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onClose(); // Close modal after submission
    // You might want to refresh the post list here in the parent component
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share an opportunity with the community. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2 overflow-y-auto max-h-[70vh]">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          {/* Description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity in detail..."
              rows={5}
            />
          </div>
          {/* Category */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
          {/* Media Upload */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="media">Media (Image or Video)</Label>
            <Button asChild variant="outline" className="w-fit flex items-center gap-2">
              <label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="h-4 w-4" /> Upload Media
                <Input id="media-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="sr-only" />
              </label>
            </Button>
            {media && <span className="text-xs text-muted-foreground mt-1">{media.name}</span>}
          </div>
          {/* Event/Deadline Date */}
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
          {/* External URL */}
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
          {/* Address Information */}
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
          {/* Tags */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags..."
              />
              <Button type="button" variant="outline" className="px-4">Add</Button>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 text-base font-medium">
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="px-6 py-2 text-base font-medium">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal; 