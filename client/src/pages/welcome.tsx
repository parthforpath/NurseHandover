import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Mic, FileText, Database, Users, Shield, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      icon: Mic,
      title: "Voice-Powered Handovers",
      description: "Record handovers with your voice and get instant transcriptions using AI technology",
      features: ["Real-time voice recording", "AI transcription", "Hands-free operation"],
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: FileText,
      title: "ISBAR Reports",
      description: "Generate structured ISBAR reports automatically from your voice recordings",
      features: ["AI-powered analysis", "Structured reporting", "Medical compliance"],
      gradient: "from-emerald-600 to-emerald-700"
    },
    {
      icon: Database,
      title: "Secure & Organized",
      description: "Keep all patient handovers secure and easily searchable in one place",
      features: ["HIPAA compliant", "Searchable database", "Audit trails"],
      gradient: "from-purple-600 to-purple-700"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share handovers with your team and maintain continuity of care",
      features: ["Team sharing", "Real-time updates", "Shift coordination"],
      gradient: "from-orange-600 to-orange-700"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">NurseScript</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => setLocation('/login')}
            className="text-blue-600 hover:text-blue-700"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Main Slider */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-br ${currentSlideData.gradient} text-white relative`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 hidden sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 hidden sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide Content */}
          <div className="h-full flex flex-col justify-center items-center px-8 py-16">
            <div className="text-center space-y-8 max-w-md">
              <div className="bg-white/20 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
                <currentSlideData.icon className="h-16 w-16 text-white" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{currentSlideData.title}</h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>
              
              <div className="space-y-3">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white px-6 py-8">
        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => setLocation('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg shadow-lg transition-colors"
          >
            Get Started
          </Button>
          
          <Button
            onClick={() => setLocation('/register')}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 rounded-lg"
          >
            New Employee? Register
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Secure • HIPAA Compliant • Healthcare Grade</p>
        </div>
      </div>
    </div>
  );
}
