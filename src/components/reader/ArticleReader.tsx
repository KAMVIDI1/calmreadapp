import React, { useState } from 'react';
import { X, Volume2, VolumeX, Bookmark, Share2, Clock, BookOpen, Sun, Moon, ArrowLeft } from 'lucide-react';
import { ContentItem } from '../../types/library';
import { useApp } from '../../context/AppContext';

interface ArticleReaderProps {
  item: ContentItem;
  onClose: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ item, onClose }) => {
  const { addBookmark, bookmarks } = useApp();
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  const chapter = item.chapters[0] || {
    id: 'chap_1',
    title: item.title,
    content: `<p>${item.description}</p>`
  };

  const handleToggleTts = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech API not supported in this browser.');
      return;
    }

    if (isPlayingTts) {
      window.speechSynthesis.cancel();
      setIsPlayingTts(false);
    } else {
      const textToRead = item.title + '. ' + (chapter.content ? chapter.content.replace(/<[^>]*>?/gm, '') : item.description);
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingTts(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingTts(true);
    }
  };

  const handleAddBookmark = () => {
    addBookmark({
      contentId: item.id,
      chapterIndex: 0,
      position: 1,
      title: item.title
    });
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'dark': return 'bg-[#121619] text-stone-200';
      case 'sepia': return 'bg-[#f4ecd8] text-[#433422]';
      case 'light': return 'bg-stone-50 text-stone-900';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${getThemeClass()} transition-colors duration-300`}>
      
      {/* Article Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-black/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            if (isPlayingTts) window.speechSynthesis.cancel();
            onClose();
          }}
          className="flex items-center gap-2 text-xs font-sans font-medium hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          
          <button
            onClick={handleToggleTts}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isPlayingTts
                ? 'bg-amber-600 text-stone-950 border-amber-500 animate-pulse'
                : 'bg-black/20 border-black/20 hover:bg-black/30'
            }`}
            title="Read Article Aloud (TTS)"
          >
            {isPlayingTts ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingTts ? 'Stop Voice' : 'Read Aloud'}</span>
          </button>

          <button
            onClick={handleAddBookmark}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
            title="Bookmark Article"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs ${theme === 'dark' ? 'bg-amber-500 text-stone-950' : ''}`}
            >
              <Moon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-lg text-xs ${theme === 'sepia' ? 'bg-amber-500 text-stone-950' : ''}`}
            >
              <Sun className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* Article Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-24 py-10 max-w-3xl mx-auto w-full font-serif leading-relaxed">
        
        {/* Title Meta */}
        <div className="mb-8 pb-6 border-b border-black/10">
          <div className="flex items-center gap-2 text-xs font-sans text-amber-500 font-semibold uppercase tracking-wider mb-2">
            <span>Offline Article</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.estimatedReadingMinutes || 8} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium leading-tight mb-3">
            {item.title}
          </h1>

          <p className="text-sm font-sans opacity-70">
            By {item.author} • Published in {item.category}
          </p>
        </div>

        {/* Content */}
        <div className="text-base sm:text-lg space-y-6">
          {chapter.content ? (
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          ) : (
            <p>{item.description}</p>
          )}
        </div>

      </div>

    </div>
  );
};
