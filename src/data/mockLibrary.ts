import { ContentItem, UserProfile } from '../types/library';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_calm_98231',
  name: 'Calm Reader',
  email: 'reader@calmreader.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  joinedDate: new Date().toISOString().split('T')[0],
  purchasedCount: 0,
  booksFinished: 0,
  listeningHours: 0,
  streakDays: 0,
  connectedDevices: [
    { id: 'dev_1', name: 'CalmReader Companion (This Device)', lastActive: 'Active Now', current: true }
  ]
};

export const INITIAL_LIBRARY_ITEMS: ContentItem[] = [];
