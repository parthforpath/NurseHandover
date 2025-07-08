import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions.",
          variant: "default",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-light-bg px-8 py-12">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Email Sent!</h2>
          <p className="text-slate-600 mb-8">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your email and follow the instructions to reset your password.
          </p>
          <Button
            onClick={() => setLocation('/login')}
            className="w-full bg-medical-blue hover:bg-blue-700 mb-4"
          >
            Back to Login
          </Button>
          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full"
          >
            Resend Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-light-bg px-8 py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/login')}
            className="mr-4 text-medical-blue hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Forgot Password</h1>
        </div>
        
        <div className="text-center mb-8">
          <div className="bg-medical-blue/10 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-medical-blue" />
          </div>
          <p className="text-slate-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-medical-blue hover:bg-blue-700"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Remember your password?{' '}
            <Button
              variant="link"
              onClick={() => setLocation('/login')}
              className="text-medical-blue hover:text-blue-700 p-0 h-auto"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}