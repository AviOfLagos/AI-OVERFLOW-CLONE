-- Create 'issue_votes' table
CREATE TABLE public.issue_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- Add unique constraint to prevent duplicate votes by the same user on the same issue
    UNIQUE (user_id, issue_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for issue_votes
CREATE POLICY "Enable read access for all users" ON public.issue_votes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.issue_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.issue_votes
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.issue_votes
    FOR DELETE USING (auth.uid() = user_id);