import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  techStack?: string[];
  shortBio?: string;
  tools?: string[];
  techInterests?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: () =>
        set({
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'Avi of Lagos',
            username: 'avi_lagos',
            profilePicture: '/images/avi-profile.jpg',
            techStack: ['React', 'TypeScript', 'Next.js'],
            shortBio: 'Full-stack developer passionate about web technologies.',
            tools: ['VSCode', 'Git', 'Docker'],
            techInterests: ['AI', 'Blockchain', 'Cloud Computing'],
          },
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
      setUser: (updatedUser) =>
        set((state) => ({
          user: { ...state.user, ...updatedUser },
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);