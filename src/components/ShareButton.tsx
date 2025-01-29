import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ShareButtonProps {
  issueId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ issueId }) => {
  const [open, setOpen] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/issue/${issueId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    // Optionally, display a notification to the user
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this Issue</DialogTitle>
        </DialogHeader>
        <div>
          <p>You can share this issue using the link below:</p>
          <Input value={shareUrl} readOnly />
          <Button onClick={handleCopy}>Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;