import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (user: User) => void;
  logout: () => void;
  setInitializing: (initializing: boolean) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: (user) => set({ user, isAuthenticated: true, isInitializing: false }),
  logout: () => set({ user: null, isAuthenticated: false, isInitializing: false }),
  setInitializing: (initializing) => set({ isInitializing: initializing }),
  updateUser: (user) => set({ user }),
}));
