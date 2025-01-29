import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: () =>
    set({
      isAuthenticated: true,
      user: { id: '1', name: 'Mock User' },
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),
}));