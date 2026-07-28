import React from 'react';
import { Play, BookOpen, Headphones, Video, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContinueReadingCard: React.FC = () => {
  const { continueItem, openMedia } = useApp();

  if (!continueItem) {
    return (
      <div className="bg-[#181d20]/80 border border-stone-800 rounded-2xl p-6 text-center">
        <p className="text-sm text-stone-400 font-sans">
          No active reading session yet. Select any downloaded book or media below to begin.
        </p>
      </div>
    );
  }

  const getTypeIcon = () => {
    switch (continueItem.type) {
      case 'book': return BookOpen;
      case 'audiobook': return Headphones;
      case 'video': return Video;
      case 'article': return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  const getActionLabel = () => {
    switch (continueItem.type) {
      case 'book': return 'Continue Reading';
      case 'audiobook': return 'Continue Listening';
      case 'video': return 'Continue Watching';
      case 'article': return 'Continue Reading';
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-950/30 via-[#181d20] to-[#121619] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
        
        {/* Item Information */}
        <div className="flex gap-4 items-center">
          <img
            src={continueItem.coverUrl}
            alt={continueItem.title}
            referrerPolicy="no-referrer"
            className="w-16 h-22 sm:w-20 sm:h-28 object-cover rounded-xl border border-stone-800 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300"
          />

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800/60 font-sans">
                <TypeIcon className="w-3 h-3" />
                {continueItem.type}
              </span>
              <span className="text-xs text-stone-400 font-sans">
                Chapter {continueItem.lastChapterIndex + 1}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-serif font-medium text-stone-100 mb-1 leading-snug">
              {continueItem.title}
            </h3>

            <p className="text-xs text-stone-400 font-sans mb-3">
              By {continueItem.author}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[11px] font-sans text-stone-400">
                <span>Progress</span>
                <span className="text-amber-400 font-medium">{continueItem.readingProgressPercent}%</span>
              </div>
              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${continueItem.readingProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Resume Action Button */}
        <button
          onClick={() => openMedia(continueItem)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-sm shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-stone-950" />
          <span>{getActionLabel()}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

      </div>

    </div>
  );
};
