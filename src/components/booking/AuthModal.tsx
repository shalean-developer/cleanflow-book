import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  initialTab?: 'signin' | 'signup' | 'magic';
}

export function AuthModal({ initialTab = 'signin' }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'magic'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signIn, signUp, signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (activeTab !== 'magic' && !password) {
      newErrors.password = 'Password is required';
    } else if (activeTab === 'signup' && password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrors({ general: error.message });
      toast({
        title: 'Error signing in',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Signed in successfully!' });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setErrors({ general: error.message });
      toast({
        title: 'Error signing up',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to confirm your account.',
      });
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const { error } = await signInWithMagicLink(email);
    setLoading(false);

    if (error) {
      setErrors({ general: error.message });
      toast({
        title: 'Error sending magic link',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setMagicLinkSent(true);
      toast({
        title: 'Magic link sent!',
        description: 'Check your email for the login link.',
      });
    }
  };

  const tabs = [
    { id: 'signin' as const, label: 'Sign In' },
    { id: 'signup' as const, label: 'Sign Up' },
    { id: 'magic' as const, label: 'Magic Link' },
  ];

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-7 w-full max-w-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold text-[#0F172A]">Sign in to continue</CardTitle>
        <CardDescription className="text-[#475569]">
          You need to be signed in to complete your booking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabbed Switch */}
        <div className="flex rounded-full bg-[#F3F4F6] p-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrors({});
                setMagicLinkSent(false);
              }}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-[#0C53ED]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">{errors.general}</span>
          </div>
        )}

        {/* Forms */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm font-medium text-[#0F172A]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`pl-9 rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'signin-email-error' : undefined}
                  required
                />
              </div>
              {errors.email && (
                <div id="signin-email-error" className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-sm font-medium text-[#0F172A]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`pl-9 pr-10 rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'signin-password-error' : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <div id="signin-password-error" className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm text-[#475569]">Remember me</Label>
              </div>
              <button
                type="button"
                className="text-sm text-[#0C53ED] hover:text-[#0B47D1] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 shadow-lg hover:bg-[#0B47D1] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium text-[#0F172A]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`pl-9 rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  required
                />
              </div>
              {errors.email && (
                <div id="signup-email-error" className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium text-[#0F172A]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`pl-9 pr-10 rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'signup-password-error' : undefined}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <div id="signup-password-error" className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="text-xs text-[#475569]">
              By signing up, you agree to our{' '}
              <a href="#" className="text-[#0C53ED] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#0C53ED] hover:underline">Privacy Policy</a>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 shadow-lg hover:bg-[#0B47D1] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        )}

        {activeTab === 'magic' && (
          <div>
            {magicLinkSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-[#0F172A]">Check your email!</p>
                  <p className="text-sm text-[#475569]">
                    We've sent a magic link to <span className="font-medium">{email}</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email" className="text-sm font-medium text-[#0F172A]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`pl-9 rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all ${
                        errors.email ? 'border-red-300' : ''
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'magic-email-error' : undefined}
                      required
                    />
                  </div>
                  {errors.email && (
                    <div id="magic-email-error" className="flex items-center gap-1 text-sm text-rose-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 shadow-lg hover:bg-[#0B47D1] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Magic Link
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
