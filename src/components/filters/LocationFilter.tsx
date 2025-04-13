import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const INDIA_LOCATIONS = [
  // Major Cities
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  // Film Industry Hubs
  "Film City, Mumbai",
  "Ramoji Film City, Hyderabad",
  "AVM Studios, Chennai",
  "Tollywood, Hyderabad",
  "Kollywood, Chennai",
  // States with Active Film Industries
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Karnataka",
  "Kerala",
  "West Bengal",
  "Gujarat",
  "Uttar Pradesh"
] as const;

interface LocationFilterProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export function LocationFilter({
  selectedLocations,
  onLocationChange,
}: LocationFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleLocation = (location: string) => {
    const isSelected = selectedLocations.includes(location);
    if (isSelected) {
      onLocationChange(selectedLocations.filter(l => l !== location));
    } else {
      onLocationChange([...selectedLocations, location]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLocations.length === 0
            ? "Select locations..."
            : `${selectedLocations.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {INDIA_LOCATIONS.map((location) => (
              <CommandItem
                key={location}
                onSelect={() => toggleLocation(location)}
                className="flex items-center space-x-2"
              >
                <div
                  className={cn(
                    "h-4 w-4 border rounded flex items-center justify-center",
                    selectedLocations.includes(location)
                      ? "bg-primary border-primary"
                      : "border-input"
                  )}
                >
                  {selectedLocations.includes(location) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span>{location}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 