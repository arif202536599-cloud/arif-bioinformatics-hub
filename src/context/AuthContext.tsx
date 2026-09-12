import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuestDemo: boolean;
  isSupabaseConfigured: boolean;
  isLoading: boolean;
  enterGuestDemo: () => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'arif_bio_guest_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if real Supabase auth is active
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'researcher@biohub.edu',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Bioinformatics Student',
            role: 'MPhil Student / Researcher',
            isGuest: false,
          });
        } else {
          checkGuestSession();
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'researcher@biohub.edu',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Bioinformatics Student',
            role: 'MPhil Student / Researcher',
            isGuest: false,
          });
        } else {
          checkGuestSession();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local Guest / Demo mode initialization
      checkGuestSession();
      setIsLoading(false);
    }
  }, []);

  const checkGuestSession = () => {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        enterGuestDemo();
      }
    } else {
      // Default to guest demo for immediate exploration
      enterGuestDemo();
    }
  };

  const enterGuestDemo = () => {
    const demoUser: UserProfile = {
      id: 'demo-guest-' + Math.random().toString(36).substring(2, 8),
      email: 'guest.student@biohub.demo',
      name: 'Guest Bioinformatics Researcher',
      role: 'MPhil Bioinformatics Student (Demo Mode)',
      isGuest: true,
    };
    setUser(demoUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(demoUser));
  };

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase && password) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        return { success: false, error: message };
      }
    } else {
      // Local simulated login
      const localUser: UserProfile = {
        id: 'user-' + btoa(email).substring(0, 8),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
        role: 'Bioinformatics Researcher (Local Mode)',
        isGuest: false,
      };
      setUser(localUser);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localUser));
      return { success: true };
    }
  };

  const signUp = async (email: string, password?: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase && password) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || email.split('@')[0] } },
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        return { success: false, error: message };
      }
    } else {
      const localUser: UserProfile = {
        id: 'user-' + btoa(email).substring(0, 8),
        email,
        name: name || email.split('@')[0].toUpperCase(),
        role: 'Bioinformatics Researcher (Local Mode)',
        isGuest: false,
      };
      setUser(localUser);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localUser));
      return { success: true };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(GUEST_STORAGE_KEY);
    enterGuestDemo();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuestDemo: !!user?.isGuest,
        isSupabaseConfigured,
        isLoading,
        enterGuestDemo,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
