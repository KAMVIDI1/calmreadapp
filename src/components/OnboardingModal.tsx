import React, { useState } from 'react';
import { BookOpen, DownloadCloud, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      icon: BookOpen,
      title: 'Welcome to CalmReader Library',
      description: 'Your official native companion app. Securely enjoy your purchased books, audiobooks, articles, and video masterclasses offline without distractions.',
      highlight: 'Calm, elegant, and clutter-free.'
    },
    {
      icon: DownloadCloud,
      title: 'Download Once, Read Anywhere',
      description: 'Download your purchased content over Wi-Fi, then step away from the internet. Complete offline access with automated package integrity verification.',
      highlight: 'Zero advertisements, zero notifications noise.'
    },
    {
      icon: Sparkles,
      title: 'Your Calm Sanctuary',
      description: 'Synchronize reading positions, bookmarks, and notes seamlessly whenever online. Continue reading, listening, or watching right where you left off.',
      highlight: 'Designed for quiet focus.'
    }
  ];

  const currentSlide = slides[slideIndex];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    storageService.setFirstLaunchCompleted();
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-400/90">
            Welcome Walkthrough ({slideIndex + 1}/3)
          </span>
          <button
            onClick={handleComplete}
            className="text-stone-400 hover:text-stone-200 text-xs font-medium tracking-wide underline underline-offset-4"
          >
            Skip Walkthrough
          </button>
        </div>

        {/* Slide Content */}
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-900/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Icon className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 mb-3 tracking-tight">
            {currentSlide.title}
          </h2>

          <p className="text-sm text-stone-300 font-sans leading-relaxed mb-4">
            {currentSlide.description}
          </p>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-950/60 border border-amber-800/40 text-amber-300">
            {currentSlide.highlight}
          </span>
        </div>

        {/* Step Indicators & Actions */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center justify-between">
          
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === slideIndex ? 'w-6 bg-amber-500' : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-sm transition-all shadow-md active:scale-95"
          >
            <span>{slideIndex === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            {slideIndex === slides.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </div>
  );
};
