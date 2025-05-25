import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
          type="button"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {value.length === 0 && (
              <span className="text-gray-400">{placeholder}</span>
            )}
            {value.length > 0 &&
              options
                .filter(opt => value.includes(opt.value))
                .map(opt => (
                  <Badge key={opt.value} className="mr-1 mb-1">
                    {opt.label}
                  </Badge>
                ))}
          </div>
          <span className="ml-2">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
          {filtered.length === 0 && (
            <div className="text-gray-400 text-sm px-2 py-4 text-center">No options</div>
          )}
          {filtered.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Checkbox
                checked={value.includes(opt.value)}
                onCheckedChange={() => handleSelect(opt.value)}
                id={`multi-select-${opt.value}`}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 