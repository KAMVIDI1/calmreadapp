import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { MarketplaceModal } from './components/MarketplaceModal';
import { AuthModal } from './components/auth/AuthModal';
import { MiniPlayer } from './components/MiniPlayer';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeLandingPage } from './components/WelcomeLandingPage';

import { LibraryScreen } from './components/library/LibraryScreen';
import { StudioScreen } from './components/studio/StudioScreen';
import { DownloadManagerScreen } from './components/downloads/DownloadManagerScreen';
import { StorageManagerScreen } from './components/storage/StorageManagerScreen';
import { LibraryHealthScreen } from './components/health/LibraryHealthScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { DeveloperDiagnosticsScreen } from './components/settings/DeveloperDiagnosticsScreen';

import { EpubPdfReader } from './components/reader/EpubPdfReader';
import { ArticleReader } from './components/reader/ArticleReader';
import { AudiobookPlayer } from './components/players/AudiobookPlayer';
import { VideoPlayer } from './components/players/VideoPlayer';

const MainLayout: React.FC = () => {
  const { currentScreen, activeItem, activeMediaType, closeMedia, isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const [isBooting, setIsBooting] = useState<boolean>(true);

  if (isBooting) {
    return <SplashScreen onFinish={() => setIsBooting(false)} />;
  }

  if (isOnboardingOpen) {
    return (
      <WelcomeLandingPage
        onGetStarted={() => setIsOnboardingOpen(false)}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'library':
        return <LibraryScreen />;
      case 'studio':
        return <StudioScreen />;
      case 'downloads':
        return <DownloadManagerScreen />;
      case 'storage':
        return <StorageManagerScreen />;
      case 'health':
        return <LibraryHealthScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'developer':
        return <DeveloperDiagnosticsScreen />;
      default:
        return <LibraryScreen />;
    }
  };

  const renderActiveMedia = () => {
    if (!activeItem || !activeMediaType) return null;

    switch (activeMediaType) {
      case 'reader':
        return <EpubPdfReader item={activeItem} onClose={closeMedia} />;
      case 'article':
        return <ArticleReader item={activeItem} onClose={closeMedia} />;
      case 'audiobook':
        return <AudiobookPlayer item={activeItem} onClose={closeMedia} />;
      case 'video':
        return <VideoPlayer item={activeItem} onClose={closeMedia} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121619] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
      <Header />
      
      <main className="transition-all duration-300">
        {renderScreen()}
      </main>

      <Navigation />
      <MiniPlayer />

      {/* Fullscreen Media Viewer Overlay */}
      {renderActiveMedia()}

      {/* System Modals */}
      <MarketplaceModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
