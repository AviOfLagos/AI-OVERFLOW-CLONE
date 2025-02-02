-- Create 'comments' table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies for 'comments' table
CREATE POLICY "Enable read access for all users" ON public.comments FOR
    SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.comments FOR
    INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.comments FOR
    UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.comments FOR
    DELETE USING (auth.uid() = user_id);