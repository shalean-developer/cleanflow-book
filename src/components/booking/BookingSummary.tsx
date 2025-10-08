import { Calendar, MapPin, User, Clock, Sparkles } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export const BookingSummary = () => {
  const { bookingData } = useBooking();

  return (
    <Card className="p-6 space-y-4 sticky top-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Booking Summary
      </h3>
      
      <div className="space-y-3 text-sm">
        {bookingData.serviceName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium">{bookingData.serviceName}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bedrooms</span>
          <span className="font-medium">{bookingData.bedrooms}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bathrooms</span>
          <span className="font-medium">{bookingData.bathrooms}</span>
        </div>
        
        {bookingData.extras.length > 0 && (
          <div>
            <div className="text-muted-foreground mb-1">Extras</div>
            {bookingData.extras.map((extra) => (
              <div key={extra.id} className="flex justify-between text-xs pl-2">
                <span>{extra.name}</span>
                <span>R {extra.price}</span>
              </div>
            ))}
          </div>
        )}
        
        {bookingData.date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(bookingData.date, 'PPP')}</span>
          </div>
        )}
        
        {bookingData.time && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{bookingData.time}</span>
          </div>
        )}
        
        {bookingData.areaName && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{bookingData.areaName}</span>
          </div>
        )}
        
        {bookingData.cleanerName && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{bookingData.cleanerName}</span>
          </div>
        )}
        
        <div className="pt-3 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">R {bookingData.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
