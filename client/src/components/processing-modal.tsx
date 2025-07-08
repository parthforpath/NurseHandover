import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Check } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProcessingModal({ isOpen, onClose }: ProcessingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6">
          <div className="bg-medical-blue/10 rounded-full p-6 mx-auto w-20 h-20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-medical-blue animate-spin" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Handover</h3>
            <p className="text-slate-600">
              Converting speech to text and generating ISBAR report...
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-healthcare-green rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-600">Audio recorded</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-healthcare-green rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-600">Transcription complete</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-600">Generating ISBAR report...</span>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500">This may take a few moments</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
