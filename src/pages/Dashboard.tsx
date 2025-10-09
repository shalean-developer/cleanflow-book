import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    // Don't do anything while still loading
    if (loading) return;

    // Redirect to auth if no user
    if (!user) {
      navigate('/auth');
      return;
    }

    // Once user is loaded and we're not loading anymore, redirect based on role
    // Default to customer if no role is found
    if (user) {
      const targetRole = userRole || 'customer';
      switch (targetRole) {
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
