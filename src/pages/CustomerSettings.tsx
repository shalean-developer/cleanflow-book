import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, CreditCard, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerSidebar } from '@/components/CustomerSidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CustomerSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    sms: false
  });
  const [darkMode, setDarkMode] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`);
  };

  const handleDeactivate = () => {
    toast.info('Account deactivation feature coming soon');
  };

  const handleDeleteAccount = () => {
    toast.info('Account deletion feature coming soon');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CustomerSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b flex items-center px-4 sm:px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage how you receive updates about your bookings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label htmlFor="whatsapp-notifications" className="text-base font-medium">WhatsApp Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get instant updates on WhatsApp</p>
                    </div>
                    <Switch
                      id="whatsapp-notifications"
                      checked={notifications.whatsapp}
                      onCheckedChange={(checked) => handleNotificationChange('whatsapp', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications" className="text-base font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text message updates</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>Manage your payment methods</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">No saved payment method</p>
                        <p className="text-sm text-muted-foreground">Add a payment method for faster checkout</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => toast.info('Payment management coming soon')}>
                      Add Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Theme */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize how Shalean looks for you</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={(checked) => {
                        setDarkMode(checked);
                        toast.info('Theme switching coming soon');
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>Manage your account security and data</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          Deactivate Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your account will be temporarily deactivated. You can reactivate it anytime by logging in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeactivate}>Deactivate</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full justify-start">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. All your data, bookings, and account information will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default CustomerSettings;
