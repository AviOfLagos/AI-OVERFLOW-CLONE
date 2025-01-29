'use client';

import React, { useState } from 'react';
import { useIssueStore, CommentItem } from '@/store/issueStore';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

type CommentSchema = z.infer<typeof commentSchema>;

interface CommentSectionProps {
  issueId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ issueId }) => {
  const { comments, addComment } = useIssueStore();
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState<CommentSchema>({ content: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof CommentSchema, string[]>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ content: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = commentSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.formErrors.fieldErrors);
      return;
    }
    const newComment: CommentItem = {
      id: uuidv4(),
      issueId,
      content: formData.content,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous',
    };
    addComment(newComment);
    setFormData({ content: '' });
  };

  const issueComments = comments.filter((comment) => comment.issueId === issueId);

  return (
    <div>
      <h2>Comments</h2>
      {issueComments.map((comment) => (
        <div key={comment.id}>
          <p><strong>{comment.userName}:</strong></p>
          <p>{comment.content}</p>
          {/* Display username if available */}
        </div>
      ))}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <Input
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Add a comment..."
          />
          {errors.content && <p>{errors.content[0]}</p>}
          <Button type="submit">Add Comment</Button>
        </form>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
    </div>
  );
};

export default CommentSection;