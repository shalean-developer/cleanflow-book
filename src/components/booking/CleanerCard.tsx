import { Button } from '@/components/ui/button';
import { Star, MapPin, Check } from 'lucide-react';

interface CleanerCardProps {
  id: string;
  name: string;
  rating: number;
  serviceAreas: string[];
  isAvailable?: boolean;
  nextAvailable?: string;
  selected?: boolean;
  onSelect: (id: string, name: string) => void;
}

export function CleanerCard({
  id,
  name,
  rating,
  serviceAreas,
  isAvailable = true,
  nextAvailable,
  selected,
  onSelect,
}: CleanerCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Mock availability data for visual purposes
  const availabilityDays = ['Mon', 'Wed', 'Fri', 'Sun'];
  const skills = ['Deep Clean', 'Windows', 'Carpet'];

  return (
    <li 
      className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 cursor-pointer group ${
        selected 
          ? 'ring-2 ring-[#0C53ED] ring-offset-2 border-[#0C53ED]' 
          : 'hover:ring-2 hover:ring-[#0C53ED]/10 hover:ring-offset-2'
      }`}
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id, name)}
    >
      {/* Header Section */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Avatar with Gradient Ring */}
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-sm sm:text-xl font-semibold text-[#0F172A]">{initials}</span>
            </div>
          </div>
          {selected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#0C53ED] rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Name and Verified Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg sm:text-xl text-[#0F172A] truncate">{name}</h3>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
            </div>
          </div>

          {/* Meta Row: Rating and Experience */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#475569] mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </span>
            <span className="font-medium">2+ years exp.</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-[#475569]">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate" title={serviceAreas.join(', ')}>
              {serviceAreas.length > 1 ? `${serviceAreas[0]} +${serviceAreas.length - 1} more` : serviceAreas[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">Available Days</span>
          <span className="text-xs text-[#64748B]">{availabilityDays.length} days</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {availabilityDays.slice(0, 4).map((day) => (
            <span
              key={day}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-[#EAF2FF] text-[#0C53ED] rounded-full"
            >
              {day}
            </span>
          ))}
          {availabilityDays.length > 4 && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{availabilityDays.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">Specialties</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-100 text-[#475569] rounded-full"
            >
              {skill}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{skills.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Select Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id, name);
        }}
        variant={selected ? 'default' : 'ghost'}
        className={`w-full transition-all duration-200 text-sm sm:text-base ${
          selected
            ? 'bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white'
            : 'text-[#0C53ED] hover:bg-[#EAF2FF] hover:text-[#0C53ED]'
        }`}
        disabled={!isAvailable}
      >
        {selected ? 'Selected' : isAvailable ? 'Select Cleaner' : 'Not Available'}
      </Button>
    </li>
  );
}
