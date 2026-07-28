import React, { useState } from 'react';
import { ShoppingBag, X, Search, ShieldCheck, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MarketplaceModal: React.FC = () => {
  const { isMarketplaceOpen, setIsMarketplaceOpen, importMarketplaceContent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  if (!isMarketplaceOpen) return null;

  // Catalog items list (dummy products removed)
  const catalogItems: Array<{
    id: string;
    title: string;
    author: string;
    type: 'book' | 'audiobook' | 'video' | 'article';
    format: 'epub' | 'pdf' | 'mp3' | 'mp4' | 'article';
    price: string;
    coverUrl: string;
    description: string;
    category: string;
    sizeBytes: number;
  }> = [];

  const filteredCatalog = catalogItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = (item: typeof catalogItems[0]) => {
    setPurchasingId(item.id);
    setTimeout(() => {
      importMarketplaceContent(item);
      setPurchasingId(null);
      setIsMarketplaceOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#14181b] border border-stone-800 rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Embedded Browser Header Bar */}
        <div className="bg-[#1b2024] px-4 py-3 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>https://calmreader.qzz.io/marketplace</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-stone-400 font-sans">
              Embedded WebView Frame
            </span>
            <button
              onClick={() => setIsMarketplaceOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/20 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-stone-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              CalmReader Official Store
            </h2>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Purchases automatically synchronize and download into your CalmReader Library.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-stone-800/80 bg-[#161a1d]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CalmReader Marketplace catalog..."
              className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600/60"
            />
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredCatalog.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-stone-800 rounded-2xl bg-stone-900/30 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-600 mb-1" />
              <h3 className="text-sm font-serif font-medium text-stone-300">Store Catalog Empty</h3>
              <p className="text-xs text-stone-500 max-w-sm font-sans leading-relaxed">
                All dummy products have been removed. Connect your CalmReader server or sync official content packages to view real products.
              </p>
            </div>
          ) : (
            filteredCatalog.map(item => (
              <div
                key={item.id}
                className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-stone-700 transition-all"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 object-cover rounded-lg border border-stone-800 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/50">
                        {item.type}
                      </span>
                      <span className="text-xs text-stone-400 font-sans">{item.category}</span>
                    </div>
                    <h3 className="text-sm font-serif font-medium text-stone-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-400 mb-1">By {item.author}</p>
                    <p className="text-xs text-stone-300 line-clamp-1 max-w-md">{item.description}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 border-stone-800/80 pt-3 sm:pt-0">
                  <span className="text-base font-medium text-amber-400">{item.price}</span>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={purchasingId === item.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {purchasingId === item.id ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Buy & Send to Library</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#121517] px-6 py-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-sans">
          <span>Protected by CalmReader DRM & Secure Licenses</span>
          <div className="flex items-center gap-1 text-amber-400">
            <span>CalmReader Companion v2.4</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

      </div>
    </div>
  );
};
