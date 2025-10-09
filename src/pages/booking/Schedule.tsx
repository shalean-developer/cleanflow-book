import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickySummary } from '@/components/booking/StickySummary';
import { HorizontalDatePicker } from '@/components/booking/HorizontalDatePicker';
import { generateTimeSlots, filterPastSlots } from '@/utils/timeSlots';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Schedule() {
  const navigate = useNavigate();
  const { booking, setSchedule } = useBookingStore();

  const [date, setDate] = useState<Date | undefined>(
    booking.date ? new Date(booking.date) : undefined
  );
  const [time, setTime] = useState(booking.time || '');
  const [frequency, setFrequency] = useState(booking.frequency);
  const [location, setLocation] = useState(booking.location || '');

  const allSlots = generateTimeSlots();
  const availableSlots = date ? filterPastSlots(format(date, 'yyyy-MM-dd'), allSlots) : allSlots;

  useEffect(() => {
    if (!booking.serviceId) {
      navigate('/booking/service/select');
    }
  }, [booking.serviceId, navigate]);

  const handleContinue = () => {
    if (date && time && location) {
      setSchedule(format(date, 'yyyy-MM-dd'), time, frequency, location);
      navigate('/booking/cleaner');
    }
  };

  const isComplete = date && time && location;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Schedule Your Cleaning</h1>
                <p className="text-muted-foreground">Choose your preferred date, time, and location</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose a date for your cleaning service</CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <HorizontalDatePicker
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </CardContent>
              </Card>

              {date && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Time</CardTitle>
                    <CardDescription>Available times between 07:00 - 13:00</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={time === slot ? 'default' : 'outline'}
                          onClick={() => setTime(slot)}
                          className="w-full"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Frequency</CardTitle>
                  <CardDescription>How often would you like cleaning service?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="weekly">Weekly (15% discount)</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly (10% discount)</SelectItem>
                      <SelectItem value="monthly">Monthly (5% discount)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Enter your service address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="location">Address</Label>
                    <Input
                      id="location"
                      placeholder="Enter your full address (e.g., 123 Main St, Sandton, Johannesburg)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleContinue} size="lg" className="w-full md:w-auto" disabled={!isComplete}>
                Continue to Select Cleaner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="lg:block hidden">
              <StickySummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
