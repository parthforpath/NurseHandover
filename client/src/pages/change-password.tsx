import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function ChangePassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
        });
        setLocation('/profile');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-light-bg p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/profile')}
            className="mr-4 text-medical-blue hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Change Password</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Update Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-slate-600">Password must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}