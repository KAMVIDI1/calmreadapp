import React, { useState } from 'react';
import {
  Search,
  Grid,
  List,
  ArrowUpDown,
  BookOpen,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types/library';
import { LibraryGrid } from './LibraryGrid';
import { LibraryList } from './LibraryList';
import { ItemDetailModal } from './ItemDetailModal';

export const LibraryScreen: React.FC = () => {
  const { items, setIsMarketplaceOpen } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'progress' | 'size'>('title');

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Filtering
  const filteredItems = items.filter(item => {
    // Search
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Downloaded'
        ? item.downloadStatus === 'completed'
        : item.type === selectedCategory.toLowerCase().slice(0, -1) || item.category === selectedCategory;

    // Downloaded Only Filter
    const matchesDownloaded = downloadedOnly ? item.downloadStatus === 'completed' : true;

    return matchesSearch && matchesCategory && matchesDownloaded;
  });

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    if (sortBy === 'progress') return b.readingProgressPercent - a.readingProgressPercent;
    if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
    return 0;
  });

  const categories = ['All', 'Downloaded', 'Books', 'Audiobooks', 'Videos', 'Articles'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-28 sm:pb-24">
      
      {/* Main Library Controls & Catalog */}
      <section className="space-y-5">
        
        {/* Section Header & View Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100">
              Offline Library Collection
            </h2>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              {sortedItems.length} titles available in local storage catalog.
            </p>
          </div>

          {/* View Toggles & Downloaded Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDownloadedOnly(!downloadedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                downloadedOnly
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Downloaded Only</span>
            </button>

            <div className="flex items-center bg-stone-900 border border-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#181d20] border border-stone-800 rounded-2xl p-3">
          
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant search by title, author, category, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-stone-950 shadow'
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-xs text-stone-200 font-sans cursor-pointer"
            >
              <option value="title" className="bg-stone-900">Title</option>
              <option value="author" className="bg-stone-900">Author</option>
              <option value="progress" className="bg-stone-900">Progress</option>
              <option value="size" className="bg-stone-900">File Size</option>
            </select>
          </div>

        </div>

        {/* Catalog Display */}
        {items.length === 0 ? (
          <div className="bg-[#181d20]/80 border border-stone-800 rounded-3xl p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto my-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center mx-auto text-amber-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-medium text-stone-100">Your Library is Waiting</h3>
              <p className="text-xs text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
                Download books or import media packages to start reading. Your calm reading journey begins here.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Store & Packages</span>
              </button>
            </div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="bg-[#181d20]/60 border border-stone-800 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-base font-serif font-medium text-stone-300">No matching titles found</h3>
            <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
              Try adjusting your search terms or clearing filters to view all CalmReader offline items.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <LibraryGrid items={sortedItems} onSelectItem={(item) => setSelectedItem(item)} />
        ) : (
          <LibraryList items={sortedItems} onSelectItem={(item) => setSelectedItem(item)} />
        )}

      </section>

      {/* Detail Modal */}
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

    </div>
  );
};
