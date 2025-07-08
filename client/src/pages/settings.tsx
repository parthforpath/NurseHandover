import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Fan, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LogoutModal } from '@/components/logout-modal';

export default function Settings() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [settings, setSettings] = useState({
    theme: 'light',
    autoSave: true,
    notifications: true,
    autoLogout: '30',
    biometric: false
  });

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="pb-20 bg-light-bg min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/dashboard')}
            className="text-medical-blue hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        </div>
        
        <div className="space-y-6">
          {/* App Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">App Preferences</h3>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Theme</h4>
                      <p className="text-sm text-slate-600">Choose your preferred theme</p>
                    </div>
                    <Select 
                      value={settings.theme} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Auto-save Recordings</h4>
                      <p className="text-sm text-slate-600">Automatically save voice recordings</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Notifications</h4>
                      <p className="text-sm text-slate-600">Enable push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Security</h3>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Auto-logout Timer</h4>
                      <p className="text-sm text-slate-600">Minutes of inactivity before logout</p>
                    </div>
                    <Select 
                      value={settings.autoLogout} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, autoLogout: value }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Biometric Login</h4>
                      <p className="text-sm text-slate-600">Use fingerprint or face recognition</p>
                    </div>
                    <Switch
                      checked={settings.biometric}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, biometric: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Account Actions */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Account</h3>
            <div className="space-y-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-medical-blue" />
                      <span className="font-medium text-slate-800">Export Data</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Fan className="h-5 w-5 text-medical-blue" />
                      <span className="font-medium text-slate-800">Clear Cache</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                  </div>
                </CardContent>
              </Card>
              
              <Button
                onClick={() => setShowLogoutModal(true)}
                className="w-full bg-alert-red hover:bg-red-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
      
      <BottomNavigation />
    </div>
  );
}
