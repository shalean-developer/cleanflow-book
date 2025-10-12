import React, { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileInputProps {
  label: string;
  accept: string;
  required?: boolean;
  error?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  description?: string;
  maxSize?: number; // in bytes
}

export const FileInput = ({
  label,
  accept,
  required,
  error,
  value,
  onChange,
  description,
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const isImage = value?.type.startsWith("image/");
  const isPdf = value?.type === "application/pdf";

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-white/80">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-white/60">{description}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
        aria-describedby={error ? `${label}-error` : undefined}
      />

      {!value ? (
        <button
          type="button"
          onClick={handleClick}
          className={`
            w-full flex flex-col items-center justify-center gap-2 p-6
            border-2 border-dashed rounded-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
            ${
              error
                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
                : "border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-[#0C53ED] hover:bg-[#EAF2FF]/30"
            }
          `}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#0B1220] shadow-sm">
            <Upload className="w-6 h-6 text-[#0C53ED]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-white/80">
              Click to upload
            </p>
            <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
              {accept.split(",").join(", ")} (max {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        </button>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-[#EAF2FF] dark:bg-[#0C53ED]/20">
              {isPdf ? (
                <FileText className="w-8 h-8 text-[#0C53ED]" />
              ) : isImage ? (
                <ImageIcon className="w-8 h-8 text-[#0C53ED]" />
              ) : (
                <FileText className="w-8 h-8 text-[#0C53ED]" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white/90 truncate">
              {value.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/60">
              {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <p id={`${label}-error`} className="text-sm text-rose-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

