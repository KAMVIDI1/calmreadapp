import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/supabaseAuth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await authService.signIn(email, password);
    setUser(user);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const user = await authService.signUp(email, password, displayName);
    setUser(user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (data: { displayName?: string; avatarUrl?: string }) => {
    await authService.updateProfile(data);
    const updated = await authService.getCurrentUser();
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
