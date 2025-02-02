-- migrations/create_issues_table.sql

-- Create 'issues' table
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  error_code text,
  screenshot_url text,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users (id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Removed IF NOT EXISTS)
CREATE POLICY "Enable read access for all users" ON public.issues
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.issues
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for owners" ON public.issues
FOR DELETE USING (auth.uid() = user_id);