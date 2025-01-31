// src/components/LoginButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const LoginButton: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/sign-in">
        <Button variant="outline">Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};

export default LoginButton;