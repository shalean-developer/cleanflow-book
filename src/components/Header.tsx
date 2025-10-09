import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background z-50" align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Log In
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
