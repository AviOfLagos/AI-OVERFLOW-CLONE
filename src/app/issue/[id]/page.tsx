'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useIssueStore, IssueItem } from '@/store/issueStore';
import { useEffect, useState, Suspense } from 'react';
import { z } from 'zod';
import VoteButtons from '@/components/VoteButtons';
import CommentSection from '@/components/CommentSection';
import ShareButton from '@/components/ShareButton';

const issueIdSchema = z.string();

export default function IssueDetailPage() {
  const params = useParams();
  const { issues } = useIssueStore();
  const [issue, setIssue] = useState<IssueItem | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = issueIdSchema.safeParse(params.id);
    if (!parsedId.success) {
      setValidationError('Invalid issue ID.');
      return;
    }

    const foundIssue = issues.find((i) => i.id === params.id);
    setIssue(foundIssue || null);
  }, [params.id, issues]);

  if (validationError) {
    return <div>{validationError}</div>;
  }

  if (!issue) {
    return <div>Issue not found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <p><strong>Author:</strong> {issue.authorName}</p>
        <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>

        <h1>{issue.title}</h1>
        <p>{issue.description}</p>
        <VoteButtons issueId={issue.id} />

        {issue.errorCode && (
          <div>
            <h3>Error Code:</h3>
            <pre>{issue.errorCode}</pre>
          </div>
        )}
        {issue.screenshot && (
          <div>
            <h3>Screenshot:</h3>
            <Image src={issue.screenshot} alt="Screenshot" width={600} height={400} />
          </div>
        )}

        <ShareButton issueId={issue.id} />

        <CommentSection issueId={issue.id} />
      </div>
    </Suspense>
  );
}