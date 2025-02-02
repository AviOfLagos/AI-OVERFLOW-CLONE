-- Manual seed data for AIOverflow (3 Users) - Placeholder Images from via.placeholder.com

-- User UUIDs
-- user_id_1: e6940835-091f-4fc3-8309-09167ec85c32 (User One)
-- user_id_2: f1b096b5-671c-482f-80bf-ce20d5c4b288 (User Two)
-- user_id_3: acfe8f32-b95b-4c3a-a499-c7856a7f7c83 (User Three)

-- Issue UUIDs
-- issue_id_1: a83f70eb-a997-4e51-88cc-ed44b848d2e8 (Issue 1)
-- issue_id_2: cfe41d25-103a-4c59-8434-ba11209f487f (Issue 2)
-- issue_id_3: 4a585ce5-c0fe-4c61-9949-b4aa5754d962 (Issue 3)


-- Insert users into auth.users table (3 sample users with predefined UUIDs)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at) VALUES
  ('e6940835-091f-4fc3-8309-09167ec85c32', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user1@example.com', '$2a$10$yvgYe1ikmSj9s9vS1OBPze/rSea8uziEE5rQjjQ7b1LAPG1YjQ5UO', NOW(), NOW(), NOW()), 
  ('f1b096b5-671c-482f-80bf-ce20d5c4b288', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user2@example.com', '$2a$10$yvgYe1ikmSj9s9vS1OBPze/rSea8uziEE5rQjjQ7b1LAPG1YjQ5UO', NOW(), NOW(), NOW()), 
  ('acfe8f32-b95b-4c3a-a499-c7856a7f7c83', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user3@example.com', '$2a$10$yvgYe1ikmSj9s9vS1OBPze/rSea8uziEE5rQjjQ7b1LAPG1YjQ5UO', NOW(), NOW(), NOW());

-- Insert profiles (3 sample profiles, matching user IDs)
INSERT INTO public.profiles (id, updated_at, username, name, avatar_url, short_bio, tech_stack, tools, tech_interests) VALUES
  ('e6940835-091f-4fc3-8309-09167ec85c32', NOW(), 'user1', 'User One', 'https://via.placeholder.com/150', 'Bio 1', '{"React", "Node.js"}', '{"VSCode", "Git"}', '{"Frontend", "Backend"}'),
  ('f1b096b5-671c-482f-80bf-ce20d5c4b288', NOW(), 'user2', 'User Two', 'https://via.placeholder.com/150', 'Bio 2', '{"Vue.js", "Python"}', '{"Sublime Text", "Docker"}', '{"Backend", "AI"}'),
  ('acfe8f32-b95b-4c3a-a499-c7856a7f7c83', NOW(), 'user3', 'User Three', 'https://via.placeholder.com/150', 'Bio 3', '{"Angular", "Java"}', '{"IntelliJ IDEA", "Maven"}', '{"Mobile", "Cloud"}');

-- Insert issues (3 sample issues, associated with users)
INSERT INTO public.issues (id, title, description, error_code, screenshot_url, created_at, user_id) VALUES
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'Issue 1 Title', 'Issue 1 Description', 'AIERR-0001', 'https://via.placeholder.com/600x400', NOW(), 'e6940835-091f-4fc3-8309-09167ec85c32'),
  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'Issue 2 Title', 'Issue 2 Description', 'AIERR-0002', 'https://via.placeholder.com/600x400', NOW(), 'f1b096b5-671c-482f-80bf-ce20d5c4b288'),
  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'Issue 3 Title', 'Issue 3 Description', 'AIERR-0003', 'https://via.placeholder.com/600x400', NOW(), 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83');

-- Insert comments for all issues
INSERT INTO public.comments (issue_id, user_id, content) VALUES
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'e6940835-091f-4fc3-8309-09167ec85c32', 'Comment 1 for issue 1 by User 1'),
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'Comment 2 for issue 1 by User 2'),
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'Comment 3 for issue 1 by User 3'),

  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'e6940835-091f-4fc3-8309-09167ec85c32', 'Comment 1 for issue 2 by User 1'),
  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'Comment 2 for issue 2 by User 2'),
  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'Comment 3 for issue 2 by User 3'),

  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'e6940835-091f-4fc3-8309-09167ec85c32', 'Comment 1 for issue 3 by User 1'),
  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'Comment 2 for issue 3 by User 2'),
  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'Comment 3 for issue 3 by User 3');

-- Insert issue votes for all issues
INSERT INTO public.issue_votes (issue_id, user_id, vote_type) VALUES
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'e6940835-091f-4fc3-8309-09167ec85c32', 'upvote'),
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'downvote'),
  ('a83f70eb-a997-4e51-88cc-ed44b848d2e8', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'upvote'),

  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'e6940835-091f-4fc3-8309-09167ec85c32', 'downvote'),
  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'upvote'),
  ('cfe41d25-103a-4c59-8434-ba11209f487f', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'downvote'),

  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'e6940835-091f-4fc3-8309-09167ec85c32', 'upvote'),
  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'f1b096b5-671c-482f-80bf-ce20d5c4b288', 'upvote'),
  ('4a585ce5-c0fe-4c61-9949-b4aa5754d962', 'acfe8f32-b95b-4c3a-a499-c7856a7f7c83', 'downvote');
