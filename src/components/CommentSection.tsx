// src/components/CommentSection.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { getSession, supabase } from '@/utils/auth';
import { User } from '@/types/user';
import { Database } from '@/types/database.types';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

type CommentSchema = z.infer<typeof commentSchema>;
type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentSectionProps {
  issueId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ issueId }) => {
  const [formData, setFormData] = useState<CommentSchema>({ content: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({}); // userId: userName

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session && session.user && session.user.email) {
          setIsAuthenticated(true);
          // Re-introduced currentUser variable declaration:
          const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || '',
            email: session.user.email,
            username: session.user.user_metadata?.username || '',
            profilePicture: session.user.user_metadata?.avatar_url || '/default-avatar.png',
            techStack: [],
            shortBio: '',
            tools: [],
            techInterests: [],
          };
          setUser(currentUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: commentsData, error } = await supabase
          .from('comments')
          .select('*')
          .eq('issue_id', issueId)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching comments:', error);
        } else {
          setComments(commentsData || []);
          // Fetch authors for comments
          fetchCommentUsernames(commentsData || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchCommentUsernames = async (comments: Comment[]) => {
      if (!comments || comments.length === 0) return;

      const userIds = comments.map(comment => comment.user_id);
      const uniqueUserIds = [...new Set(userIds)] as string[];

      try {
        const { data: usersData, error } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', uniqueUserIds);

        if (error) {
          console.error('Error fetching comment authors:', error);
        } else {
          const authorsMap: Record<string, string> = {};
          usersData.forEach(user => {
            authorsMap[user.id] = user.name || 'Anonymous';
          });
          setCommentAuthors(authorsMap);
        }
      } catch (error) {
        console.error('Error fetching comment authors:', error);
      }
    };


    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel(`public:comments:issue_id=eq.${issueId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `issue_id=eq.${issueId}` }, payload => {
        console.log('Change received!', payload)
        fetchComments() // Re-fetch comments to update counts and authors in real-time
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [issueId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ content: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = commentSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.formErrors.fieldErrors as Record<string, string>);
      return;
    }
    if (!user) {
      // User is not authenticated
      return;
    }

    try {
      const { error } = await supabase.from('comments').insert({
        issue_id: issueId,
        content: formData.content,
        user_id: user.id,
      });

      if (error) {
        console.error('Error submitting comment:', error);
        setErrors({ submit: 'Failed to submit comment' });
      } else {
        setFormData({ content: '' });
        setErrors({});
      }
    } catch (error) {
      console.error('Unexpected error submitting comment:', error);
      setErrors({ submit: 'Failed to submit comment' });
    }
  };


  return (
    <div>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>
            <strong>{commentAuthors[comment.user_id] || 'Anonymous'}:</strong> 
          </p>
          <p>{comment.content}</p>
          <p>Created At: {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
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
          {/* Display submit error message */}
          {errors.submit && <p className="text-red-500">{errors.submit}</p>}
          <Button type="submit">Add Comment</Button>
        </form>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
    </div>
  );
};

export default CommentSection;