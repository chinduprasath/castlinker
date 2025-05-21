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
    <Dialog open={isOpen} onOpenChange={onClose}> {/* Use onOpenChange to handle closing */} 
      <DialogContent className="sm:max-w-[700px]"> {/* Increased max-width for two columns */}
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share an opportunity with the community. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4 overflow-y-auto max-h-[70vh]"> {/* Added scrolling and max height */}
          {/* Column 1 */}
          <div className="grid gap-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              {/* Using a simple Input for now, can replace with Select */}
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select a category"
              />
            </div>

            {/* Event/Deadline Date */}
            <div className="grid gap-2">
              <Label htmlFor="event-date">Event/Deadline Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
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
              <p className="text-sm text-muted-foreground">Select a date for this opportunity (optional)</p>
            </div>

            {/* External URL */}
            <div className="grid gap-2">
              <Label htmlFor="external-url">External URL (Optional)</Label>
              <Input
                id="external-url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <p className="text-sm text-muted-foreground">Add a relevant external link (e.g. registration form, YouTube link)</p>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags"
              />
              <p className="text-sm text-muted-foreground">Comma separated tags (e.g., #castingcall, #filmproduction)</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="grid gap-6">
            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the opportunity in detail..."
                rows={10} // Adjust rows to fill space better
              />
            </div>

            {/* Media Upload */}
            <div className="grid gap-2">
              <Label htmlFor="media">Media (Image or Video)</Label>
              {/* Custom styled file input button */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="media-upload" className="flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer text-sm font-medium">
                  <Upload className="h-4 w-4 mr-2" /> Upload Media
                </Label>
                <Input id="media-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="sr-only" />
                {media && <span className="text-sm text-muted-foreground">{media.name}</span>}
              </div>
            </div>

            {/* Address Information */}
            <div className="grid gap-4">
              <Label className="text-base font-semibold mb-0">Address Information (Optional)</Label>
              <div className="grid gap-2">
                <Label htmlFor="place-name">Place Name</Label>
                <Input
                  id="place-name"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Studio name, building, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area/locality"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Postal/zip code"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Nearby landmark"
                />
              </div>
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal; 