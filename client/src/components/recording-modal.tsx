import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: number;
  patientName?: string;
}

export function RecordingModal({ isOpen, onClose, patientId, patientName }: RecordingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    isRecording, 
    recordingTime, 
    audioBlob, 
    startRecording, 
    stopRecording, 
    resetRecording, 
    formatTime 
  } = useAudio();

  const [isPaused, setIsPaused] = useState(false);

  const uploadHandover = useMutation({
    mutationFn: async (data: { audioBlob: Blob; patientId: number }) => {
      const formData = new FormData();
      formData.append('audio', data.audioBlob, 'handover.wav');
      formData.append('patientId', data.patientId.toString());

      const token = localStorage.getItem('token');
      const response = await fetch('/api/handovers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload handover');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Handover recorded successfully",
        description: "Your handover is being processed and will be available shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/handovers/recent'] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      toast({
        title: "Recording failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveRecording = () => {
    if (audioBlob && patientId) {
      uploadHandover.mutate({ audioBlob, patientId });
    }
  };

  const handleClose = () => {
    resetRecording();
    setIsPaused(false);
    onClose();
  };

  const progressPercentage = Math.min((recordingTime / 300) * 100, 100); // 5 minutes max

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-alert-red/10 rounded-full p-8 flex items-center justify-center">
              <div className={isRecording ? "recording-pulse" : ""}>
                <Mic className="h-8 w-8 text-alert-red" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {isRecording ? 'Recording Handover' : audioBlob ? 'Recording Complete' : 'Start Recording'}
              </h3>
              {patientName && (
                <p className="text-slate-600">Patient: {patientName}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-3xl font-mono font-bold text-slate-800">
              {formatTime(recordingTime)}
            </div>
            
            <div className="bg-slate-200 rounded-full h-2">
              <div 
                className="bg-alert-red rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!isRecording && !audioBlob && (
              <Button
                onClick={handleStartRecording}
                className="bg-alert-red hover:bg-red-700 text-white rounded-full p-4"
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
            
            {isRecording && (
              <>
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant="outline"
                  className="rounded-full p-3"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={handleStopRecording}
                  className="bg-alert-red hover:bg-red-700 text-white rounded-full p-4"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {audioBlob && (
              <div className="flex space-x-3">
                <Button
                  onClick={resetRecording}
                  variant="outline"
                >
                  Re-record
                </Button>
                <Button
                  onClick={handleSaveRecording}
                  disabled={uploadHandover.isPending}
                  className="bg-medical-blue hover:bg-blue-700"
                >
                  {uploadHandover.isPending ? 'Uploading...' : 'Save Handover'}
                </Button>
              </div>
            )}
          </div>

          {isRecording && (
            <div className="text-sm text-slate-600 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-healthcare-green rounded-full animate-pulse" />
              <span>Recording in progress...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
