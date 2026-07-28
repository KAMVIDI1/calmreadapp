import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Globe,
  Download,
  Wifi,
  Bell,
  Terminal,
  Shield,
  Info,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppTheme } from '../../types/library';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentScreen } = useApp();
  const [versionTapCount, setVersionTapCount] = useState(0);

  const handleVersionTap = () => {
    const next = versionTapCount + 1;
    setVersionTapCount(next);
    if (next >= 5) {
      updatePreferences({ developerMode: true });
      alert('Developer Diagnostics Mode Unlocked! Check the Dev Mode tab in navigation.');
      setVersionTapCount(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24">
      
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-stone-400 font-sans mt-1">
          Customize application themes, download behavior, network sync, and diagnostic settings.
        </p>
      </div>

      {/* Appearance Theme */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Moon className="w-4 h-4 text-amber-400" />
          Application Appearance Theme
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
          {[
            { id: 'calm_dark', label: 'Calm Night', sub: 'Dark Charcoal' },
            { id: 'sepia', label: 'Warm Sepia', sub: 'Eye-safe Paper' },
            { id: 'light', label: 'Classic Light', sub: 'Clean White' },
            { id: 'system', label: 'System Default', sub: 'Auto Switch' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => updatePreferences({ appTheme: t.id as AppTheme })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                preferences.appTheme === t.id
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300 ring-1 ring-amber-600'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span className="font-serif font-medium block">{t.label}</span>
              <span className="text-[10px] text-stone-500">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Network & Downloads */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-amber-400" />
          Network & Download Constraints
        </h3>

        <div className="space-y-3 text-xs font-sans">
          
          <div className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 rounded-xl">
            <div>
              <span className="text-stone-200 font-medium block">Wi-Fi Only Downloads</span>
              <span className="text-stone-500 text-[11px]">Prevent downloading large media packages over cellular data.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.wifiOnlyDownloads}
              onChange={(e) => updatePreferences({ wifiOnlyDownloads: e.target.checked })}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 rounded-xl">
            <div>
              <span className="text-stone-200 font-medium block">Background Auto-Sync</span>
              <span className="text-stone-500 text-[11px]">Automatically synchronize reading progress when online.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoSync}
              onChange={(e) => updatePreferences({ autoSync: e.target.checked })}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 rounded-xl">
            <div>
              <span className="text-stone-200 font-medium block">Developer Diagnostics Mode</span>
              <span className="text-stone-500 text-[11px]">Enables raw database tables, sync queue, and log inspector.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.developerMode}
              onChange={(e) => updatePreferences({ developerMode: e.target.checked })}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* About & Version Trigger */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-3 text-xs font-sans">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          About CalmReader Library
        </h3>

        <div className="space-y-1 text-stone-400">
          <p>CalmReader Library Companion v2.4.2 (Build 98201)</p>
          <p>Official offline native companion application.</p>
        </div>

        <button
          onClick={handleVersionTap}
          className="text-[11px] text-amber-400/90 hover:underline pt-2 inline-block font-mono"
        >
          Tap version to unlock Developer Mode ({versionTapCount}/5 taps)
        </button>
      </div>

    </div>
  );
};
