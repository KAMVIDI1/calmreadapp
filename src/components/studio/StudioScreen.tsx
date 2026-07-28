import React, { useState } from 'react';
import { BookOpen, Scroll, Book, ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Sliders, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types/library';

export const StudioScreen: React.FC = () => {
  const { items, setIsMarketplaceOpen, openMedia } = useApp();
  const [selectedBook, setSelectedBook] = useState<ContentItem | null>(null);
  const [readingMode, setReadingMode] = useState<'scroll' | 'paged'>('scroll');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter books and articles for reading studio
  const readableItems = items.filter(i => i.type === 'epub' || i.type === 'pdf' || i.type === 'article');

  const totalPages = selectedBook?.chapters ? selectedBook.chapters.length * 12 : 120;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-28 sm:pb-24">
      
      {/* Studio Screen Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-medium text-stone-100">
              Reading Studio
            </h1>
            <p className="text-xs text-stone-400 font-sans">
              Distraction-free quiet reading workspace
            </p>
          </div>
        </div>

        {/* Reading Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
          <button
            onClick={() => setReadingMode('scroll')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] min-width-[44px] ${
              readingMode === 'scroll'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Scroll</span>
          </button>
          <button
            onClick={() => setReadingMode('paged')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] min-width-[44px] ${
              readingMode === 'paged'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Paged</span>
          </button>
        </div>
      </div>

      {/* Book Selection Grid if no book is active */}
      {!selectedBook && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-serif font-medium text-stone-200">
              Select a title for your reading session
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              {readableItems.length} Available
            </span>
          </div>

          {readableItems.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-[#181d20] border border-stone-800/80 rounded-2xl space-y-4 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-stone-600 mx-auto" />
              <p className="text-sm text-stone-300 font-sans">No readable books or articles found in your library.</p>
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Marketplace</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {readableItems.map(book => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="group bg-[#181d20] border border-stone-800/80 hover:border-amber-600/50 rounded-2xl p-3 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-800 relative">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-amber-300 uppercase">
                        {book.type}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-serif font-medium text-stone-100 line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-stone-400 font-sans truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 group-hover:bg-amber-600 group-hover:text-stone-950 text-xs font-medium transition-all min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <span>Read Now</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reader View when a title is selected */}
      {selectedBook && (
        <div className="bg-[#181d20] border border-stone-800/80 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Reader Top Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-stone-800">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 text-xs font-medium transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Selection</span>
            </button>

            <div className="text-center min-w-0 max-w-md">
              <h2 className="text-sm sm:text-base font-serif font-medium text-stone-100 truncate">
                {selectedBook.title}
              </h2>
              <p className="text-[11px] text-stone-400 font-sans truncate">
                By {selectedBook.author}
              </p>
            </div>

            {/* Typography Controls */}
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2.5 py-1 text-xs font-mono font-bold text-stone-300 hover:text-amber-400 min-h-[44px] min-w-[44px]"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-xs font-mono text-amber-400 px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                className="px-2.5 py-1 text-xs font-mono font-bold text-stone-300 hover:text-amber-400 min-h-[44px] min-w-[44px]"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Reading Content Area */}
          <div
            className={`reader-content transition-all py-4 px-2 sm:px-6 ${
              fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            {readingMode === 'scroll' ? (
              <div className="space-y-6 text-stone-200 max-w-2xl mx-auto leading-relaxed">
                <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:mr-2 first-letter:float-left">
                  {selectedBook.description || 'Welcome to this reading studio session. CalmReader optimizes your digital workspace for deep focus, elegant typography, and uninterrupted comprehension.'}
                </p>

                <p>
                  Silence surrounds the deliberate reader. When typography is given rhythm and negative space, reading becomes a form of active meditation rather than a rapid consumption of pixels.
                </p>

                {selectedBook.chapters ? (
                  selectedBook.chapters.map((chap, idx) => (
                    <div key={chap.id} className="pt-6 space-y-4 border-t border-stone-800/60">
                      <h3 className="text-lg font-serif font-semibold text-amber-300">
                        Chapter {idx + 1}: {chap.title}
                      </h3>
                      <p>
                        The architecture of calm design invites the mind to stay present. Each sentence flows smoothly without jarring popups, banners, or artificial interruptions.
                      </p>
                      <p>
                        In a world driven by constant notification noise, the quiet page remains one of humanity's most timeless tools for intellectual clarity.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4 pt-4">
                    <p>
                      Each page in CalmReader is synchronized locally so that your place, highlights, and margin notes persist securely across device restarts.
                    </p>
                    <p>
                      Adjust your font preferences, switch between scrolling or paged layout modes, and immerse yourself in the quiet practice of reading.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="paged-reader min-h-[350px] max-w-2xl mx-auto flex flex-col justify-between space-y-6 text-stone-200">
                <div className="space-y-4">
                  <div className="text-xs uppercase font-mono tracking-widest text-amber-400/80 pb-2 border-b border-stone-800">
                    Page {currentPage} of {totalPages}
                  </div>
                  <p className="text-stone-200 leading-relaxed">
                    {currentPage === 1 && (
                      <span>{selectedBook.description || 'Welcome to this reading studio session.'}</span>
                    )}
                    {currentPage > 1 && (
                      <span>
                        Section {currentPage}: Practicing deep focus allows the mind to absorb complex thoughts with maximum retention. When reading in CalmReader, your layout adapts fluidly to your target screen size.
                      </span>
                    )}
                  </p>
                  <p className="text-stone-300 text-sm italic">
                    "Wisdom is acquired through quiet contemplation and focused study."
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reader Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 flex-wrap gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-amber-400 text-xs font-medium transition-all min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-stone-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-all min-h-[44px]"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
