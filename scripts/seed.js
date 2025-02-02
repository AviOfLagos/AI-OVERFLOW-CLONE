// scripts/seed.js

import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin access

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, { // Use service role key for admin client
  auth: {
    persistSession: false, // Disable session persistence for admin client
  },
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Delay function

async function seedDatabase() {
  const numUsers = 10;
  const numIssues = 10;
  const commentsPerIssue = 3;
  const votesPerIssue = 5;

  console.log('Seeding database...');

  // 1. Create Users and Profiles
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const email = faker.internet.email();
    const password = 'password123'; // Default password for all seeded users
    // Updated to use faker.internet.username() instead of deprecated faker.internet.userName()
    const username = faker.internet.username(); 
    const name = faker.person.fullName();
    const profilePicture = faker.image.avatar();
    const shortBio = faker.lorem.sentence();
    const techStack = faker.helpers.shuffle(['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js']).slice(0, 3);
    const tools = faker.helpers.shuffle(['VSCode', 'Git', 'npm', 'Yarn', 'ESLint']).slice(0, 2);
    const techInterests = faker.helpers.shuffle(['Frontend', 'Backend', 'Full-stack', 'Mobile', 'AI']).slice(0, 2);


    const { data: authData, error: authError } = await supabase.auth.admin.createUser({ // Use admin client to create user
      email,
      password,
      user_metadata: { // Pass user metadata here for admin client
        username,
        name,
        avatar_url: profilePicture,
      }
    });

    if (authError) {
      console.error(`Error creating user ${email}:`, authError.message, authError.stack); // Improved error logging for user creation
      continue; // Skip to the next user
    }

    const user = authData.user;
    users.push(user);

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        name,
        avatar_url: profilePicture,
        short_bio: shortBio,
        tech_stack: techStack,
        tools: tools,
        tech_interests: techInterests,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error(`Error creating profile for ${email}:`, profileError.message, profileError.stack); // Improved error logging for profile creation
    } else {
      console.log(`Created user and profile: ${email}`);
    }

    await delay(1000); // Increased delay to 1000ms (1 second) to avoid rate limit
  }


  // 2. Create Issues
  const issues = [];
  for (let i = 0; i < numIssues; i++) {
    const title = faker.lorem.sentence().slice(0, 149); // Ensure title is within limit
    const description = faker.lorem.paragraphs(2);
    const errorCode = `AIERR-${faker.string.numeric(4)}`;
    const screenshotUrl = faker.image.url();
    const randomUser = faker.helpers.arrayElement(users);

    const { data: issueData, error: issueError } = await supabase
      .from('issues')
      .insert({
        title,
        description,
        error_code: errorCode,
        screenshot_url: screenshotUrl,
        user_id: randomUser.id,
      })
      .select()
      .single();

    if (issueError) {
      console.error(`Error creating issue: ${title}`, issueError);
    } else {
      issues.push(issueData);
      console.log(`Created issue: ${title}`);
    }


     // 3. Create Comments for some issues
     if (i % 2 === 0) { // Add comments to every other issue
      for (let j = 0; j < commentsPerIssue; j++) {
        const commentContent = faker.lorem.sentence();
        const randomCommentUser = faker.helpers.arrayElement(users);
        const currentIssue = issueData;

        const { error: commentError } = await supabase
          .from('comments')
          .insert({
            issue_id: currentIssue.id,
            user_id: randomCommentUser.id,
            content: commentContent,
          });

        if (commentError) {
          console.error(`Error creating comment for issue: ${title}`, commentError);
        } else {
          console.log(`Created comment for issue: ${title}`);
        }
      }
    }

    // 4. Create Votes for some issues
    if (i % 3 === 0) { // Add votes to every third issue
      for (let k = 0; k < votesPerIssue; k++) {
        const randomVoteUser = faker.helpers.arrayElement(users);
        const voteType = faker.helpers.arrayElement(['upvote', 'downvote']);
        const currentIssue = issueData;


        const { error: voteError } = await supabase
          .from('issue_votes')
          .insert({
            issue_id: currentIssue.id,
            user_id: randomVoteUser.id,
            vote_type: voteType,
          });

        if (voteError) {
          console.error(`Error creating vote (${voteType}) for issue: ${title}`, voteError);
        } else {
          console.log(`Created vote (${voteType}) for issue: ${title}`);
        }
      }
    }
  }

  console.log('Database seeding completed!');
}


seedDatabase().catch(error => {
  console.error('Seeding failed:', error);
});