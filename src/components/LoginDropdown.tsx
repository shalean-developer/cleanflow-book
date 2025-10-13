import React, { useState } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/booking/AuthModal';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LoginDropdownProps {
  isMobile?: boolean;
}

export function LoginDropdown({ isMobile = false }: LoginDropdownProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleLoginClick = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`bg-black text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 ${isMobile ? 'w-full rounded-lg' : 'rounded-full'}`}
          >
            <User className="mr-2 h-4 w-4" />
            Login
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLoginClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignUpClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-md">
        <AuthModal initialTab={authMode} />
      </DialogContent>
    </Dialog>
  );
}
