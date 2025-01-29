import React from 'react';
import { Button } from '@/components/ui/button';
import { useIssueStore } from '@/store/issueStore';

interface VoteButtonsProps {
  issueId: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ issueId }) => {
  const { upvoteIssue, downvoteIssue, issues } = useIssueStore();
  const issue = issues.find((i) => i.id === issueId);

  if (!issue) return null;

  return (
    <div>
      <Button onClick={() => upvoteIssue(issueId)}>Upvote</Button>
      <span>{issue.votes}</span>
      <Button onClick={() => downvoteIssue(issueId)}>Downvote</Button>
    </div>
  );
};

export default VoteButtons;