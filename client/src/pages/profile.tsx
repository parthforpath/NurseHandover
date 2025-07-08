import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Lock, BarChart, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

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
          <h1 className="text-xl font-bold text-slate-800">Profile</h1>
        </div>
        
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-medical-blue/10 rounded-full p-6">
                <UserCheck className="h-12 w-12 text-medical-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
                <p className="text-slate-600">{user?.role}</p>
                <p className="text-slate-600">{user?.department}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Employee ID:</p>
                <p className="font-medium">{user?.employeeId}</p>
              </div>
              <div>
                <p className="text-slate-600">Shift:</p>
                <p className="font-medium">{user?.shift}</p>
              </div>
              <div>
                <p className="text-slate-600">Department:</p>
                <p className="font-medium">{user?.department}</p>
              </div>
              <div>
                <p className="text-slate-600">Role:</p>
                <p className="font-medium">{user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-slate-600 mb-2">Total Handovers</h3>
              <p className="text-2xl font-bold text-slate-800">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-slate-600 mb-2">This Month</h3>
              <p className="text-2xl font-bold text-slate-800">-</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit className="h-5 w-5 text-medical-blue" />
                  <span className="font-medium text-slate-800">Edit Profile</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-medical-blue" />
                  <span className="font-medium text-slate-800">Change Password</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart className="h-5 w-5 text-medical-blue" />
                  <span className="font-medium text-slate-800">View Reports</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
