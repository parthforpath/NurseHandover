import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6">
          <div className="bg-alert-red/10 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
            <LogOut className="h-6 w-6 text-alert-red" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Logout Confirmation</h3>
            <p className="text-slate-600">
              Are you sure you want to logout? Any unsaved recordings will be lost.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-alert-red hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
