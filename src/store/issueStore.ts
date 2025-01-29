import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  errorCode?: string;
  screenshot?: string;
}

export interface CommentItem {
  id: string;
  issueId: string;
  content: string;
  userId: string;
  userName: string;
}

interface IssueState {
  issues: IssueItem[];
  comments: CommentItem[];
  addIssue: (issue: IssueItem) => void;
  addComment: (comment: CommentItem) => void;
  fetchIssues: () => void;
  upvoteIssue: (issueId: string) => void;
  downvoteIssue: (issueId: string) => void;
}

export const useIssueStore = create<IssueState>()(
  persist(
    (set) => ({
      issues: [] as IssueItem[],
      comments: [] as CommentItem[],
      addIssue: (issue: IssueItem) =>
        set((state) => ({ issues: [...state.issues, issue] })),
      addComment: (comment: CommentItem) =>
        set((state) => ({ comments: [...state.comments, comment] })),
      fetchIssues: () => {
        // Mock fetch issues - replace with actual API call later
        const mockIssues: IssueItem[] = [
          {
            id: '1',
            title: 'Issue 1',
            description: 'Description 1',
            votes: 0,
          },
          {
            id: '2',
            title: 'Issue 2',
            description: 'Description 2',
            votes: 0,
          },
        ];
        set((state) => {
          if (state.issues.length === 0) {
            return { issues: mockIssues };
          } else {
            return {};
          }
        });
      },
      upvoteIssue: (issueId: string) => {
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue
          ),
        }));
      },
      downvoteIssue: (issueId: string) => {
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId ? { ...issue, votes: issue.votes - 1 } : issue
          ),
        }));
      },
    }),
    {
      name: 'issue-storage',
    }
  )
);