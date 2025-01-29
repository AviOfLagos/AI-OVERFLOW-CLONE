import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IssueItem } from '@/store/issueStore';

interface IssueCardProps {
  issue: IssueItem;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{issue.title}</CardTitle>
        <CardDescription>{issue.description}</CardDescription>
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

export default IssueCard;
