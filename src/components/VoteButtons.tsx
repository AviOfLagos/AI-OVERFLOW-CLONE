// src/components/VoteButtons.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/database.types';
import { supabase, getSession } from '@/utils/auth';

type Issue = Database['public']['Tables']['issues']['Row'];

interface VoteButtonsProps {
  issueId: Issue['id'];
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ issueId }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session && session.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);


  useEffect(() => {
    // Fetch initial vote counts and user's vote and set up realtime subscription
    const fetchVotesAndSubscribe = async () => {
      try {
        const { data: votes, error } = await supabase
          .from('issue_votes')
          .select('*')
          .eq('issue_id', issueId);

        if (error) {
          console.error('Error fetching votes:', error);
        } else {
          let upvoteCount = 0;
          let downvoteCount = 0;
          let currentUserVote: 'upvote' | 'downvote' | null = null;

          votes.forEach(vote => {
            if (vote.vote_type === 'upvote') {
              upvoteCount++;
            } else if (vote.vote_type === 'downvote') {
              downvoteCount++;
            }
            if (userId && vote.user_id === userId) {
              currentUserVote = vote.vote_type;
            }
          });

          setUpvotes(upvoteCount);
          setDownvotes(downvoteCount);
          setUserVote(currentUserVote);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotesAndSubscribe();

     // Realtime subscription for votes
     const channel = supabase
     .channel(`public:issue_votes:issue_id=eq.${issueId}`)
     .on('postgres_changes', { event: '*', schema: 'public', table: 'issue_votes', filter: `issue_id=eq.${issueId}` }, payload => {
       console.log('Vote change received!', payload)
       fetchVotesAndSubscribe() // Re-fetch votes to update counts in real-time
     })
     .subscribe()

   return () => {
     supabase.removeChannel(channel)
   }


  }, [issueId, userId]);

  const handleUpvote = async () => {
    if (!userId) {
      alert('You must be logged in to vote.');
      return;
    }

    try {
      if (userVote === 'upvote') {
        // User is unvoting
        await supabase
          .from('issue_votes')
          .delete()
          .eq('issue_id', issueId)
          .eq('user_id', userId);
        setUserVote(null);
        setUpvotes(prevUpvotes => prevUpvotes - 1); // Update upvotes using functional update
      } else {
        // User is upvoting or changing vote from downvote to upvote
        const { error } = await supabase
          .from('issue_votes')
          .upsert({ issue_id: issueId, user_id: userId, vote_type: 'upvote' }, { onConflict: 'issue_id,user_id' });
        if (error) {
          console.error('Error upvoting:', error);
        } else {
          setUserVote('upvote');
          setUpvotes(prevUpvotes => prevUpvotes + (userVote === 'downvote' ? 2 : 1)); // Update upvotes using functional update
          setDownvotes(prevDownvotes => prevDownvotes - (userVote === 'downvote' ? 1 : 0)); // Update downvotes using functional update
        }
      }
    } catch (error) {
      console.error('Unexpected error handling upvote:', error);
    }
  };

  const handleDownvote = async () => {
     if (!userId) {
      alert('You must be logged in to vote.');
      return;
    }

    try {
      if (userVote === 'downvote') {
        // User is unvoting
        await supabase
          .from('issue_votes')
          .delete()
          .eq('issue_id', issueId)
          .eq('user_id', userId);
        setUserVote(null);
        setDownvotes(prevDownvotes => prevDownvotes - 1); // Update downvotes using functional update
      } else {
        // User is downvoting or changing vote from upvote to downvote
        const { error } = await supabase
          .from('issue_votes')
          .upsert({ issue_id: issueId, user_id: userId, vote_type: 'downvote' }, { onConflict: 'issue_id,user_id' });
        if (error) {
          console.error('Error downvoting:', error);
        } else {
          setUserVote('downvote');
          setDownvotes(prevDownvotes => prevDownvotes + (userVote === 'upvote' ? 2 : 1)); // Update downvotes using functional update
          setUpvotes(prevUpvotes => prevUpvotes - (userVote === 'upvote' ? 1 : 0)); // Update upvotes using functional update
        }
      }
    } catch (error) {
      console.error('Unexpected error handling downvote:', error);
    }
  };


  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="sm" onClick={handleUpvote} className={`flex items-center space-x-2 ${userVote === 'upvote' ? 'text-blue-500' : ''}`}>
        <ArrowUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDownvote} className={`flex items-center space-x-2 ${userVote === 'downvote' ? 'text-red-500' : ''}`}>
        <ArrowDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </Button>
    </div>
  );
};

export default VoteButtons;
