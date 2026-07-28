import React from 'react';
import { HardDrive, PieChart, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StorageSummaryCard: React.FC = () => {
  const { items, setCurrentScreen } = useApp();

  const downloadedItems = items.filter(i => i.downloadStatus === 'completed');

  const booksBytes = downloadedItems.filter(i => i.type === 'book').reduce((acc, i) => acc + i.sizeBytes, 0);
  const audioBytes = downloadedItems.filter(i => i.type === 'audiobook').reduce((acc, i) => acc + i.sizeBytes, 0);
  const videoBytes = downloadedItems.filter(i => i.type === 'video').reduce((acc, i) => acc + i.sizeBytes, 0);
  const articleBytes = downloadedItems.filter(i => i.type === 'article').reduce((acc, i) => acc + i.sizeBytes, 0);
  const cacheBytes = downloadedItems.length > 0 ? 4500000 : 0; // ~4.5 MB when items exist
  const totalUsedBytes = booksBytes + audioBytes + videoBytes + articleBytes + cacheBytes;
  const totalUsedMb = totalUsedBytes === 0 ? '0.0' : (totalUsedBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-serif font-medium text-stone-100">Storage Usage</h3>
        </div>
        <button
          onClick={() => setCurrentScreen('storage')}
          className="text-xs text-amber-400 hover:text-amber-300 font-sans flex items-center gap-1 transition-colors"
        >
          <span>Manage Storage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-serif font-medium text-stone-100">{totalUsedMb} MB</span>
        <span className="text-xs text-stone-400 font-sans">{downloadedItems.length} items offline</span>
      </div>

      {/* Visual Bar Breakdown */}
      <div className="h-2 bg-stone-800 rounded-full flex overflow-hidden mb-3">
        {booksBytes > 0 && <div className="bg-amber-500" style={{ width: `${(booksBytes / totalUsedBytes) * 100}%` }} />}
        {audioBytes > 0 && <div className="bg-emerald-500" style={{ width: `${(audioBytes / totalUsedBytes) * 100}%` }} />}
        {videoBytes > 0 && <div className="bg-purple-500" style={{ width: `${(videoBytes / totalUsedBytes) * 100}%` }} />}
        {articleBytes > 0 && <div className="bg-sky-500" style={{ width: `${(articleBytes / totalUsedBytes) * 100}%` }} />}
        <div className="bg-stone-600" style={{ width: `${(cacheBytes / totalUsedBytes) * 100}%` }} />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-sans text-stone-400 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Books ({(booksBytes / (1024 * 1024)).toFixed(0)}MB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Audio ({(audioBytes / (1024 * 1024)).toFixed(0)}MB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Videos ({(videoBytes / (1024 * 1024)).toFixed(0)}MB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Articles ({(articleBytes / (1024 * 1024)).toFixed(0)}MB)</span>
        </div>
      </div>
    </div>
  );
};
