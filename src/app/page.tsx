'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useIssueStore } from '@/store/issueStore';
import IssueCard from '@/components/IssueCard';

export default function HomePage() {
  const { issues, fetchIssues } = useIssueStore();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <div>No errors found.</div>
        )}
      </div>
    </Suspense>
  );
}
