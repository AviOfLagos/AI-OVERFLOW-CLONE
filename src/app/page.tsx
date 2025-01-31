'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Suspense } from 'react';
import { useIssueStore } from '@/store/issueStore';
import PostCard from '@/components/PostCard';

export default function HomePage() {
  const { issues, fetchIssues } = useIssueStore();

  const { isAuthenticated, user } = useAuthStore();
  const username = isAuthenticated ? user?.name : null;

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {username && (
          <div className="p-4 bg-gray-100">
            <p className="text-gray-700">Welcome, {username}!</p>
          </div>
        )}

        {issues.length > 0 ? (
          issues.map((issue) => (
            <PostCard key={issue.id} issue={issue} />
          ))
        ) : (
          <div>No errors found.</div>
        )}
      </div>
    </Suspense>
  );
}
