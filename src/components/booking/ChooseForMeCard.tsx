import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, UserCircle, Star } from 'lucide-react';

interface ChooseForMeCardProps {
  onSelect: () => void;
}

export function ChooseForMeCard({ onSelect }: ChooseForMeCardProps) {
  return (
    <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UserCircle className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold mb-2">Choose for me</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp className="w-4 h-4" />
                97% Recommend
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-4 h-4" />
                2+ Years Experience
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Our team will find a worker that can help you. Keep an eye on your inbox. We'll send you your match soon.
          </p>
          
          <Button 
            onClick={onSelect} 
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Let Shalean Choose For Me
          </Button>
        </div>
      </div>
    </Card>
  );
}
