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
import { PROFESSION_OPTIONS, Profession } from '@/hooks/useTalentDirectory';

interface ProfessionFilterProps {
  selectedProfessions: Profession[];
  onProfessionChange: (professions: Profession[]) => void;
}

export function ProfessionFilter({
  selectedProfessions,
  onProfessionChange,
}: ProfessionFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleProfession = (profession: Profession) => {
    const isSelected = selectedProfessions.includes(profession);
    if (isSelected) {
      onProfessionChange(selectedProfessions.filter(p => p !== profession));
    } else {
      onProfessionChange([...selectedProfessions, profession]);
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
          {selectedProfessions.length === 0
            ? "Select professions..."
            : `${selectedProfessions.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search professions..." />
          <CommandEmpty>No profession found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {PROFESSION_OPTIONS.map((profession) => (
              <CommandItem
                key={profession}
                onSelect={() => toggleProfession(profession)}
                className="flex items-center space-x-2"
              >
                <div
                  className={cn(
                    "h-4 w-4 border rounded flex items-center justify-center",
                    selectedProfessions.includes(profession)
                      ? "bg-primary border-primary"
                      : "border-input"
                  )}
                >
                  {selectedProfessions.includes(profession) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span>{profession}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 