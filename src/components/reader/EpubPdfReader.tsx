import React, { useState, useEffect } from 'react';
import {
  X,
  AArrowDown,
  AArrowUp,
  Sun,
  Moon,
  Bookmark,
  StickyNote,
  Search,
  List,
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  BookMarked,
  Info
} from 'lucide-react';
import { ContentItem, ReaderSettings, ReaderTheme, FontFamily, Bookmark as BookmarkType, HighlightNote } from '../../types/library';
import { useApp } from '../../context/AppContext';
import { lookupWord, DictionaryEntry } from '../../services/dictionaryService';

interface EpubPdfReaderProps {
  item: ContentItem;
  onClose: () => void;
}

export const EpubPdfReader: React.FC<EpubPdfReaderProps> = ({ item, onClose }) => {
  const { updateProgress, addBookmark, bookmarks, addNote, notes } = useApp();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(item.lastChapterIndex || 0);
  const [currentPage, setCurrentPage] = useState(item.lastPosition || 1);
  const totalPagesInChapter = 6; // Simulated pages per chapter

  // Settings
  const [settings, setSettings] = useState<ReaderSettings>({
    theme: 'dark',
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.6,
    marginSize: 24,
    brightness: 100,
    scrollMode: 'paginated'
  });

  // UI Drawers & Modals
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ chapterIndex: number; excerpt: string }[]>([]);

  // Dictionary Modal
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [dictionaryEntry, setDictionaryEntry] = useState<DictionaryEntry | null>(null);

  // Note creation popover
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const currentChapter = item.chapters[currentChapterIndex] || item.chapters[0];

  // Auto save progress
  useEffect(() => {
    const totalChapters = item.chapters.length || 1;
    const overallProgress = Math.round(
      ((currentChapterIndex + (currentPage / totalPagesInChapter)) / totalChapters) * 100
    );
    updateProgress(item.id, overallProgress, currentChapterIndex, currentPage);
  }, [currentChapterIndex, currentPage]);

  // Handle Text Selection for Dictionary / Note
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      if (text.split(' ').length === 1) {
        // Single word -> Dictionary
        setSelectedWord(text);
        setDictionaryEntry(lookupWord(text));
      } else {
        // Multiple words -> Note/Highlight
        setSelectedText(text);
      }
    }
  };

  const handleCreateNote = () => {
    if (!selectedText) return;
    addNote({
      contentId: item.id,
      chapterIndex: currentChapterIndex,
      selectedText,
      noteText: noteInput || 'Highlighted excerpt',
      color: 'yellow'
    });
    setSelectedText(null);
    setNoteInput('');
  };

  const handleAddBookmark = () => {
    addBookmark({
      contentId: item.id,
      chapterIndex: currentChapterIndex,
      position: currentPage,
      title: `${currentChapter.title} - Page ${currentPage}`
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results: { chapterIndex: number; excerpt: string }[] = [];
    item.chapters.forEach((chap, idx) => {
      if (chap.content?.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          chapterIndex: idx,
          excerpt: chap.title
        });
      }
    });
    setSearchResults(results);
  };

  // Theme styling helpers
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'light': return 'bg-stone-50 text-stone-900';
      case 'sepia': return 'bg-[#f4ecd8] text-[#433422]';
      case 'cream': return 'bg-[#faf8f5] text-[#2b2b2b]';
      case 'dark': return 'bg-[#121619] text-stone-200';
    }
  };

  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif';
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      case 'dyslexic': return 'font-sans tracking-wide';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${getThemeClasses()}`}
      style={{ filter: `brightness(${settings.brightness}%)` }}
      onMouseUp={handleTextSelection}
    >
      
      {/* Top Controls Bar */}
      <div className="bg-black/20 backdrop-blur-md border-b border-black/10 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Exit Reader"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h3 className="text-xs font-serif font-medium truncate max-w-xs">{item.title}</h3>
            <p className="text-[10px] opacity-70 font-sans truncate">{currentChapter.title}</p>
          </div>
        </div>

        {/* Reader Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={() => setIsTocOpen(true)}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddBookmark}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Add Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotesOpen(true)}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Notes & Highlights"
          >
            <StickyNote className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Search Inside Book"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Reader Display Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Main Reading Surface */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-24 py-8 max-w-4xl mx-auto w-full select-text">
        <div
          className={`${getFontFamilyStyle()} leading-relaxed space-y-6`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            paddingLeft: `${settings.marginSize}px`,
            paddingRight: `${settings.marginSize}px`
          }}
        >
          {currentChapter.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chapter content payload rendered securely from local storage cache.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Reading Pagination & Progress */}
      <div className="bg-black/20 backdrop-blur-md border-t border-black/10 px-6 py-2.5 flex items-center justify-between text-xs font-sans opacity-80 shrink-0">
        
        <button
          onClick={() => {
            if (currentPage > 1) setCurrentPage(p => p - 1);
            else if (currentChapterIndex > 0) {
              setCurrentChapterIndex(c => c - 1);
              setCurrentPage(totalPagesInChapter);
            }
          }}
          disabled={currentChapterIndex === 0 && currentPage === 1}
          className="flex items-center gap-1 hover:opacity-100 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <span>
            Chapter {currentChapterIndex + 1} of {item.chapters.length} • Page {currentPage} of {totalPagesInChapter}
          </span>
          <span className="block text-[10px] opacity-60">
            {item.readingProgressPercent}% total progress
          </span>
        </div>

        <button
          onClick={() => {
            if (currentPage < totalPagesInChapter) setCurrentPage(p => p + 1);
            else if (currentChapterIndex < item.chapters.length - 1) {
              setCurrentChapterIndex(c => c + 1);
              setCurrentPage(1);
            }
          }}
          disabled={currentChapterIndex === item.chapters.length - 1 && currentPage === totalPagesInChapter}
          className="flex items-center gap-1 hover:opacity-100 disabled:opacity-30"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Table of Contents Drawer */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start">
          <div className="bg-[#181d20] border-r border-stone-800 text-stone-100 w-80 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
              <h3 className="font-serif font-medium text-base">Table of Contents</h3>
              <button onClick={() => setIsTocOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {item.chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setCurrentPage(1);
                    setIsTocOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-serif transition-colors ${
                    idx === currentChapterIndex ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'hover:bg-stone-800/60'
                  }`}
                >
                  <span className="block text-[10px] font-sans opacity-60 uppercase">Chapter {idx + 1}</span>
                  <span className="font-medium">{chap.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reader Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d20] border border-stone-800 text-stone-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif font-medium text-base">Display Customization</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Themes */}
            <div className="space-y-2">
              <label className="text-xs font-sans text-stone-400 block">Reading Palette</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'light', label: 'Light', bg: 'bg-stone-100 text-stone-900' },
                  { id: 'sepia', label: 'Sepia', bg: 'bg-[#f4ecd8] text-[#433422]' },
                  { id: 'cream', label: 'Cream', bg: 'bg-[#faf8f5] text-[#2b2b2b]' },
                  { id: 'dark', label: 'Dark', bg: 'bg-[#121619] text-stone-200' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSettings({ ...settings, theme: t.id as ReaderTheme })}
                    className={`p-3 rounded-xl border text-xs font-medium ${t.bg} ${
                      settings.theme === t.id ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-stone-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Font Size</span>
                <span className="font-mono text-amber-400">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 2) })}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700"
                >
                  <AArrowDown className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
                <button
                  onClick={() => setSettings({ ...settings, fontSize: Math.min(32, settings.fontSize + 2) })}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700"
                >
                  <AArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-xs font-sans text-stone-400 block">Typography Family</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'serif', label: 'Georgia Serif', style: 'font-serif' },
                  { id: 'sans', label: 'System Sans', style: 'font-sans' },
                  { id: 'mono', label: 'Monospace', style: 'font-mono' },
                  { id: 'dyslexic', label: 'OpenDyslexic', style: 'font-sans tracking-wider' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSettings({ ...settings, fontFamily: f.id as FontFamily })}
                    className={`p-2.5 rounded-xl border text-left ${f.style} ${
                      settings.fontFamily === f.id
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                        : 'bg-stone-900 border-stone-800 text-stone-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Reading Brightness</span>
                <span className="font-mono text-amber-400">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={settings.brightness}
                onChange={(e) => setSettings({ ...settings, brightness: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

          </div>
        </div>
      )}

      {/* Dictionary Popover Modal */}
      {selectedWord && dictionaryEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d20] border border-stone-800 text-stone-100 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedWord(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-stone-800 text-stone-400"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-amber-400 block mb-1">
              Offline Dictionary
            </span>

            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-serif font-medium">{dictionaryEntry.word}</h3>
              <span className="text-xs text-stone-400 font-mono">{dictionaryEntry.phonetic}</span>
            </div>

            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-sans italic bg-stone-800 text-stone-300 mb-3">
              {dictionaryEntry.partOfSpeech}
            </span>

            <p className="text-xs text-stone-200 font-sans leading-relaxed mb-3">
              {dictionaryEntry.definition}
            </p>

            {dictionaryEntry.etymology && (
              <p className="text-[11px] text-stone-400 font-sans italic border-t border-stone-800 pt-2">
                {dictionaryEntry.etymology}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notes Drawer */}
      {isNotesOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-[#181d20] border-l border-stone-800 text-stone-100 w-80 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
              <h3 className="font-serif font-medium text-base">Notes & Bookmarks</h3>
              <button onClick={() => setIsNotesOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-sans">
              <div>
                <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-[10px] mb-2">
                  Bookmarks ({bookmarks.filter(b => b.contentId === item.id).length})
                </h4>
                <div className="space-y-1.5">
                  {bookmarks.filter(b => b.contentId === item.id).map(b => (
                    <div key={b.id} className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl">
                      <span className="font-medium text-stone-200 block">{b.title}</span>
                      <span className="text-[10px] text-stone-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-[10px] mb-2">
                  Highlights & Notes ({notes.filter(n => n.contentId === item.id).length})
                </h4>
                <div className="space-y-2">
                  {notes.filter(n => n.contentId === item.id).map(n => (
                    <div key={n.id} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <p className="text-amber-200/90 italic">"{n.selectedText}"</p>
                      <p className="text-stone-300 font-sans">{n.noteText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Inside Book Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d20] border border-stone-800 text-stone-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-serif font-medium text-base">Search Inside Book</h3>
              <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-lg hover:bg-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type word or phrase..."
                className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 text-xs font-sans">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentChapterIndex(res.chapterIndex);
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl"
                >
                  <span className="text-amber-400 font-medium block">Chapter {res.chapterIndex + 1}</span>
                  <span className="text-stone-300">{res.excerpt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
