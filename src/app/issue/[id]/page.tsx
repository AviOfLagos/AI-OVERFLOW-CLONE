// src/app/issue/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import { z } from 'zod';
import VoteButtons from '@/components/VoteButtons';
import CommentSection from '@/components/CommentSection';
import ShareButton from '@/components/ShareButton';
import { supabase } from '@/utils/auth';
import { Database } from '@/types/database.types';

const issueIdSchema = z.string();
type Issue = Database['public']['Tables']['issues']['Row'];

export default function IssueDetailPage() {
  const params = useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = issueIdSchema.safeParse(params.id);
    if (!parsedId.success) {
      setValidationError('Invalid issue ID.');
      return;
    }

    const fetchIssue = async (id: string) => {
      try {
        const { data: issueData, error } = await supabase
          .from('issues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching issue:', error);
          setValidationError('Error fetching issue.');
        } else {
          setIssue(issueData as Issue);
        }
      } catch (error) {
        console.error('Unexpected error fetching issue:', error);
        setValidationError('Unexpected error fetching issue.');
      }
    };

    fetchIssue(params.id as string); // Added type assertion here
  }, [params.id]);

  if (validationError) {
    return <div>{validationError}</div>;
  }

  if (!issue) {
    return <div>Issue not found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {/* Display author name - will implement fetching author profile later */}
        {issue.user_id && <p><strong>Author ID:</strong> {issue.user_id}</p>} 
        <p><strong>Created At:</strong> {issue.created_at ? new Date(issue.created_at).toLocaleString() : 'N/A'}</p>

        <h1>{issue.title}</h1>
        <p>{issue.description}</p>
        <VoteButtons issueId={issue.id} />

        {issue.error_code && (
          <div>
            <h3>Error Code:</h3>
            <pre>{issue.error_code}</pre>
          </div>
        )}
        {typeof issue.screenshot_url === 'string' && (
          <div>
            <h3>Screenshot:</h3>
            <Image src={issue.screenshot_url} alt="Screenshot" width={600} height={400} />
          </div>
        )}

        <ShareButton issueId={issue.id} />

        <CommentSection issueId={issue.id} />
      </div>
    </Suspense>
  );
}