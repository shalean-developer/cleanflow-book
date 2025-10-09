import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }

    if (user && userRole && !loading) {
      // Redirect to role-specific dashboard
      switch (userRole) {
        case 'admin':
          navigate('/dashboard/admin', { replace: true });
          break;
        case 'cleaner':
          navigate('/dashboard/cleaner', { replace: true });
          break;
        case 'customer':
        default:
          navigate('/dashboard/customer', { replace: true });
          break;
      }
    }
  }, [user, userRole, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-pulse">Loading your dashboard...</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
