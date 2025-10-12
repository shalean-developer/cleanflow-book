import React from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MultiSelectChipsProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  required?: boolean;
  description?: string;
}

export const MultiSelectChips = ({
  label,
  options,
  selected,
  onChange,
  error,
  required,
  description,
}: MultiSelectChipsProps) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-white/80">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-white/60">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
                ${
                  isSelected
                    ? "bg-[#EAF2FF] text-[#0C53ED] border-2 border-[#0C53ED]"
                    : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white/70 border-2 border-gray-200 dark:border-white/10 hover:border-[#0C53ED]/30"
                }
              `}
            >
              {option}
              {isSelected && <X className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

