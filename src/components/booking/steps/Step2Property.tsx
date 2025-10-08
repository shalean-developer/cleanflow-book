import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { ExtraCard } from '../ExtraCard';
import { Minus, Plus } from 'lucide-react';
interface Step2PropertyProps {
  onNext: () => void;
  onBack: () => void;
}
export const Step2Property = ({
  onNext,
  onBack
}: Step2PropertyProps) => {
  const {
    bookingData,
    updateBooking
  } = useBooking();
  const [extras, setExtras] = useState<any[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set(bookingData.extras.map(e => e.id)));
  useEffect(() => {
    fetchExtras();
  }, []);
  const fetchExtras = async () => {
    const {
      data
    } = await supabase.from('extras').select('*').eq('active', true);
    if (data) setExtras(data);
  };
  const handleExtraToggle = (extra: any) => {
    const newSelected = new Set(selectedExtras);
    if (newSelected.has(extra.id)) {
      newSelected.delete(extra.id);
    } else {
      newSelected.add(extra.id);
    }
    setSelectedExtras(newSelected);
    const extrasArray = extras.filter(e => newSelected.has(e.id)).map(e => ({
      id: e.id,
      name: e.name,
      price: e.base_price
    }));
    updateBooking({
      extras: extrasArray
    });
  };
  const updateCount = (field: 'bedrooms' | 'bathrooms', delta: number) => {
    const current = bookingData[field];
    const min = field === 'bathrooms' ? 1 : 0;
    const max = field === 'bedrooms' ? 8 : 6;
    const newValue = Math.max(min, Math.min(max, current + delta));
    updateBooking({
      [field]: newValue
    });
  };
  return <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Property Details</h2>
        <p className="text-muted-foreground">Tell us about your property</p>
      </div>

      <div className="space-y-6">
        

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Label>Bedrooms</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="icon" onClick={() => updateCount('bedrooms', -1)} disabled={bookingData.bedrooms === 0}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold w-12 text-center">{bookingData.bedrooms}</span>
              <Button variant="outline" size="icon" onClick={() => updateCount('bedrooms', 1)} disabled={bookingData.bedrooms === 8}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Bathrooms</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="icon" onClick={() => updateCount('bathrooms', -1)} disabled={bookingData.bathrooms === 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold w-12 text-center">{bookingData.bathrooms}</span>
              <Button variant="outline" size="icon" onClick={() => updateCount('bathrooms', 1)} disabled={bookingData.bathrooms === 6}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-lg">Add Extras</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {extras.map(extra => <ExtraCard key={extra.id} extra={extra} selected={selectedExtras.has(extra.id)} onToggle={() => handleExtraToggle(extra)} />)}
          </div>
        </div>

        <div>
          <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
          <Textarea id="specialInstructions" placeholder="Any special requests or instructions..." value={bookingData.specialInstructions || ''} onChange={e => updateBooking({
          specialInstructions: e.target.value
        })} className="mt-2" rows={3} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="min-w-[200px]">
          Continue
        </Button>
      </div>
    </div>;
};