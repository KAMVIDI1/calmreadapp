import React from 'react';
import { Download, CheckCircle, Play, BookOpen, Headphones, Video, FileText, Lock, HardDrive } from 'lucide-react';
import { ContentItem } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface LibraryGridProps {
  items: ContentItem[];
  onSelectItem: (item: ContentItem) => void;
}

export const LibraryGrid: React.FC<LibraryGridProps> = ({ items, onSelectItem }) => {
  const { startDownload, openMedia } = useApp();

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'audiobook': return Headphones;
      case 'video': return Video;
      case 'article': return FileText;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
      {items.map(item => {
        const TypeIcon = getTypeIcon(item.type);
        const isDownloaded = item.downloadStatus === 'completed';
        const isDownloading = item.downloadStatus === 'downloading';
        const sizeMb = (item.sizeBytes / (1024 * 1024)).toFixed(1);

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group cursor-pointer bg-[#181d20]/90 border border-stone-800/80 hover:border-amber-800/60 rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
          >
            {/* Cover Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-900 mb-3 shadow-md">
              <img
                src={item.coverUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badge Top Right */}
              <div className="absolute top-2 right-2">
                {isDownloaded ? (
                  <span className="p-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 backdrop-blur-sm shadow flex items-center gap-1 text-[10px] px-1.5 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>Offline</span>
                  </span>
                ) : isDownloading ? (
                  <span className="p-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-400 backdrop-blur-sm shadow flex items-center gap-1 text-[10px] px-1.5 font-medium animate-pulse">
                    <span>{item.downloadProgressPercent}%</span>
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startDownload(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-stone-950/80 border border-stone-700 text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors backdrop-blur-sm"
                    title="Download for offline access"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Format Badge Top Left */}
              <div className="absolute top-2 left-2">
                <span className="p-1 rounded-lg bg-stone-950/80 border border-stone-800 text-amber-400 backdrop-blur-sm shadow flex items-center">
                  <TypeIcon className="w-3 h-3" />
                </span>
              </div>

              {/* DRM Encryption Icon */}
              {item.isEncrypted && (
                <div className="absolute bottom-2 left-2">
                  <span className="p-1 rounded-md bg-stone-950/80 border border-stone-800 text-stone-400 text-[10px] flex items-center gap-1 backdrop-blur-sm">
                    <Lock className="w-2.5 h-2.5 text-amber-500" />
                    <span className="hidden group-hover:inline font-mono">DRM</span>
                  </span>
                </div>
              )}

              {/* Progress Overlay at Bottom of Cover */}
              {item.readingProgressPercent > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-950/80">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${item.readingProgressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-medium text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-400 font-sans line-clamp-1 mt-0.5">
                  {item.author}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-800/60 text-[10px] text-stone-400 font-sans">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-stone-500" />
                  {sizeMb} MB
                </span>
                {item.readingProgressPercent > 0 ? (
                  <span className="text-amber-400/90 font-medium">{item.readingProgressPercent}%</span>
                ) : (
                  <span className="capitalize text-stone-500">{item.format}</span>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
