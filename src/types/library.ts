export type ContentType = 'book' | 'article' | 'audiobook' | 'video';
export type FormatType = 'epub' | 'pdf' | 'mp3' | 'mp4' | 'article';

export type DownloadStatus = 'not_downloaded' | 'queued' | 'downloading' | 'completed' | 'paused' | 'failed' | 'corrupted';

export interface Chapter {
  id: string;
  title: string;
  content?: string; // HTML or Markdown text for EPUB/Articles
  audioUrl?: string; // For Audiobooks
  durationSeconds?: number;
  videoUrl?: string; // For Videos
}

export interface Bookmark {
  id: string;
  contentId: string;
  chapterIndex: number;
  position: number; // page, percentage, or timestamp in seconds
  title: string;
  createdAt: string;
  note?: string;
}

export interface HighlightNote {
  id: string;
  contentId: string;
  chapterIndex: number;
  selectedText: string;
  noteText: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  author: string;
  type: ContentType;
  format: FormatType;
  coverUrl: string;
  description: string;
  category: string;
  tags: string[];
  sizeBytes: number;
  downloadedDate?: string;
  version: string;
  checksumSha256: string;
  
  // Progress
  readingProgressPercent: number; // 0 to 100
  lastChapterIndex: number;
  lastPosition: number; // page number, character offset, or seconds elapsed
  totalDurationSeconds?: number; // for audio/video
  estimatedReadingMinutes?: number;
  lastReadTimestamp?: string;
  
  // Download State
  downloadStatus: DownloadStatus;
  downloadProgressPercent: number; // 0 to 100
  downloadSpeedBytesPerSec?: number;
  
  // Content details
  chapters: Chapter[];
  
  // Licensing & Security
  licenseKey?: string;
  isEncrypted?: boolean;
}

export type ReaderTheme = 'light' | 'sepia' | 'cream' | 'dark';
export type FontFamily = 'serif' | 'sans' | 'mono' | 'dyslexic';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number; // 12 to 32
  fontFamily: FontFamily;
  lineHeight: number; // 1.2 to 2.0
  marginSize: number; // 8 to 48
  brightness: number; // 10 to 100
  scrollMode: 'paginated' | 'vertical';
}

export type AppTheme = 'system' | 'light' | 'sepia' | 'calm_dark';

export interface UserPreferences {
  appTheme: AppTheme;
  language: string;
  downloadQuality: 'high' | 'standard' | 'compressed';
  autoSync: boolean;
  wifiOnlyDownloads: boolean;
  notificationsEnabled: boolean;
  biometricUnlock: boolean;
  developerMode: boolean;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  action: string;
  itemTitle?: string;
  status: 'success' | 'conflict_resolved' | 'failed';
  details: string;
}

export type SyncStatusType = 'synced' | 'syncing' | 'offline' | 'failed' | 'retry';

export interface StorageStats {
  booksBytes: number;
  articlesBytes: number;
  audiobooksBytes: number;
  videosBytes: number;
  cacheBytes: number;
  totalUsedBytes: number;
  availableBytes: number;
}

export interface HealthCheckResult {
  lastScanned: string;
  verifiedItemsCount: number;
  brokenDownloadsCount: number;
  corruptedPackagesCount: number;
  missingFilesCount: number;
  databaseStatus: 'healthy' | 'warnings' | 'corrupted';
  issues: {
    itemId: string;
    itemTitle: string;
    issueType: 'missing_file' | 'checksum_mismatch' | 'broken_metadata';
    description: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  purchasedCount: number;
  booksFinished: number;
  listeningHours: number;
  streakDays: number;
  connectedDevices: { id: string; name: string; lastActive: string; current: boolean }[];
}
