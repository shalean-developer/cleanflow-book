import { Star, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import lucyCapriImg from '@/assets/lucy-capri.webp';
import normatterImg from '@/assets/normatter.webp';
import nyashaImg from '@/assets/nyasha.webp';

// Map photo URLs to imported images
const photoMap: Record<string, string> = {
  'lucy-capri.webp': lucyCapriImg,
  'normatter.webp': normatterImg,
  'nyasha.webp': nyashaImg,
};

interface CleanerCardProps {
  cleaner: {
    id: string;
    full_name: string;
    photo_url?: string;
    rating: number;
    bio: string;
  };
  availableDays?: string[];
  selected: boolean;
  onSelect: () => void;
}

export const CleanerCard = ({ cleaner, availableDays, selected, onSelect }: CleanerCardProps) => {
  const photoSrc = cleaner.photo_url ? photoMap[cleaner.photo_url] : null;
  
  return (
    <Card
      className={cn(
        'p-6 cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary bg-primary/5'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        {photoSrc ? (
          <img 
            src={photoSrc} 
            alt={cleaner.full_name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-2xl font-bold text-primary-foreground flex-shrink-0">
            {cleaner.full_name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-lg">{cleaner.full_name}</h4>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{cleaner.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">{cleaner.bio}</p>
          
          {availableDays && availableDays.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {availableDays.map(day => (
                <Badge key={day} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
