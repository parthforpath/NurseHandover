import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Clock, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { BottomNavigation } from '@/components/bottom-navigation';
import { format, isToday, isYesterday } from 'date-fns';

interface Handover {
  id: number;
  patientId: number;
  nurserId: number;
  audioPath: string;
  transcription: string;
  isbarReport: any;
  status: string;
  createdAt: string;
  patient: {
    id: number;
    name: string;
    patientId: string;
    room: string;
  };
  nurse: {
    id: number;
    name: string;
    employeeId: string;
  };
}

export default function HandoversPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const { data: myHandovers, isLoading: myHandoversLoading } = useQuery({
    queryKey: ['/api/handovers/my'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/handovers/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch handovers');
      return response.json();
    }
  });

  const { data: allHandovers, isLoading: allHandoversLoading } = useQuery({
    queryKey: ['/api/handovers/all'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/handovers/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch handovers');
      return response.json();
    }
  });

  const exportHandovers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/handovers/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `handovers_${user?.employeeId}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const groupHandoversByDate = (handovers: Handover[]) => {
    const grouped: { [key: string]: Handover[] } = {};
    
    handovers.forEach(handover => {
      const date = new Date(handover.createdAt);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(handover);
    });
    
    // Sort handovers within each date group by time (latest first)
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
    
    return grouped;
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderHandoversList = (handovers: Handover[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!handovers || handovers.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No handovers found</p>
          </CardContent>
        </Card>
      );
    }

    const groupedHandovers = groupHandoversByDate(handovers);
    const sortedDates = Object.keys(groupedHandovers).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
      <div className="space-y-4">
        {sortedDates.map(date => (
          <div key={date} className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => toggleDateExpansion(date)}
              className="w-full justify-between p-3 h-auto text-left"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">{getDateLabel(date)}</span>
                <Badge variant="secondary" className="text-xs">
                  {groupedHandovers[date].length}
                </Badge>
              </div>
              {expandedDates.has(date) ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
            
            {expandedDates.has(date) && (
              <div className="space-y-2 ml-4">
                {groupedHandovers[date].map(handover => (
                  <Card key={handover.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{handover.patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {handover.patient.room} • ID: {handover.patient.patientId}
                          </p>
                        </div>
                        <Badge className={getStatusColor(handover.status)}>
                          {handover.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{handover.nurse.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(handover.createdAt), 'HH:mm')}</span>
                        </div>
                      </div>
                      
                      {handover.transcription && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {handover.transcription.substring(0, 100)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-20 bg-light-bg min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/dashboard')}
              className="text-medical-blue hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-800">Handovers</h1>
          </div>
          
          <Button
            onClick={exportHandovers}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        <Tabs defaultValue="my" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my">My Recent</TabsTrigger>
            <TabsTrigger value="all">All Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">My Handovers</h2>
              <p className="text-sm text-gray-500">
                {myHandovers?.length || 0} handovers
              </p>
            </div>
            {renderHandoversList(myHandovers || [], myHandoversLoading)}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">All Team Handovers</h2>
              <p className="text-sm text-gray-500">
                {allHandovers?.length || 0} handovers
              </p>
            </div>
            {renderHandoversList(allHandovers || [], allHandoversLoading)}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
}