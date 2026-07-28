import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(50), 300);
    const timer2 = setTimeout(() => setProgress(85), 700);
    const timer3 = setTimeout(() => setProgress(100), 1100);
    const timer4 = setTimeout(() => onFinish(), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#121619] flex flex-col items-center justify-center p-6 select-none">
      <div className="text-center space-y-6 max-w-sm w-full animate-fade-in">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-600/30 to-amber-900/40 border border-amber-600/50 flex items-center justify-center text-amber-400 shadow-2xl">
            <BookOpen className="w-10 h-10" />
          </div>
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-100 tracking-tight">
            CalmReader
          </h1>
          <p className="text-xs font-sans text-stone-400 tracking-wider uppercase font-medium">
            Your Digital Library Anywhere
          </p>
        </div>

        {/* Progress Bar & Status text */}
        <div className="space-y-3 pt-4 max-w-xs mx-auto">
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-stone-500 animate-pulse">
            {progress < 40 && 'Initializing storage sectors...'}
            {progress >= 40 && progress < 85 && 'Verifying offline library packages...'}
            {progress >= 85 && 'Opening CalmReader...'}
          </p>
        </div>

      </div>
    </div>
  );
};
