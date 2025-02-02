// src/types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  profilePicture?: string;
  techStack?: string[];
  shortBio?: string;
  tools?: string[];
  techInterests?: string[];
}
