import { Button } from '@/components/ui/button';
import { Check, Star, Sparkles } from 'lucide-react';

interface ChooseForMeCardProps {
  onSelect: () => void;
}

export function ChooseForMeCard({ onSelect }: ChooseForMeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#0C53ED]/20 shadow-md p-5 md:p-6">
      <div className="flex items-start gap-4">
        {/* Icon Badge with Gradient */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-3">Choose for me</h3>
            
            {/* Trust Metrics Row */}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-[#475569]">
                <Check className="w-4 h-4 text-green-500" />
                <span className="font-medium">97% Recommend</span>
              </span>
              <span className="flex items-center gap-1 text-[#475569]">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">4.8 avg rating</span>
              </span>
              <span className="flex items-center gap-1 text-[#475569]">
                <Sparkles className="w-4 h-4 text-[#0C53ED]" />
                <span className="font-medium">2+ years</span>
              </span>
            </div>
          </div>
          
          <p className="text-[#475569] leading-relaxed">
            Our team will find a worker that can help you. Keep an eye on your inbox. We'll send you your match soon.
          </p>
          
          <Button 
            onClick={onSelect} 
            variant="outline"
            className="w-full border-[#0C53ED]/30 text-[#0C53ED] hover:bg-[#EAF2FF] hover:border-[#0C53ED]/50 transition-all duration-200"
          >
            Let Shalean Choose For Me
          </Button>
        </div>
      </div>
    </div>
  );
}
