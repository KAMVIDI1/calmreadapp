import React from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  User,
  Settings,
  Terminal
} from 'lucide-react';
import { useApp, ActiveScreen } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeDownloads, preferences } = useApp();

  const navItems: { id: ActiveScreen; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'downloads', label: 'Downloads', icon: Download, badge: activeDownloads.length },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (preferences.developerMode) {
    navItems.push({ id: 'developer', label: 'Dev', icon: Terminal });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#121619]/95 backdrop-blur-lg border-t border-stone-800/80 px-2 py-1 pb-2">
      <div className="max-w-xl mx-auto flex items-center justify-around gap-1 overflow-x-auto no-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-2 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-800/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

