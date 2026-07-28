import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Volume2,
  VolumeX,
  Subtitles,
  ChevronLeft
} from 'lucide-react';
import { ContentItem } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface VideoPlayerProps {
  item: ContentItem;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onClose }) => {
  const { updateProgress } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(item.lastPosition || 0);
  const [duration, setDuration] = useState(item.totalDurationSeconds || 2700);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const progressPercent = Math.round((currentTime / duration) * 100);
    updateProgress(item.id, progressPercent, 0, currentTime);
  }, [currentTime]);

  const chapter = item.chapters[0] || {
    id: 'v1',
    title: item.title,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-stone-100 flex flex-col justify-between">
      
      {/* Video Overlay Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-sans font-medium text-stone-200 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Library</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 font-sans block">
            Offline Video Companion
          </span>
          <h3 className="text-xs font-serif font-medium text-stone-200 truncate max-w-sm">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
            className={`p-2 rounded-xl text-xs font-sans transition-colors ${
              subtitlesEnabled ? 'bg-amber-600 text-stone-950 font-medium' : 'bg-stone-800 text-stone-400'
            }`}
            title="Toggle Subtitles (CC)"
          >
            <Subtitles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Canvas Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
        <video
          ref={videoRef}
          src={chapter.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onClick={togglePlay}
        />

        {/* Subtitles Overlay */}
        {subtitlesEnabled && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-amber-200 text-xs sm:text-sm font-sans px-4 py-1.5 rounded-xl border border-stone-800 backdrop-blur-sm pointer-events-none text-center">
            [CC] "...the quiet geometry of typography creates visual balance on the page."
          </div>
        )}
      </div>

      {/* Video Overlay Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 space-y-3">
        
        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const time = Number(e.target.value);
            setCurrentTime(time);
            if (videoRef.current) videoRef.current.currentTime = time;
          }}
          className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        <div className="flex items-center justify-between text-xs font-sans">
          
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 shadow transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
            </button>

            <span className="font-mono text-stone-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
                const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
                setPlaybackRate(next);
                if (videoRef.current) videoRef.current.playbackRate = next;
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 text-amber-400 font-mono text-xs"
            >
              {playbackRate}x
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
