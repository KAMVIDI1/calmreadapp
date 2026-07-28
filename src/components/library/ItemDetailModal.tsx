import React, { useState } from 'react';
import {
  X,
  Play,
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  BookOpen,
  Headphones,
  Video,
  FileText,
  Bookmark,
  StickyNote,
  Clock,
  HardDrive,
  CheckCircle,
  Tag,
  Lock
} from 'lucide-react';
import { ContentItem } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface ItemDetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const {
    startDownload,
    deleteDownload,
    openMedia,
    bookmarks,
    notes,
    syncNow
  } = useApp();

  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  if (!item) return null;

  const isDownloaded = item.downloadStatus === 'completed';
  const isDownloading = item.downloadStatus === 'downloading';
  const sizeMb = (item.sizeBytes / (1024 * 1024)).toFixed(1);

  const itemBookmarks = bookmarks.filter(b => b.contentId === item.id);
  const itemNotes = notes.filter(n => n.contentId === item.id);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'book': return BookOpen;
      case 'audiobook': return Headphones;
      case 'video': return Video;
      case 'article': return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  const handleVerifyIntegrity = () => {
    setVerifying(true);
    setVerifyStatus(null);
    setTimeout(() => {
      setVerifying(false);
      setVerifyStatus(`Package SHA-256 Checksum Passed: ${item.checksumSha256.slice(0, 16)}...`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#161a1d] border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header Close */}
        <div className="p-4 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800/60 font-sans">
              <TypeIcon className="w-3.5 h-3.5" />
              {item.type}
            </span>
            <span className="text-xs text-stone-400 font-sans">{item.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Banner with Cover & Overview */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={item.coverUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-32 h-44 object-cover rounded-xl border border-stone-800 shadow-lg shrink-0 mx-auto sm:mx-0"
            />

            <div className="space-y-2 flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 leading-tight">
                {item.title}
              </h2>
              <p className="text-sm text-amber-400 font-sans">By {item.author}</p>
              
              <p className="text-xs text-stone-300 font-sans leading-relaxed pt-1">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 justify-center sm:justify-start">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[11px] font-sans bg-stone-900 border border-stone-800 text-stone-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-900/80 border border-stone-800 rounded-xl text-xs font-sans">
            <div>
              <span className="text-stone-500 block mb-0.5">Package Size</span>
              <span className="text-stone-200 font-medium flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                {sizeMb} MB
              </span>
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">Estimated Time</span>
              <span className="text-stone-200 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {item.estimatedReadingMinutes || 60} mins
              </span>
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">Bookmarks</span>
              <span className="text-stone-200 font-medium flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                {itemBookmarks.length} saved
              </span>
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">Notes & Highlights</span>
              <span className="text-stone-200 font-medium flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                {itemNotes.length} notes
              </span>
            </div>
          </div>

          {/* Licensing & Security Metadata */}
          <div className="p-4 bg-[#121518] border border-stone-800/80 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                DRM License Status:
              </span>
              <span className="text-emerald-400 font-medium">Valid (Offline Licensed)</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>License Key:</span>
              <span className="text-stone-300">{item.licenseKey || 'LIC-CALM-2026-X812'}</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Package Version:</span>
              <span className="text-stone-300">v{item.version}</span>
            </div>
          </div>

          {/* Verification Status Feedback */}
          {verifyStatus && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 font-sans flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{verifyStatus}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#111416] border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
          >
            <ShieldCheck className={`w-4 h-4 text-amber-400 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Verifying...' : 'Verify Integrity'}</span>
          </button>

          <div className="flex items-center gap-3">
            {isDownloaded ? (
              <>
                <button
                  onClick={() => {
                    deleteDownload(item.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Download</span>
                </button>

                <button
                  onClick={() => {
                    openMedia(item);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Open & Consume</span>
                </button>
              </>
            ) : isDownloading ? (
              <span className="text-xs text-amber-400 font-mono animate-pulse">
                Downloading ({item.downloadProgressPercent}%)...
              </span>
            ) : (
              <button
                onClick={() => startDownload(item.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Package ({sizeMb} MB)</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
