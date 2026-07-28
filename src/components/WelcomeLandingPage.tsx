import React from 'react';
import { BookOpen, DownloadCloud, ShieldCheck, Sparkles, ShoppingBag, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WelcomeLandingPageProps {
  onGetStarted: () => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({ onGetStarted }) => {
  const { setIsMarketplaceOpen, setIsAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#121619] text-stone-100 flex flex-col justify-between p-6 sm:p-10 max-w-5xl mx-auto">
      
      {/* Top Bar Logo */}
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-medium tracking-tight text-stone-100">
              CalmReader
            </h1>
            <p className="text-[11px] text-stone-400 font-sans">
              Your Digital Library Anywhere
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-medium transition-all"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Sign In / Auth</span>
        </button>
      </div>

      {/* Main Hero & Welcome Section */}
      <div className="py-12 sm:py-16 space-y-8 max-w-2xl mx-auto text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-sans font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Distraction-Free Digital Reader</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight text-stone-100 leading-tight">
            Read, Listen & Learn in Quiet Sanctuary.
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl mx-auto">
            Welcome to CalmReader. Enjoy your purchased books, audiobooks, masterclasses, and long-form articles offline — completely free of notifications and clutter.
          </p>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
          <div className="bg-[#181d20] border border-stone-800/80 rounded-2xl p-4 space-y-2">
            <DownloadCloud className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-serif font-medium text-stone-200">100% Offline Access</h3>
            <p className="text-[11px] text-stone-400 leading-snug">Download packages over Wi-Fi and enjoy anywhere without internet connection.</p>
          </div>

          <div className="bg-[#181d20] border border-stone-800/80 rounded-2xl p-4 space-y-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-serif font-medium text-stone-200">Private & Secure</h3>
            <p className="text-[11px] text-stone-400 leading-snug">Your bookmarks, reading progress, and highlighted notes stay securely stored.</p>
          </div>

          <div className="bg-[#181d20] border border-stone-800/80 rounded-2xl p-4 space-y-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-serif font-medium text-stone-200">Multi-Format Reader</h3>
            <p className="text-[11px] text-stone-400 leading-snug">EPUB books, MP3 audiobooks, MP4 video masterclasses, and offline articles.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-sm shadow-xl transition-all active:scale-95"
          >
            <span>Open My Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onGetStarted();
              setIsMarketplaceOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100 text-sm font-medium transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Browse Store Catalog</span>
          </button>
        </div>

      </div>

      {/* Footer info */}
      <div className="border-t border-stone-800/80 pt-6 text-center text-xs text-stone-500 font-sans">
        <p>CalmReader Digital Library • Offline Native Companion</p>
      </div>

    </div>
  );
};
