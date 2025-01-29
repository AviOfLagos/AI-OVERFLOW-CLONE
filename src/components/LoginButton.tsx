import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const LoginButton: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuthStore();

  return (
    <Button onClick={() => (isAuthenticated ? logout() : login())}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};

export default LoginButton;