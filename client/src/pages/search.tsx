import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [ward, setWard] = useState('');
  const [status, setStatus] = useState('');

  // Get initial search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients/search', { query: searchQuery, ward, status }],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(ward && { ward }),
        ...(status && { status })
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return response.json();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search by updating query parameters
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-healthcare-green/10 text-healthcare-green';
      case 'discharged': return 'bg-slate-100 text-slate-700';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-700';
    }
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
          <h1 className="text-xl font-bold text-slate-800">Search Patients</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient ID (e.g. P001), Name (e.g. John Doe), or Nurse ID (e.g. N001)"
              className="pl-12"
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
          </div>
          
          <div className="flex space-x-3">
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Wards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Wards</SelectItem>
                <SelectItem value="3A">Ward 3A</SelectItem>
                <SelectItem value="3B">Ward 3B</SelectItem>
                <SelectItem value="4A">Ward 4A</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Enter a search query'}
          </h2>
          
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">Searching...</p>
              </CardContent>
            </Card>
          )}
          
          {patients?.map((patient: any) => (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation(`/patient/${patient.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-medical-blue/10 rounded-full p-3">
                      <User className="h-5 w-5 text-medical-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{patient.name}</h3>
                      <p className="text-sm text-slate-600">ID: {patient.patientId}</p>
                      <p className="text-sm text-slate-600">{patient.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      Admission: {new Date(patient.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {patients && patients.length === 0 && searchQuery && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No patients found matching your search</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
