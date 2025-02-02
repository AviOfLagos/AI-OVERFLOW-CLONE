-- Create 'profiles' table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE,
    username VARCHAR(150) UNIQUE,
    name VARCHAR(150),
    avatar_url TEXT,
    short_bio TEXT,
    tech_stack TEXT[],
    tools TEXT[],
    tech_interests TEXT[],

    CONSTRAINT profiles_username_key UNIQUE (username)
    -- Removed redundant primary key constraint: CONSTRAINT profiles_pkey PRIMARY KEY (id) 
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles' table
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Enable update for users based on id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable delete for users based on id" ON public.profiles
    FOR DELETE USING (auth.uid() = id);