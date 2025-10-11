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
      className={`bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 p-5 md:p-6 cursor-pointer group ${
        selected 
          ? 'ring-2 ring-[#0C53ED] ring-offset-2 border-[#0C53ED]' 
          : 'hover:ring-2 hover:ring-[#0C53ED]/10 hover:ring-offset-2 hover:-translate-y-1'
      }`}
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id, name)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar with Gradient Ring */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-lg font-semibold text-[#0F172A]">{initials}</span>
            </div>
          </div>
          {selected && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0C53ED] rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Name and Verified Badge */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg text-[#0F172A] truncate">{name}</h3>
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          </div>

          {/* Meta Row: Rating, Experience, Location */}
          <div className="flex items-center gap-4 text-sm text-[#475569] mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </span>
            <span className="font-medium">2+ years exp.</span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" title={serviceAreas.join(', ')}>
                {serviceAreas.length > 1 ? `${serviceAreas[0]} +${serviceAreas.length - 1}` : serviceAreas[0]}
              </span>
            </span>
          </div>

          {/* Availability Chips */}
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const isAvailableDay = availabilityDays.includes(day);
              return (
                <span
                  key={day}
                  className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    isAvailableDay
                      ? 'bg-[#EAF2FF] text-[#0C53ED]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>

          {/* Skills/Tags Row */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-[#475569] rounded-full whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Select Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id, name);
            }}
            variant={selected ? 'default' : 'ghost'}
            className={`w-full transition-all duration-200 ${
              selected
                ? 'bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white'
                : 'text-[#0C53ED] hover:bg-[#EAF2FF] hover:text-[#0C53ED]'
            }`}
            disabled={!isAvailable}
          >
            {selected ? 'Selected' : isAvailable ? 'Select Cleaner' : 'Not Available'}
          </Button>
        </div>
      </div>
    </li>
  );
}
