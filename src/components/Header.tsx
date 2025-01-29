'use client';

import React from 'react';
import LoginButton from '@/components/LoginButton';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <nav className="flex items-center space-x-4">
        {/* Navigation links can be added here */}
        {isAuthenticated && (
          <span className="text-sm">Welcome, {user?.name}</span>
        )}
        <Link href="/submit-issue">
          <Button>Create New Issue</Button>
        </Link>
      </nav>
      <LoginButton />
    </header>
  );
};

export default Header;