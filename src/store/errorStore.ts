import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ErrorItem {
  id: string;
  title: string;
  description: string;
}

interface CommentItem {
  id: string;
  errorId: string;
  content: string;
}

interface ErrorState {
  errors: ErrorItem[];
  comments: CommentItem[];
  addError: (error: ErrorItem) => void;
  addComment: (comment: CommentItem) => void;
  fetchErrors: () => void;
}

export const useErrorStore = create<ErrorState>()(
  persist(
    (set) => ({
      errors: [] as ErrorItem[],
      comments: [] as CommentItem[],
      addError: (error: ErrorItem) =>
        set((state) => ({ errors: [...state.errors, error] })),
      addComment: (comment: CommentItem) =>
        set((state) => ({ comments: [...state.comments, comment] })),
      fetchErrors: () => {
        // Mock fetch errors - replace with actual API call later
        const mockErrors: ErrorItem[] = [
          {
            id: "1",
            title: "Issue post 2",
            description:
              "StackOverflow-like platform for AI coders with modern UX. Version 1 focuses on seamless issue posting, voting, and solution discovery.",
          },
          {
            id: "2",
            title: "Issue post 2",
            description:
              "StackOverflow-like platform for AI coders with modern UX. Version 1 focuses on seamless issue posting, voting, and solution discovery.",
          },
        ];
        set({ errors: mockErrors });
      },
    }),
    {
      name: 'error-storage',
    }
  )
);