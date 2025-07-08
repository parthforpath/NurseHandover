import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, UserRound, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { RecordingModal } from '@/components/recording-modal';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getQueryFn } from '@/lib/queryClient';

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: getQueryFn({ on401: 'throw' })
  });

  const { data: recentHandovers } = useQuery({
    queryKey: ['/api/handovers/recent'],
    queryFn: getQueryFn({ on401: 'throw' })
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-healthcare-green/10 text-healthcare-green';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="pb-20 bg-light-bg min-h-screen">
      {/* Header */}
      <div className="bg-medical-blue text-white p-6 rounded-b-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">
              Good morning, {user?.name || 'Nurse'}
            </h1>
            <p className="text-blue-100 text-sm">{user?.department} - {user?.shift}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/profile')}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-blue-100 focus:bg-white/30"
            placeholder="Search patients..."
          />
          <Search className="absolute right-3 top-3 h-5 w-5 text-blue-100" />
        </form>
      </div>
      
      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Today's Handovers</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats?.todayHandovers || 0}
                </p>
              </div>
              <div className="bg-healthcare-green/10 rounded-full p-3">
                <Mic className="h-5 w-5 text-healthcare-green" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Handovers</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats?.totalHandovers || 0}
                </p>
              </div>
              <div className="bg-medical-blue/10 rounded-full p-3">
                <UserRound className="h-5 w-5 text-medical-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Handovers */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Handovers</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/handovers')}
            className="text-medical-blue border-medical-blue hover:bg-medical-blue hover:text-white"
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentHandovers?.map((handover: any) => (
            <Card key={handover.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-medical-blue/10 rounded-full p-2">
                      <User className="h-4 w-4 text-medical-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {handover.patient?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {handover.patient?.room || 'No room assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {new Date(handover.createdAt).toLocaleTimeString()}
                    </p>
                    <Badge className={getStatusColor(handover.status)}>
                      {handover.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!recentHandovers || recentHandovers.length === 0) && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No recent handovers found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-10">
        <Button
          onClick={() => setIsRecordingModalOpen(true)}
          className="bg-alert-red hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>
      
      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        patientId={1} // This should be selected by user
        patientName="Select Patient"
      />
      
      <BottomNavigation />
    </div>
  );
}
