import { ContentItem, Bookmark, HighlightNote, UserPreferences, SyncLog, UserProfile } from '../types/library';
import { INITIAL_LIBRARY_ITEMS, INITIAL_USER_PROFILE } from '../data/mockLibrary';

const STORAGE_KEYS = {
  ITEMS: 'calmreader_library_items',
  BOOKMARKS: 'calmreader_bookmarks',
  NOTES: 'calmreader_notes',
  PREFERENCES: 'calmreader_user_preferences',
  SYNC_LOGS: 'calmreader_sync_logs',
  USER_PROFILE: 'calmreader_user_profile',
  LAST_CONTINUE_ID: 'calmreader_last_continue_id',
  FIRST_LAUNCH: 'calmreader_first_launch_done'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  appTheme: 'calm_dark',
  language: 'English',
  downloadQuality: 'high',
  autoSync: true,
  wifiOnlyDownloads: true,
  notificationsEnabled: false,
  biometricUnlock: false,
  developerMode: false
};

class StorageService {
  // Load Library Items
  getItems(): ContentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (!data) {
        this.saveItems(INITIAL_LIBRARY_ITEMS);
        return INITIAL_LIBRARY_ITEMS;
      }
      const parsed: ContentItem[] = JSON.parse(data);
      // Filter out legacy template mock items and fake titles if present in browser local storage
      const legacyIds = new Set(['book_001', 'audio_001', 'vid_001', 'art_001']);
      const legacyTitles = [
        'letters from a stoic',
        'epistles of seneca',
        'meditations',
        'writings of marcus aurelius',
        'the lost art of deep reading',
        'maryanne wolf',
        'the principles of calm architecture',
        'juhani pallasmaa'
      ];

      const cleaned = parsed.filter(item => {
        if (legacyIds.has(item.id)) return false;
        const titleLower = (item.title || '').toLowerCase();
        const authorLower = (item.author || '').toLowerCase();
        if (legacyTitles.some(t => titleLower.includes(t) || authorLower.includes(t))) return false;
        return true;
      });

      if (cleaned.length !== parsed.length) {
        this.saveItems(cleaned);
      }
      return cleaned;
    } catch {
      return INITIAL_LIBRARY_ITEMS;
    }
  }

  saveItems(items: ContentItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to storage', e);
    }
  }

  updateItemProgress(
    id: string,
    progressPercent: number,
    chapterIndex: number,
    position: number
  ): ContentItem[] {
    const items = this.getItems();
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          readingProgressPercent: Math.min(100, Math.max(0, progressPercent)),
          lastChapterIndex: chapterIndex,
          lastPosition: position,
          lastReadTimestamp: new Date().toISOString()
        };
      }
      return item;
    });
    this.saveItems(updated);
    this.setLastContinueId(id);
    return updated;
  }

  // Last Active Item
  getLastContinueId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_CONTINUE_ID);
  }

  setLastContinueId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_CONTINUE_ID, id);
  }

  // Bookmarks
  getBookmarks(contentId?: string): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const bookmarks: Bookmark[] = data ? JSON.parse(data) : [];
      if (contentId) {
        return bookmarks.filter(b => b.contentId === contentId);
      }
      return bookmarks;
    } catch {
      return [];
    }
  }

  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const bookmarks = this.getBookmarks();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    bookmarks.unshift(newBookmark);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return newBookmark;
  }

  deleteBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }

  // Notes & Highlights
  getNotes(contentId?: string): HighlightNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      const notes: HighlightNote[] = data ? JSON.parse(data) : [];
      if (contentId) {
        return notes.filter(n => n.contentId === contentId);
      }
      return notes;
    } catch {
      return [];
    }
  }

  addNote(note: Omit<HighlightNote, 'id' | 'createdAt'>): HighlightNote {
    const notes = this.getNotes();
    const newNote: HighlightNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    return newNote;
  }

  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }

  // Preferences
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  }

  // Sync Logs
  getSyncLogs(): SyncLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_LOGS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  addSyncLog(action: string, status: SyncLog['status'], details: string, itemTitle?: string): SyncLog {
    const logs = this.getSyncLogs();
    const newLog: SyncLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      status,
      details,
      itemTitle
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    const trimmed = logs.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.SYNC_LOGS, JSON.stringify(trimmed));
    return newLog;
  }

  clearSyncLogs(): void {
    localStorage.removeItem(STORAGE_KEYS.SYNC_LOGS);
  }

  // User Profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) return INITIAL_USER_PROFILE;
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_PROFILE;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // First Launch Flag
  isFirstLaunch(): boolean {
    return !localStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
  }

  setFirstLaunchCompleted(): void {
    localStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
  }

  // Reset / Clear Data
  clearCache(): number {
    // Returns bytes cleared
    const items = this.getItems();
    // Simulate cache size calculated
    const cacheSize = 4500000; // ~4.5 MB
    this.addSyncLog('Clear Cache', 'success', `Cleared ${ (cacheSize / (1024 * 1024)).toFixed(1) } MB temporary cache`);
    return cacheSize;
  }

  resetAllData(): void {
    localStorage.clear();
  }
}

export const storageService = new StorageService();
