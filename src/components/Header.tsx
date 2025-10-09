import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <img src="/favicon.png" alt="Shalean Logo" className="w-6 h-6" />
            <span>Shalean</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
            <a href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="/locations" className="text-sm font-medium hover:text-primary transition-colors">Locations</a>
            <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact Us</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/contact')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
