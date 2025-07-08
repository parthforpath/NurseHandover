import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function EditProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    shift: user?.shift || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        setLocation('/profile');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData(prev => ({ ...prev, shift: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day (7am - 7pm)</SelectItem>
                    <SelectItem value="Night">Night (7pm - 7am)</SelectItem>
                    <SelectItem value="Morning">Morning (6am - 2pm)</SelectItem>
                    <SelectItem value="Evening">Evening (2pm - 10pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}