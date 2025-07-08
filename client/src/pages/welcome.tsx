import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Mic, FileText, Database } from 'lucide-react';

export default function Welcome() {
  const [, setLocation] = useLocation();

  const features = [
    { icon: Mic, text: 'Record voice handovers' },
    { icon: FileText, text: 'Generate ISBAR reports' },
    { icon: Database, text: 'Secure patient data' }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-medical-blue to-blue-600 text-white p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="bg-white/20 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center">
          <Mic className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold">NurseScript</h1>
        
        <p className="text-lg text-blue-100">
          Streamline your nursing handovers with voice-to-text technology
        </p>
        
        <div className="space-y-4 pt-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <feature.icon className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100">{feature.text}</span>
            </div>
          ))}
        </div>
        
        <Button
          onClick={() => setLocation('/login')}
          className="w-full bg-white text-medical-blue font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-50 transition-colors mt-8"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
