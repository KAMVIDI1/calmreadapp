import React from 'react';
import { Download, CheckCircle, Play, BookOpen, Headphones, Video, FileText, HardDrive, Trash2 } from 'lucide-react';
import { ContentItem } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface LibraryListProps {
  items: ContentItem[];
  onSelectItem: (item: ContentItem) => void;
}

export const LibraryList: React.FC<LibraryListProps> = ({ items, onSelectItem }) => {
  const { startDownload, openMedia, deleteDownload } = useApp();

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'audiobook': return Headphones;
      case 'video': return Video;
      case 'article': return FileText;
    }
  };

  return (
    <div className="space-y-3">
      {items.map(item => {
        const TypeIcon = getTypeIcon(item.type);
        const isDownloaded = item.downloadStatus === 'completed';
        const isDownloading = item.downloadStatus === 'downloading';
        const sizeMb = (item.sizeBytes / (1024 * 1024)).toFixed(1);

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group cursor-pointer bg-[#181d20]/90 border border-stone-800/80 hover:border-amber-800/60 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all hover:bg-[#1c2226]"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <img
                src={item.coverUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-12 h-16 object-cover rounded-lg border border-stone-800 shadow shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-stone-900 text-amber-400 border border-stone-800">
                    <TypeIcon className="w-3 h-3" />
                    {item.type}
                  </span>
                  <span className="text-xs text-stone-400 font-sans">{item.category}</span>
                </div>

                <h4 className="text-sm font-serif font-medium text-stone-100 truncate group-hover:text-amber-300">
                  {item.title}
                </h4>

                <p className="text-xs text-stone-400 font-sans truncate">
                  By {item.author}
                </p>
              </div>
            </div>

            {/* Metrics & Actions */}
            <div className="flex items-center gap-4 shrink-0">
              
              <div className="hidden sm:flex flex-col items-end text-right text-xs font-sans text-stone-400">
                <span className="text-stone-300 font-medium">{sizeMb} MB</span>
                {item.readingProgressPercent > 0 ? (
                  <span className="text-amber-400">{item.readingProgressPercent}% read</span>
                ) : (
                  <span>Unread</span>
                )}
              </div>

              {/* Action Button */}
              {isDownloaded ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMedia(item);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span className="hidden xs:inline">Open</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDownload(item.id);
                    }}
                    className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                    title="Remove Download"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : isDownloading ? (
                <span className="text-xs text-amber-400 font-mono animate-pulse">
                  {item.downloadProgressPercent}%
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startDownload(item.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};
