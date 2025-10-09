import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';

interface ServiceCardProps {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
}

export function ServiceCard({ slug, name, description, basePrice }: ServiceCardProps) {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-primary">
          {formatCurrencyZAR(basePrice)}
          <span className="text-sm text-muted-foreground font-normal"> from</span>
        </div>
        <Link to={`/booking/service/${slug}`}>
          <Button className="w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
