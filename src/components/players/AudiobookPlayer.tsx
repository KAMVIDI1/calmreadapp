import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Clock,
  Bookmark,
  List,
  Volume2,
  Headphones,
  Sliders,
  ChevronDown,
  Moon
} from 'lucide-react';
import { ContentItem, Chapter } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface AudiobookPlayerProps {
  item: ContentItem;
  onClose: () => void;
}

export const AudiobookPlayer: React.FC<AudiobookPlayerProps> = ({ item, onClose }) => {
  const { updateProgress, addBookmark } = useApp();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(item.lastChapterIndex || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(item.lastPosition || 0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentChapter: Chapter = item.chapters[currentChapterIndex] || item.chapters[0];
  const chapterDuration = currentChapter.durationSeconds || 3600;

  // Sync progress
  useEffect(() => {
    const totalChapters = item.chapters.length || 1;
    const progressPercent = Math.round(
      ((currentChapterIndex + (playbackPosition / chapterDuration)) / totalChapters) * 100
    );
    updateProgress(item.id, progressPercent, currentChapterIndex, playbackPosition);
  }, [currentChapterIndex, playbackPosition]);

  // Audio simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackPosition(prev => {
          if (prev >= chapterDuration) {
            if (currentChapterIndex < item.chapters.length - 1) {
              setCurrentChapterIndex(c => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return chapterDuration;
            }
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, chapterDuration, currentChapterIndex]);

  // Sleep Timer logic
  useEffect(() => {
    if (sleepTimerMinutes === null) return;
    const timer = setTimeout(() => {
      setIsPlaying(false);
      setSleepTimerMinutes(null);
    }, sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [sleepTimerMinutes]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSkip = (seconds: number) => {
    setPlaybackPosition(prev => Math.max(0, Math.min(chapterDuration, prev + seconds)));
  };

  const handleAddBookmark = () => {
    addBookmark({
      contentId: item.id,
      chapterIndex: currentChapterIndex,
      position: playbackPosition,
      title: `${currentChapter.title} @ ${formatTime(playbackPosition)}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121619] text-stone-100 flex flex-col justify-between p-6 sm:p-10 max-w-2xl mx-auto w-full border-x border-stone-800 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100 transition-colors"
          title="Minimize Player"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 font-sans block">
            Offline Audiobook Player
          </span>
          <h3 className="text-xs font-serif font-medium text-stone-300 truncate max-w-xs">
            {item.title}
          </h3>
        </div>

        <button
          onClick={() => setIsChapterListOpen(!isChapterListOpen)}
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100 transition-colors"
          title="Chapters"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Album Art Container */}
      <div className="my-auto py-6 text-center">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group">
          <img
            src={item.coverUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
            <span className="text-xs font-sans text-amber-300 flex items-center gap-1.5">
              <Headphones className="w-4 h-4" />
              Chapter {currentChapterIndex + 1} of {item.chapters.length}
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 mb-1">
          {currentChapter.title}
        </h2>
        <p className="text-xs text-stone-400 font-sans">
          By {item.author}
        </p>
      </div>

      {/* Waveform & Progress Slider */}
      <div className="space-y-3 mb-6">
        <input
          type="range"
          min="0"
          max={chapterDuration}
          value={playbackPosition}
          onChange={(e) => setPlaybackPosition(Number(e.target.value))}
          className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        <div className="flex justify-between text-xs font-mono text-stone-400">
          <span>{formatTime(playbackPosition)}</span>
          <span className="text-amber-400 font-medium">-{formatTime(chapterDuration - playbackPosition)}</span>
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex items-center justify-around gap-4 mb-6">
        
        {/* Speed Selector */}
        <button
          onClick={() => {
            const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
            const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
            setPlaybackSpeed(speeds[nextIdx]);
          }}
          className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono font-medium hover:bg-stone-800 transition-colors"
          title="Change Speed"
        >
          {playbackSpeed}x
        </button>

        {/* Skip 15 Back */}
        <button
          onClick={() => handleSkip(-15)}
          className="p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-400 hover:bg-stone-800 transition-colors"
          title="Rewind 15 seconds"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-xl transition-all active:scale-95"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-stone-950" /> : <Play className="w-8 h-8 fill-stone-950 ml-0.5" />}
        </button>

        {/* Skip 15 Forward */}
        <button
          onClick={() => handleSkip(15)}
          className="p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-400 hover:bg-stone-800 transition-colors"
          title="Forward 15 seconds"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        {/* Sleep Timer */}
        <button
          onClick={() => {
            const timers = [null, 15, 30, 45, 60];
            const nextIdx = (timers.indexOf(sleepTimerMinutes) + 1) % timers.length;
            setSleepTimerMinutes(timers[nextIdx]);
          }}
          className={`p-3 rounded-xl border text-xs font-sans transition-colors ${
            sleepTimerMinutes
              ? 'bg-amber-950/80 text-amber-300 border-amber-600'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
          title="Sleep Timer"
        >
          <Moon className="w-4 h-4" />
        </button>

      </div>

      {/* Chapters Drawer */}
      {isChapterListOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181d20] border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-medium text-base">Audiobook Chapters</h3>
              <button onClick={() => setIsChapterListOpen(false)} className="p-1 rounded-lg hover:bg-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 text-xs font-sans">
              {item.chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setPlaybackPosition(0);
                    setIsChapterListOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    idx === currentChapterIndex
                      ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="font-medium block">{chap.title}</span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Duration: {formatTime(chap.durationSeconds || 3600)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
