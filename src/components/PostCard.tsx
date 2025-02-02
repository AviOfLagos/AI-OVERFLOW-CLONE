// src/components/PostCard.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/database.types';
import VoteButtons from './VoteButtons';
import { supabase } from '@/utils/auth';

type Issue = Database['public']['Tables']['issues']['Row'];

interface PostCardProps {
  issue: Issue;
}

const PostCard: React.FC<PostCardProps> = ({ issue }) => {
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (issue.user_id) {
        const query = supabase
          .from('profiles')
          .select('name')
          .eq('id', issue.user_id)
          .single();

        const response = await query; // Get the raw response object

        if (response.error) {
          // Improved error logging with raw response
          console.error('Error fetching profile:', response.error.message, response.error.stack, 'Query:', query.toString(), 'Raw response:', response);
          setAuthorName('Anonymous');
        } else {
          // Log the raw response data as well
          console.log('Profile fetch response data:', response.data);
          setAuthorName(response.data?.name || 'Anonymous');
        }
      } else {
        setAuthorName('Anonymous');
      }
    };

    fetchAuthorName();
  }, [issue.user_id]);


  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{issue.title}</CardTitle>
        <CardDescription>{issue.description}</CardDescription>
        <p>
          <strong>Author:</strong> {authorName}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {issue.created_at ? new Date(issue.created_at).toLocaleString() : 'N/A'}
        </p>
      </CardHeader>
      <CardContent>
        {/* Additional preview or snippet can be added here */}
      </CardContent>
      <CardFooter className="justify-between">
        <Link href={`/issue/${issue.id}`} passHref>
          <Button>View Details</Button>
        </Link>
        <VoteButtons issueId={issue.id} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
