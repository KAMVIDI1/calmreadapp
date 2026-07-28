import React from 'react';
import {
  Download,
  Pause,
  Play,
  X,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  HardDrive,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DownloadManagerScreen: React.FC = () => {
  const {
    items,
    activeDownloads,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    deleteDownload,
    setIsMarketplaceOpen
  } = useApp();

  const downloadedItems = items.filter(i => i.downloadStatus === 'completed');
  const failedItems = items.filter(i => i.downloadStatus === 'failed' || i.downloadStatus === 'corrupted');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 flex items-center gap-2">
          <Download className="w-6 h-6 text-amber-400" />
          Download Manager
        </h2>
        <p className="text-xs text-stone-400 font-sans mt-1">
          Manage offline content packages, background download queues, and checksum verifications.
        </p>
      </div>

      {/* Active Downloads Section */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Active Download Queue ({activeDownloads.length})
          </h3>
          <span className="text-xs text-stone-400 font-sans font-mono">
            Wi-Fi Only Active
          </span>
        </div>

        {activeDownloads.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400 font-sans space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400/80 mx-auto" />
            <p>All requested packages are downloaded and verified offline.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDownloads.map(item => {
              const isDownloading = item.downloadStatus === 'downloading';
              const sizeMb = (item.sizeBytes / (1024 * 1024)).toFixed(1);
              const speedMbSec = item.downloadSpeedBytesPerSec
                ? (item.downloadSpeedBytesPerSec / (1024 * 1024)).toFixed(2)
                : '0.00';

              return (
                <div
                  key={item.id}
                  className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-12 object-cover rounded border border-stone-800"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-serif font-medium text-stone-100 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-400 font-sans">
                          {sizeMb} MB • {item.type}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isDownloading ? (
                        <button
                          onClick={() => pauseDownload(item.id)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                          title="Pause"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => resumeDownload(item.id)}
                          className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors"
                          title="Resume"
                        >
                          <Play className="w-4 h-4 fill-stone-950" />
                        </button>
                      )}

                      <button
                        onClick={() => cancelDownload(item.id)}
                        className="p-2 rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-400 text-stone-400 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Speed Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-sans font-mono text-stone-400">
                      <span>{item.downloadProgressPercent}% completed</span>
                      {isDownloading && (
                        <span className="text-amber-400">{speedMbSec} MB/s</span>
                      )}
                    </div>

                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${item.downloadProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Downloads List */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Downloaded Packages ({downloadedItems.length})
          </h3>
        </div>

        {downloadedItems.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <Download className="w-10 h-10 text-stone-600 mx-auto" />
            <h4 className="text-sm font-serif font-medium text-stone-300">Nothing Downloaded Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans leading-relaxed">
              Books and packages you download will appear here for offline reading. Start exploring the store.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-medium transition-colors"
              >
                <span>Browse Store</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {downloadedItems.map(item => (
              <div
                key={item.id}
                className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xl flex items-center justify-between gap-3 text-xs font-sans"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-8 h-10 object-cover rounded border border-stone-800"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif font-medium text-stone-200 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-500">{(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB • Verified SHA-256</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteDownload(item.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
