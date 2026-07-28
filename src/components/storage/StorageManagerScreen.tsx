import React, { useState } from 'react';
import {
  HardDrive,
  Trash2,
  Sparkles,
  PieChart,
  FolderArchive,
  Check,
  AlertTriangle,
  Folder,
  PlayCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContinueReadingCard } from '../home/ContinueReadingCard';
import { StorageSummaryCard } from '../home/StorageSummaryCard';

export const StorageManagerScreen: React.FC = () => {
  const { items, clearCache, deleteDownload } = useApp();

  const [cacheClearedMsg, setCacheClearedMsg] = useState(false);
  const [isOptimizerActive, setIsOptimizerActive] = useState(false);
  const [optimizerResults, setOptimizerResults] = useState<string[] | null>(null);

  const downloadedItems = items.filter(i => i.downloadStatus === 'completed');

  const booksBytes = downloadedItems.filter(i => i.type === 'book').reduce((acc, i) => acc + i.sizeBytes, 0);
  const audioBytes = downloadedItems.filter(i => i.type === 'audiobook').reduce((acc, i) => acc + i.sizeBytes, 0);
  const videoBytes = downloadedItems.filter(i => i.type === 'video').reduce((acc, i) => acc + i.sizeBytes, 0);
  const articleBytes = downloadedItems.filter(i => i.type === 'article').reduce((acc, i) => acc + i.sizeBytes, 0);
  const cacheBytes = 4500000;

  const totalBytes = booksBytes + audioBytes + videoBytes + articleBytes + cacheBytes;
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  const handleClearCache = () => {
    clearCache();
    setCacheClearedMsg(true);
    setTimeout(() => setCacheClearedMsg(false), 3000);
  };

  const handleRunOptimizer = () => {
    setIsOptimizerActive(true);
    setOptimizerResults(null);
    setTimeout(() => {
      setIsOptimizerActive(false);
      setOptimizerResults([
        'Scanned 14 local storage sectors in /data/user/0/app.calmreader.library/files/',
        'No duplicate package downloads found.',
        'Found 4.5 MB of temporary font render cache ready for safe cleanup.',
        'Storage health optimal. Device has 24.8 GB remaining space.'
      ]);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24">
      
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-amber-400" />
          Storage & Menu Dashboard
        </h2>
        <p className="text-xs text-stone-400 font-sans mt-1">
          Detailed inspection of local offline storage, folder allocations, continue listening/reading segments, and optimization.
        </p>
      </div>

      {/* Continue Reading & Listening Segment */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-sans uppercase font-semibold tracking-wider text-amber-400/90 flex items-center gap-1.5">
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>Continue Reading & Listening</span>
          </h3>
        </div>
        <ContinueReadingCard />
      </section>

      {/* Storage Analysis Overview Widget */}
      <section className="space-y-3">
        <StorageSummaryCard />
      </section>

      {/* Overview Card */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs text-stone-400 font-sans">Total CalmReader Storage Used</span>
            <h3 className="text-3xl font-serif font-medium text-stone-100 mt-0.5">{totalMb} MB</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearCache}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              Clear Cache (4.5 MB)
            </button>

            <button
              onClick={handleRunOptimizer}
              disabled={isOptimizerActive}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-medium transition-colors shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOptimizerActive ? 'Scanning...' : 'Optimize Storage'}</span>
            </button>
          </div>
        </div>

        {cacheClearedMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 font-sans flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Temporary font and rendering cache cleared successfully.</span>
          </div>
        )}

        {/* Breakdown bar */}
        <div className="space-y-2">
          <div className="h-3 bg-stone-800 rounded-full flex overflow-hidden">
            {booksBytes > 0 && <div className="bg-amber-500" style={{ width: `${(booksBytes / totalBytes) * 100}%` }} />}
            {audioBytes > 0 && <div className="bg-emerald-500" style={{ width: `${(audioBytes / totalBytes) * 100}%` }} />}
            {videoBytes > 0 && <div className="bg-purple-500" style={{ width: `${(videoBytes / totalBytes) * 100}%` }} />}
            {articleBytes > 0 && <div className="bg-sky-500" style={{ width: `${(articleBytes / totalBytes) * 100}%` }} />}
            <div className="bg-stone-600" style={{ width: `${(cacheBytes / totalBytes) * 100}%` }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs font-sans">
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
              <span className="text-amber-400 font-semibold block mb-1">Books</span>
              <span className="text-stone-200">{(booksBytes / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
              <span className="text-emerald-400 font-semibold block mb-1">Audiobooks</span>
              <span className="text-stone-200">{(audioBytes / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
              <span className="text-purple-400 font-semibold block mb-1">Videos</span>
              <span className="text-stone-200">{(videoBytes / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
              <span className="text-sky-400 font-semibold block mb-1">Articles</span>
              <span className="text-stone-200">{(articleBytes / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
              <span className="text-stone-400 font-semibold block mb-1">Temp Cache</span>
              <span className="text-stone-200">4.5 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Optimizer Results */}
      {optimizerResults && (
        <div className="bg-[#181d20] border border-amber-800/40 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
          <h4 className="text-amber-400 font-serif font-medium text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Storage Diagnostic Results
          </h4>
          <ul className="space-y-1.5 text-stone-300">
            {optimizerResults.map((line, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-amber-500">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internal Directory Allocations */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Folder className="w-4 h-4 text-amber-400" />
          Native File Directory Paths
        </h3>

        <div className="space-y-2 text-xs font-mono text-stone-400">
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between">
            <span>/data/user/0/app.calmreader.library/files/books/</span>
            <span className="text-stone-300">{(booksBytes / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between">
            <span>/data/user/0/app.calmreader.library/files/audiobooks/</span>
            <span className="text-stone-300">{(audioBytes / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between">
            <span>/data/user/0/app.calmreader.library/files/videos/</span>
            <span className="text-stone-300">{(videoBytes / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between">
            <span>/data/user/0/app.calmreader.library/cache/</span>
            <span className="text-stone-300">4.5 MB</span>
          </div>
        </div>
      </div>

    </div>
  );
};
