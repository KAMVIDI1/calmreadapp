import React from 'react';
import {
  User,
  BookOpen,
  Headphones,
  Flame,
  Smartphone,
  Shield,
  Fingerprint,
  LogOut,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { userProfile, preferences, updatePreferences, setIsAuthModalOpen } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24">
      
      {/* Header Profile Card */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={userProfile.avatarUrl}
          alt={userProfile.name}
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full border-2 border-amber-600/60 shadow-lg object-cover shrink-0"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100">
                {userProfile.name}
              </h2>
              <p className="text-xs text-stone-400 font-sans">{userProfile.email}</p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-medium transition-colors"
            >
              Manage CalmReader Account
            </button>
          </div>

          <p className="text-xs text-stone-400 font-sans pt-1">
            Member since {new Date(userProfile.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })} • CalmReader Companion Verified
          </p>
        </div>
      </div>

      {/* Reading Statistics */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Reading & Listening Velocity
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Purchased Titles</span>
            <span className="text-xl font-serif font-medium text-amber-400">
              {userProfile.purchasedCount}
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Books Completed</span>
            <span className="text-xl font-serif font-medium text-stone-200">
              {userProfile.booksFinished}
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Listening Hours</span>
            <span className="text-xl font-serif font-medium text-stone-200 flex items-center gap-1">
              <Headphones className="w-4 h-4 text-emerald-400" />
              {userProfile.listeningHours} hrs
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Active Reading Streak</span>
            <span className="text-xl font-serif font-medium text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {userProfile.streakDays} Days
            </span>
          </div>

        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          Authorized Offline Devices
        </h3>

        <div className="space-y-2 text-xs font-sans">
          {userProfile.connectedDevices.map(dev => (
            <div
              key={dev.id}
              className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-stone-200 font-medium block">{dev.name}</span>
                  <span className="text-[10px] text-stone-500">{dev.lastActive}</span>
                </div>
              </div>

              {dev.current && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-950 text-amber-400 border border-amber-800/60">
                  This Device
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
