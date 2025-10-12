import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((s) => s !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
    setSearchTerm("");
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input Area */}
      <div
        className={cn(
          "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {/* Selected badges */}
          {selected.length > 0 && (
            <>
              {selected.map((item) => {
                const option = options.find((opt) => opt.value === item);
                return (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="rounded-sm px-2 py-1 font-normal"
                  >
                    {option?.label || item}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })}
            </>
          )}
          
          {/* Placeholder text when no items selected */}
          {selected.length === 0 && (
            <span className="text-muted-foreground">
              {placeholder}
            </span>
          )}
        </div>
        
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {/* Search Input at Top of Dropdown */}
          <div className="border-b p-2">
            <Input
              placeholder="Search service areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          
          <ScrollArea className="max-h-60">
            {filteredOptions.length > 0 ? (
              <div className="p-1">
                {filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

