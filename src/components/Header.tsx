import React, { useState } from 'react';
import {
  BookOpen,
  Cloud,
  CloudOff,
  RefreshCw,
  ShoppingBag,
  Download,
  AlertCircle,
  Wifi,
  WifiOff,
  Menu,
  X,
  ExternalLink,
  HardDrive,
  Activity,
  User,
  Settings,
  LogIn,
  LogOut,
  Terminal,
  Sparkles
} from 'lucide-react';
import { useApp, ActiveScreen } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    isOnline,
    toggleOnlineOverride,
    syncStatus,
    syncNow,
    activeDownloads,
    currentScreen,
    setCurrentScreen,
    setIsMarketplaceOpen,
    setIsAuthModalOpen,
    setIsOnboardingOpen,
    userProfile,
    preferences
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenMarketplaceExternal = () => {
    const targetUrl = import.meta.env.VITE_CALMREADER_URL || 'https://calmreader.qzz.io';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const navMenuItems: { id: ActiveScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'library', label: '📖 Library', icon: BookOpen },
    { id: 'studio', label: '✍️ Reading Studio', icon: Sparkles },
    { id: 'downloads', label: '⬇️ Downloads', icon: Download },
    { id: 'profile', label: '👤 User Profile', icon: User },
    { id: 'settings', label: '⚙️ Settings', icon: Settings }
  ];

  if (preferences.developerMode) {
    navMenuItems.push({ id: 'developer', label: '💻 Developer Mode', icon: Terminal });
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#121619]/90 backdrop-blur-md border-b border-stone-800/60 px-3 sm:px-6 py-1.5 transition-colors min-h-[56px] flex items-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Brand & Menu Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-600/50 transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-800/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-serif font-medium tracking-tight text-stone-100 truncate">
                  CALMREADER
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-sans font-semibold text-amber-400/90 bg-amber-950/60 border border-amber-800/40 rounded shrink-0">
                  Companion
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 font-sans tracking-wide truncate">
                Your Digital Library Anywhere
              </p>
            </div>
          </div>

          {/* Action Controls & Sync Status */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* Sync Status Badge */}
            <button
              onClick={syncNow}
              title={isOnline ? 'Click to trigger cloud synchronization' : 'Offline Mode active'}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                syncStatus === 'synced'
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/40'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-950/50 text-amber-400 border-amber-800/40 animate-pulse'
                  : syncStatus === 'offline'
                  ? 'bg-stone-800/80 text-stone-400 border-stone-700/50'
                  : 'bg-rose-950/50 text-rose-400 border-rose-800/40'
              }`}
            >
              {syncStatus === 'synced' && <Cloud className="w-3.5 h-3.5" />}
              {syncStatus === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {syncStatus === 'offline' && <CloudOff className="w-3.5 h-3.5" />}
              {syncStatus === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
              <span className="hidden md:inline capitalize">{syncStatus}</span>
            </button>

            {/* Online / Offline Toggle */}
            <button
              onClick={toggleOnlineOverride}
              title={isOnline ? 'Switch to Offline Library Mode' : 'Connect to CalmReader Servers'}
              className={`p-2 rounded-xl text-xs font-medium transition-all border ${
                isOnline
                  ? 'bg-stone-800/80 text-stone-300 border-stone-700/50 hover:bg-stone-700/60'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/50 hover:bg-amber-900/50'
              }`}
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </button>

            {/* Download Manager Status pill */}
            {activeDownloads.length > 0 && (
              <button
                onClick={() => setCurrentScreen('downloads')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all animate-pulse"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{activeDownloads.length} Downloading</span>
                <span className="sm:hidden">{activeDownloads.length}</span>
              </button>
            )}

            {/* Marketplace Button */}
            <button
              onClick={() => setIsMarketplaceOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Browse Store</span>
            </button>

          </div>
        </div>
      </header>

      {/* Navigation Slide-Out Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-[#14191c] border-r border-stone-800 h-full p-5 flex flex-col justify-between shadow-2xl z-10 transition-transform">
            
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-medium text-stone-100">CalmReader Menu</h2>
                    <p className="text-[11px] text-stone-400 font-sans">{userProfile.email || 'Offline Reader'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* External Launcher & Welcome Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-950/40 border border-amber-800/50 text-amber-300 hover:text-amber-200 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-sans font-semibold">View App Welcome Page</span>
                  </div>
                  <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded text-amber-200">Welcome</span>
                </button>

                <button
                  onClick={handleOpenMarketplaceExternal}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-amber-950/40 border border-purple-800/50 text-purple-300 hover:text-purple-200 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-sans font-semibold">Visit CalmReader Marketplace</span>
                  </div>
                  <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded text-purple-200">calmreader.qzz.io</span>
                </button>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-stone-500 px-2">
                  Navigation & Analysis
                </span>
                <div className="space-y-1 pt-1">
                  {navMenuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentScreen(item.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all ${
                          isActive
                            ? 'bg-amber-950/60 border border-amber-800/50 text-amber-300'
                            : 'text-stone-300 hover:bg-stone-900 hover:text-stone-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Auth Section */}
            <div className="border-t border-stone-800 pt-4 space-y-3">
              <div className="p-3 bg-stone-900/80 border border-stone-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-200">{userProfile.name}</p>
                  <p className="text-[10px] text-stone-400">{userProfile.email || 'Local User'}</p>
                </div>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-medium transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Auth</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-500 font-sans">
                CalmReader Companion v2.4.0 • Offline Ready
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

