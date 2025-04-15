
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
import { PROFESSION_OPTIONS, type Profession } from '@/types/talent';

interface ProfessionFilterProps {
  selectedProfessions: Profession[];
  onProfessionChange: (professions: Profession[]) => void;
}

export function ProfessionFilter({
  selectedProfessions = [],
  onProfessionChange,
}: ProfessionFilterProps) {
  const [open, setOpen] = useState(false);
  // Ensure we have a valid array of professions
  const validSelectedProfessions = Array.isArray(selectedProfessions) ? selectedProfessions : [];

  const toggleProfession = (profession: Profession) => {
    if (!Array.isArray(validSelectedProfessions)) {
      onProfessionChange([profession]);
      return;
    }
    
    const isSelected = validSelectedProfessions.includes(profession);
    if (isSelected) {
      onProfessionChange(validSelectedProfessions.filter(p => p !== profession));
    } else {
      onProfessionChange([...validSelectedProfessions, profession]);
    }
  };

  // Make sure PROFESSION_OPTIONS is always an array and filter out any undefined or empty values
  const safeOptions = Array.isArray(PROFESSION_OPTIONS) 
    ? PROFESSION_OPTIONS.filter(option => option && option !== undefined)
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {validSelectedProfessions.length === 0
            ? "Select professions..."
            : `${validSelectedProfessions.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search professions..." />
          <CommandEmpty>No profession found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {safeOptions.length > 0 ? (
              safeOptions.map((profession) => (
                <CommandItem
                  key={profession}
                  value={profession}
                  onSelect={() => toggleProfession(profession)}
                  className="flex items-center space-x-2"
                >
                  <div
                    className={cn(
                      "h-4 w-4 border rounded flex items-center justify-center",
                      validSelectedProfessions.includes(profession)
                        ? "bg-primary border-primary"
                        : "border-input"
                    )}
                  >
                    {validSelectedProfessions.includes(profession) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span>{profession}</span>
                </CommandItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No professions available
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
