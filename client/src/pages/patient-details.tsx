import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Play, Download, User, Clock, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useParams } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';

export default function PatientDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const patientId = params.id;

  const { data: patient } = useQuery({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !!patientId,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }
      
      return response.json();
    }
  });

  const { data: handovers } = useQuery({
    queryKey: [`/api/handovers/patient/${patientId}`],
    enabled: !!patientId,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/handovers/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch handovers');
      }
      
      return response.json();
    }
  });

  const renderISBARSection = (title: string, content: string, color: string, icon: React.ReactNode) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
      <h4 className={`font-medium text-${color}-800 mb-2 flex items-center`}>
        {icon}
        {title}
      </h4>
      <p className={`text-sm text-${color}-700`}>{content}</p>
    </div>
  );

  if (!patient) {
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
            <h1 className="text-xl font-bold text-slate-800">Patient Details</h1>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-500">Loading patient details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-slate-800">Patient Details</h1>
        </div>
        
        {/* Patient Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-medical-blue/10 rounded-full p-4">
                <User className="h-8 w-8 text-medical-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
                <p className="text-slate-600">ID: {patient.patientId}</p>
                <p className="text-slate-600">{patient.room}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Age:</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-slate-600">Gender:</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-slate-600">Admission Date:</p>
                <p className="font-medium">
                  {new Date(patient.admissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Attending Physician:</p>
                <p className="font-medium">{patient.attendingPhysician}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ISBAR Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">ISBAR Reports</h2>
            <Button className="bg-medical-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Handover
            </Button>
          </div>
          
          {handovers?.map((handover: any) => (
            <Card key={handover.id}>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Handover Report #{handover.id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {new Date(handover.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {handover.audioPath && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                {handover.status === 'complete' && handover.isbarReport ? (
                  <div className="space-y-4">
                    {renderISBARSection(
                      'Identify',
                      handover.isbarReport.identify || 'No data available',
                      'red',
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    {renderISBARSection(
                      'Situation',
                      handover.isbarReport.situation || 'No data available',
                      'blue',
                      <Clock className="h-4 w-4 mr-2" />
                    )}
                    {renderISBARSection(
                      'Background',
                      handover.isbarReport.background || 'No data available',
                      'green',
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    {renderISBARSection(
                      'Assessment',
                      handover.isbarReport.assessment || 'No data available',
                      'yellow',
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    {renderISBARSection(
                      'Recommendation',
                      handover.isbarReport.recommendation || 'No data available',
                      'purple',
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">
                      {handover.status === 'processing' ? 'Processing handover...' : 
                       handover.status === 'error' ? 'Error processing handover' : 
                       'Handover data not available'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {(!handovers || handovers.length === 0) && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No handover reports found for this patient</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
