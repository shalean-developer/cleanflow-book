import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>

        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Your booking dashboard is coming soon. Here you'll be able to view and manage all your bookings.
          </p>
          <Button onClick={() => navigate('/booking')}>
            Book a Service
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
