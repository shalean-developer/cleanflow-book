import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface ExtraCardProps {
  extra: {
    id: string;
    name: string;
    icon: string;
    description: string;
    base_price: number;
  };
  selected: boolean;
  onToggle: () => void;
}

export const ExtraCard = ({ extra, selected, onToggle }: ExtraCardProps) => {
  const IconComponent = (Icons as any)[extra.icon] || Icons.Sparkles;
  
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md relative',
        selected && 'ring-2 ring-primary bg-primary/5'
      )}
      onClick={onToggle}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          selected ? 'bg-primary/20' : 'bg-muted'
        )}>
          <IconComponent className={cn('w-6 h-6', selected ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        
        <div>
          <h4 className="font-semibold text-sm">{extra.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">{extra.description}</p>
          <p className="text-sm font-bold text-primary mt-2">R {extra.base_price}</p>
        </div>
      </div>
    </Card>
  );
};
