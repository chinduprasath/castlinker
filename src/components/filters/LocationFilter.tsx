
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

// Default India locations for the filter
export const INDIA_LOCATIONS = [
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Hyderabad, India',
  'Chennai, India',
  'Kolkata, India',
  'Pune, India',
  'Ahmedabad, India'
];

interface LocationFilterProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
  availableLocations?: string[];
}

export function LocationFilter({
  selectedLocations = [],
  onLocationChange,
  availableLocations = INDIA_LOCATIONS
}: LocationFilterProps) {
  const [open, setOpen] = useState(false);
  // Ensure we always have valid arrays
  const validSelectedLocations = Array.isArray(selectedLocations) ? selectedLocations : [];
  
  // Ensure available locations is always an array and filter out empty/undefined values
  const validAvailableLocations = Array.isArray(availableLocations) && availableLocations.length > 0 
    ? availableLocations.filter(loc => loc && loc !== '')
    : INDIA_LOCATIONS.filter(loc => loc && loc !== '');

  const toggleLocation = (location: string) => {
    if (!Array.isArray(validSelectedLocations)) {
      onLocationChange([location]);
      return;
    }
    
    const isSelected = validSelectedLocations.includes(location);
    if (isSelected) {
      onLocationChange(validSelectedLocations.filter(l => l !== location));
    } else {
      onLocationChange([...validSelectedLocations, location]);
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
          {validSelectedLocations.length === 0
            ? "Select locations..."
            : `${validSelectedLocations.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {validAvailableLocations.length > 0 ? (
              validAvailableLocations.map((location) => (
                <CommandItem
                  key={location}
                  value={location || 'unknown'} // Ensure value is never undefined or empty
                  onSelect={() => toggleLocation(location)}
                  className="flex items-center space-x-2"
                >
                  <div
                    className={cn(
                      "h-4 w-4 border rounded flex items-center justify-center",
                      validSelectedLocations.includes(location)
                        ? "bg-primary border-primary"
                        : "border-input"
                    )}
                  >
                    {validSelectedLocations.includes(location) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span>{location}</span>
                </CommandItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No locations available
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
