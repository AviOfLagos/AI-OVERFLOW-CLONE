'use client';

import React from 'react';
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
import { IssueItem } from '@/store/issueStore';

interface PostCardProps {
  issue: IssueItem;
}

const PostCard: React.FC<PostCardProps> = ({ issue }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{issue.title}</CardTitle>
        <CardDescription>{issue.description}</CardDescription>
        <p>
          <strong>Author:</strong> {issue.authorName}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(issue.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        {/* Additional preview or snippet can be added here */}
      </CardContent>
      <CardFooter>
        <Link href={`/issue/${issue.id}`} passHref>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
