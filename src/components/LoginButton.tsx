// src/components/LoginButton.tsx

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSession } from '@/utils/auth';

const LoginButton: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error fetching session:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

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