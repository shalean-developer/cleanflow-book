import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageManager } from '@/components/StorageManager';
import { StorageHealthCheck } from '@/components/StorageHealthCheck';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, profile, signOut, isAdmin, isCleaner } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and app preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {user?.email || 'Not available'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                User ID
              </label>
              <p className="text-sm text-gray-900 dark:text-white font-mono">
                {user?.id || 'Not available'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="flex items-center gap-2">
                {isAdmin && <Shield className="h-4 w-4 text-red-500" />}
                <p className="text-sm text-gray-900 dark:text-white capitalize">
                  {profile?.role || 'customer'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Created
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Storage Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Storage Management
            </CardTitle>
            <CardDescription>
              Clear corrupted data that might be causing app issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StorageManager />
          </CardContent>
        </Card>

        {/* Storage Health Check */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Storage Health Status</CardTitle>
            <CardDescription>
              Automatic detection of storage issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StorageHealthCheck />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions and troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/admin')}
                  className="justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => navigate('/booking/quote')}
                className="justify-start"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                New Booking
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
