import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Sparkles, BadgeDollarSign, ShieldCheck, ArrowUpRight, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
};

interface HeaderProps {
  nav?: NavItem[];
  ctaText?: string;
  onCtaClick?: () => void;
  logo?: React.ReactNode;
}

const defaultNavItems: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/services', label: 'Services', icon: Sparkles },
  { to: '/how-it-works', label: 'How It Works', icon: ShieldCheck },
  { to: '/locations', label: 'Locations', icon: BadgeDollarSign },
];

export const Header: React.FC<HeaderProps> = ({
  nav = defaultNavItems,
  ctaText = 'Get Free Quote',
  onCtaClick,
  logo,
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/booking/quote');
    }
  };

  const NavItem: React.FC<{ item: NavItem }> = ({ item: { to, label, icon: Icon } }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isActive
            ? 'bg-primary text-white'
            : 'bg-white/70 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:bg-gray-800/70 dark:border-gray-700 dark:hover:bg-gray-800'
        )
      }
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            {logo || (
              <>
                <img src="/favicon.png" alt="Shalean Logo" className="w-6 h-6" />
                <span>Shalean</span>
              </>
            )}
          </div>
          
          <nav className="flex flex-col gap-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t">
            <Button
              onClick={handleCtaClick}
              className="w-full bg-lime-300 text-gray-900 font-medium hover:bg-lime-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'shadow-md border-b border-gray-200/70 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 dark:border-gray-700/70'
          : 'backdrop-blur-sm bg-white/95 dark:bg-gray-900/95'
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 font-semibold text-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            {logo || (
              <>
                <img src="/favicon.png" alt="Shalean Logo" className="w-7 h-7" />
                <span>Shalean</span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">
            {nav.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          {/* CTA Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <MobileNav />

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                onClick={handleCtaClick}
                className="bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-2"
              >
                {ctaText}
              </Button>
              <Button
                size="sm"
                className="bg-black text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 rounded-full w-8 h-8 p-0 ml-1"
                aria-label="Arrow action"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};