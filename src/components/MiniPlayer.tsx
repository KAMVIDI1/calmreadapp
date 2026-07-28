import React from 'react';
import { Play, Pause, X, Headphones, Maximize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MiniPlayer: React.FC = () => {
  const { activeItem, activeMediaType, openMedia, closeMedia } = useApp();

  if (!activeItem || (activeMediaType !== 'audiobook' && activeMediaType !== 'video')) {
    return null;
  }

  const isAudio = activeMediaType === 'audiobook';

  return (
    <div className="fixed bottom-16 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30 bg-[#1a1f23]/95 backdrop-blur-md border border-stone-700/80 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-slide-up">
      
      {/* Cover & Title */}
      <div
        onClick={() => openMedia(activeItem)}
        className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
      >
        <div className="relative shrink-0">
          <img
            src={activeItem.coverUrl}
            alt={activeItem.title}
            referrerPolicy="no-referrer"
            className="w-12 h-12 object-cover rounded-xl border border-stone-800 shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
            <Headphones className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 font-sans block">
            {isAudio ? 'Audiobook Playing' : 'Video Audio'}
          </span>
          <h4 className="text-xs font-serif font-medium text-stone-100 truncate">
            {activeItem.title}
          </h4>
          <p className="text-[11px] text-stone-400 font-sans truncate">
            {activeItem.author}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => openMedia(activeItem)}
          className="p-2 rounded-xl text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 transition-colors"
          title="Expand Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={closeMedia}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors"
          title="Close Player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
