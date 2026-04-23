import { create } from 'zustand';
import { UserProfile } from '../types/user.types';
import { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isSigningIn: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setSigningIn: (isSigningIn: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  isSigningIn: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setSigningIn: (isSigningIn) => set({ isSigningIn }),
}));
