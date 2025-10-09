import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Phone, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerSidebar } from '@/components/CustomerSidebar';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    subject: '',
    message: ''
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent.');
      setFormData({
        name: '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
      setSubmitting(false);
    }, 1000);
  };

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      value: '+27 68 498 4179',
      action: () => window.open('tel:+27684984179'),
      buttonText: 'Call Now'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      value: 'Quick Response',
      action: () => window.open('https://wa.me/27684984179', '_blank'),
      buttonText: 'Open WhatsApp'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email',
      value: 'info@shalean.com',
      action: () => window.open('mailto:info@shalean.com'),
      buttonText: 'Send Email'
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CustomerSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b flex items-center px-4 sm:px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold">Support & Help</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Contact Options */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactOptions.map((option) => (
                    <Card key={option.title} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-primary/10">
                            <option.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{option.title}</CardTitle>
                            <CardDescription className="text-xs">{option.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="font-medium">{option.value}</p>
                        <Button 
                          onClick={option.action}
                          className="w-full"
                        >
                          {option.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Support Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">How do I reschedule a booking?</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to your Bookings page, find the booking you want to reschedule, and click the calendar icon. 
                      You can then select a new date and time.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What payment methods do you accept?</h4>
                    <p className="text-sm text-muted-foreground">
                      We accept all major credit cards, debit cards, and online payment methods through our secure payment gateway.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Can I request a specific cleaner?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! During the booking process, you can select your preferred cleaner based on availability and ratings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What is your cancellation policy?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can cancel or reschedule your booking up to 24 hours before the scheduled time without any charges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerSupport;
