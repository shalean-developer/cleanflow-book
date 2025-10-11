import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Home, Zap, Move, Building } from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';

interface ServiceCardProps {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
}

// Service-specific icons mapping
const getServiceIcon = (slug: string) => {
  switch (slug) {
    case 'standard-cleaning':
      return Home;
    case 'deep-cleaning':
      return Sparkles;
    case 'move-in-out':
      return Move;
    case 'airbnb-cleaning':
      return Building;
    default:
      return Home;
  }
};

export function ServiceCard({ slug, name, description, basePrice }: ServiceCardProps) {
  const Icon = getServiceIcon(slug);
  const isStandardCleaning = slug === 'standard-cleaning';

  return (
    <article 
      className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:border-[#0C53ED]/20 hover:-translate-y-0.5 transition-all duration-300 p-5 md:p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#0C53ED] focus-within:ring-offset-2"
      role="button"
      tabIndex={0}
      aria-label={`Select ${name} service`}
    >
      {/* Top Row: Icon, Title, Description */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Service Icon with Gradient Background */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          {/* Service Name and Popular Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-[#0F172A] truncate">{name}</h3>
              {isStandardCleaning && (
                <span className="px-2 py-1 text-xs font-medium text-[#0C53ED] bg-[#0C53ED]/10 rounded-full">
                  Most popular
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#475569] text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Price Block */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-[#0F172A] tabular-nums">
          {formatCurrencyZAR(basePrice)}
          <span className="text-sm font-normal text-[#475569] ml-1">from</span>
        </div>
      </div>

      {/* CTA Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/booking/service/${slug}`} className="flex-1">
          <Button 
            className="w-full bg-[#0C53ED] hover:bg-[#0C53ED]/90 hover:brightness-110 transition-all duration-200 group/btn"
            size="sm"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          className="sm:w-auto border-[#0C53ED]/20 text-[#0C53ED] hover:bg-[#0C53ED]/5 hover:border-[#0C53ED]/30"
          size="sm"
          asChild
        >
          <Link to={`/booking/service/${slug}`}>
            Select
          </Link>
        </Button>
      </div>
    </article>
  );
}
