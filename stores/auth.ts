import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

interface AuthState {
  user: Tables['users']['Row'] | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: 'single' | 'relationship') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// Temporarily disable auth store functionality
export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  loadUser: async () => {},
}));