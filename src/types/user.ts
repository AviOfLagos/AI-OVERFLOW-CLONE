// types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  tracks: string[];
  avatar?: string;
  username?: string;
}
