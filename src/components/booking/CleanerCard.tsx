import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar } from 'lucide-react';

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

  return (
    <Card className={`cursor-pointer transition-all ${selected ? 'border-primary ring-2 ring-primary' : 'hover:border-primary'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{serviceAreas.join(', ')}</span>
            </div>

            {!isAvailable && nextAvailable && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                Next: {nextAvailable}
              </Badge>
            )}

            <Button
              onClick={() => onSelect(id, name)}
              variant={selected ? 'default' : 'outline'}
              className="w-full"
              disabled={!isAvailable}
            >
              {selected ? 'Selected' : isAvailable ? 'Select Cleaner' : 'Not Available'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
