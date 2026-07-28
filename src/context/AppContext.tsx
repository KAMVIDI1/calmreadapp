import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ContentItem,
  UserPreferences,
  SyncStatusType,
  UserProfile,
  Bookmark,
  HighlightNote
} from '../types/library';
import { storageService } from '../services/storageService';

export type ActiveScreen = 'library' | 'studio' | 'downloads' | 'storage' | 'health' | 'settings' | 'profile' | 'developer';

interface AppContextType {
  // Navigation & Screens
  currentScreen: ActiveScreen;
  setCurrentScreen: (screen: ActiveScreen) => void;
  
  // Active Content Reader / Media Player
  activeItem: ContentItem | null;
  activeMediaType: 'reader' | 'audiobook' | 'video' | 'article' | null;
  openMedia: (item: ContentItem) => void;
  closeMedia: () => void;
  
  // Library Data
  items: ContentItem[];
  refreshItems: () => void;
  continueItem: ContentItem | null;
  
  // Download Manager State
  activeDownloads: ContentItem[];
  startDownload: (itemId: string) => void;
  pauseDownload: (itemId: string) => void;
  resumeDownload: (itemId: string) => void;
  cancelDownload: (itemId: string) => void;
  deleteDownload: (itemId: string) => void;
  retryDownload: (itemId: string) => void;
  
  // Progress & Annotations
  updateProgress: (itemId: string, progressPercent: number, chapterIndex: number, position: number) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  deleteBookmark: (id: string) => void;
  notes: HighlightNote[];
  addNote: (note: Omit<HighlightNote, 'id' | 'createdAt'>) => HighlightNote;
  deleteNote: (id: string) => void;
  
  // Connectivity & Sync
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleOnlineOverride: () => void;
  syncStatus: SyncStatusType;
  syncNow: () => Promise<void>;
  
  // Preferences & Profile
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  
  // Modals & Triggers
  isMarketplaceOpen: boolean;
  setIsMarketplaceOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  
  // Purchase / Import simulation from Marketplace
  importMarketplaceContent: (item: Partial<ContentItem>) => void;
  
  // Utilities
  clearCache: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('library');
  const [items, setItems] = useState<ContentItem[]>(() => storageService.getItems());
  const [preferences, setPreferences] = useState<UserPreferences>(() => storageService.getPreferences());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => storageService.getBookmarks());
  const [notes, setNotes] = useState<HighlightNote[]>(() => storageService.getNotes());
  
  // Active media viewer
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<'reader' | 'audiobook' | 'video' | 'article' | null>(null);
  
  // Connectivity & Sync
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>(navigator.onLine ? 'synced' : 'offline');
  
  // Modals
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => storageService.isFirstLaunch());

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
      storageService.addSyncLog('Network Reconnected', 'success', 'Background synchronization active.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
      storageService.addSyncLog('Network Offline', 'success', 'Entered offline library mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync effect when preference changes or manual sync
  const toggleOnlineOverride = () => {
    const newOnline = !isOnline;
    setIsOnline(newOnline);
    setSyncStatus(newOnline ? 'synced' : 'offline');
    storageService.addSyncLog(
      newOnline ? 'Manual Network Toggle: Online' : 'Manual Network Toggle: Offline',
      'success',
      newOnline ? 'Connected to CalmReader servers' : 'Switched to pure offline library mode'
    );
  };

  const refreshItems = () => {
    setItems(storageService.getItems());
  };

  // Find the single "Continue Reading/Watching/Listening" item
  const lastContinueId = storageService.getLastContinueId();
  const continueItem = items.find(i => i.id === lastContinueId && i.downloadStatus === 'completed') ||
    items.filter(i => i.downloadStatus === 'completed' && i.readingProgressPercent > 0 && i.readingProgressPercent < 100)
      .sort((a, b) => new Date(b.lastReadTimestamp || 0).getTime() - new Date(a.lastReadTimestamp || 0).getTime())[0] ||
    items.find(i => i.downloadStatus === 'completed') || null;

  // Media Opening logic
  const openMedia = (item: ContentItem) => {
    setActiveItem(item);
    storageService.setLastContinueId(item.id);
    if (item.type === 'book') {
      setActiveMediaType('reader');
    } else if (item.type === 'audiobook') {
      setActiveMediaType('audiobook');
    } else if (item.type === 'video') {
      setActiveMediaType('video');
    } else if (item.type === 'article') {
      setActiveMediaType('article');
    }
  };

  const closeMedia = () => {
    setActiveItem(null);
    setActiveMediaType(null);
    refreshItems();
  };

  // Progress Update
  const updateProgress = (
    itemId: string,
    progressPercent: number,
    chapterIndex: number,
    position: number
  ) => {
    const updated = storageService.updateItemProgress(itemId, progressPercent, chapterIndex, position);
    setItems(updated);
    if (activeItem && activeItem.id === itemId) {
      setActiveItem(prev => prev ? {
        ...prev,
        readingProgressPercent: progressPercent,
        lastChapterIndex: chapterIndex,
        lastPosition: position,
        lastReadTimestamp: new Date().toISOString()
      } : null);
    }
  };

  // Download Management Simulation
  const activeDownloads = items.filter(
    i => i.downloadStatus === 'downloading' || i.downloadStatus === 'queued' || i.downloadStatus === 'paused'
  );

  useEffect(() => {
    const downloadingItems = items.filter(i => i.downloadStatus === 'downloading');
    if (downloadingItems.length === 0) return;

    const interval = setInterval(() => {
      setItems(prevItems => {
        let hasChanges = false;
        const newItems = prevItems.map(item => {
          if (item.downloadStatus === 'downloading') {
            hasChanges = true;
            const increment = Math.floor(Math.random() * 8) + 12; // 12-20% per sec
            const nextProgress = Math.min(100, item.downloadProgressPercent + increment);
            
            if (nextProgress >= 100) {
              storageService.addSyncLog(
                'Download Completed',
                'success',
                `Successfully downloaded "${item.title}" (${(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB). Checksum verified.`,
                item.title
              );
              return {
                ...item,
                downloadStatus: 'completed' as const,
                downloadProgressPercent: 100,
                downloadedDate: new Date().toISOString(),
                downloadSpeedBytesPerSec: 0
              };
            }

            return {
              ...item,
              downloadProgressPercent: nextProgress,
              downloadSpeedBytesPerSec: 2400000 + Math.floor(Math.random() * 800000) // ~2.4 - 3.2 MB/s
            };
          }
          return item;
        });

        if (hasChanges) {
          storageService.saveItems(newItems);
        }
        return newItems;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [items]);

  const startDownload = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          downloadStatus: 'downloading' as const,
          downloadProgressPercent: item.downloadProgressPercent > 0 ? item.downloadProgressPercent : 5
        };
      }
      return item;
    });
    setItems(updated);
    storageService.saveItems(updated);
    storageService.addSyncLog('Download Started', 'success', `Queued download for "${items.find(i => i.id === itemId)?.title}"`);
  };

  const pauseDownload = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, downloadStatus: 'paused' as const, downloadSpeedBytesPerSec: 0 };
      }
      return item;
    });
    setItems(updated);
    storageService.saveItems(updated);
  };

  const resumeDownload = (itemId: string) => {
    startDownload(itemId);
  };

  const cancelDownload = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          downloadStatus: 'not_downloaded' as const,
          downloadProgressPercent: 0,
          downloadSpeedBytesPerSec: 0
        };
      }
      return item;
    });
    setItems(updated);
    storageService.saveItems(updated);
  };

  const deleteDownload = (itemId: string) => {
    const target = items.find(i => i.id === itemId);
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          downloadStatus: 'not_downloaded' as const,
          downloadProgressPercent: 0,
          downloadedDate: undefined
        };
      }
      return item;
    });
    setItems(updated);
    storageService.saveItems(updated);
    if (target) {
      storageService.addSyncLog('Download Deleted', 'success', `Removed local download for "${target.title}"`);
    }
  };

  const retryDownload = (itemId: string) => {
    startDownload(itemId);
  };

  // Sync Action
  const syncNow = async () => {
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }
    setSyncStatus('syncing');
    await new Promise(r => setTimeout(r, 1200)); // Simulate bidirectional sync
    setSyncStatus('synced');
    storageService.addSyncLog(
      'Cloud Sync Completed',
      'success',
      'Synchronized progress, bookmarks, notes, and license metadata with CalmReader server.'
    );
  };

  // Bookmarks & Notes Handlers
  const handleAddBookmark = (b: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const created = storageService.addBookmark(b);
    setBookmarks(storageService.getBookmarks());
    return created;
  };

  const handleDeleteBookmark = (id: string) => {
    storageService.deleteBookmark(id);
    setBookmarks(storageService.getBookmarks());
  };

  const handleAddNote = (n: Omit<HighlightNote, 'id' | 'createdAt'>) => {
    const created = storageService.addNote(n);
    setNotes(storageService.getNotes());
    return created;
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    setNotes(storageService.getNotes());
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = storageService.savePreferences(prefs);
    setPreferences(updated);
  };

  const updateUserProfile = (prof: UserProfile) => {
    storageService.saveUserProfile(prof);
    setUserProfile(prof);
  };

  const importMarketplaceContent = (newItemData: Partial<ContentItem>) => {
    const newItem: ContentItem = {
      id: `mkt_${Date.now()}`,
      title: newItemData.title || 'Untitled CalmReader Title',
      author: newItemData.author || 'CalmReader Published',
      type: newItemData.type || 'book',
      format: newItemData.format || 'epub',
      coverUrl: newItemData.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      description: newItemData.description || 'Purchased via CalmReader Marketplace.',
      category: newItemData.category || 'Mindfulness & Philosophy',
      tags: newItemData.tags || ['Marketplace', 'Purchased'],
      sizeBytes: newItemData.sizeBytes || 14500000,
      version: '1.0.0',
      checksumSha256: '9921ab009182374821a0029128bc129a',
      readingProgressPercent: 0,
      lastChapterIndex: 0,
      lastPosition: 0,
      downloadStatus: 'downloading',
      downloadProgressPercent: 5,
      licenseKey: `LIC-MKT-${Math.floor(Math.random() * 89999 + 10000)}`,
      isEncrypted: true,
      chapters: newItemData.chapters || [
        {
          id: 'chap_new_1',
          title: 'Chapter 1: Arrival',
          content: '<h2>Chapter 1: Arrival</h2><p>Welcome to your purchased content inside CalmReader Library.</p>'
        }
      ]
    };

    const updated = [newItem, ...items];
    setItems(updated);
    storageService.saveItems(updated);
    storageService.addSyncLog(
      'Marketplace Purchase Imported',
      'success',
      `Imported "${newItem.title}" from CalmReader Marketplace. Downloading package...`,
      newItem.title
    );
    setUserProfile({
      ...userProfile,
      purchasedCount: userProfile.purchasedCount + 1
    });
  };

  const handleClearCache = () => {
    storageService.clearCache();
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeItem,
        activeMediaType,
        openMedia,
        closeMedia,
        items,
        refreshItems,
        continueItem,
        activeDownloads,
        startDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        deleteDownload,
        retryDownload,
        updateProgress,
        bookmarks,
        addBookmark: handleAddBookmark,
        deleteBookmark: handleDeleteBookmark,
        notes,
        addNote: handleAddNote,
        deleteNote: handleDeleteNote,
        isOnline,
        setIsOnline,
        toggleOnlineOverride,
        syncStatus,
        syncNow,
        preferences,
        updatePreferences,
        userProfile,
        updateUserProfile,
        isMarketplaceOpen,
        setIsMarketplaceOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        importMarketplaceContent,
        clearCache: handleClearCache
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
