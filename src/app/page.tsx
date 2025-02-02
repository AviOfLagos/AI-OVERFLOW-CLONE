// src/app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { getSession, supabase } from "@/utils/auth";
import { Suspense } from "react";
import PostCard from "@/components/PostCard";
import { User } from "@/types/user";
import { Database } from "@/types/database.types";

type Issue = Database["public"]["Tables"]["issues"]["Row"];

export default function HomePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (session && session.user && session.user.email) {
          const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "",
            email: session.user.email,
            username: session.user.user_metadata?.username || "",
            profilePicture:
              session.user.user_metadata?.avatar_url || "/default-avatar.png",
            techStack: [],
            shortBio: "",
            tools: [],
            techInterests: [],
          };
          setUsername(currentUser.name);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data, error } = await supabase
          .from("issues")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Error fetching issues:", error);
        } else {
          setIssues(data || []);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {username && (
          <div className="p-4 bg-gray-100">
            <p className="text-gray-700">Welcome, {username}!</p>
          </div>
        )}

        {issues.length > 0 ? (
          issues.map((issue) => <PostCard key={issue.id} issue={issue} />)
        ) : (
          <div>No issues found.</div>
        )}
      </div>
    </Suspense>
  );
}
