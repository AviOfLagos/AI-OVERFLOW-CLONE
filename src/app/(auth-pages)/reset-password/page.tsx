// src/app/reset-password/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormMessage from '@/components/form-message';
import { supabase } from '@/utils/auth';
import { Button } from '@/components/ui/button'; // Added import for Button component

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      setMessage({ type: 'error', text: 'Invalid reset password link.' });
    }
  }, [code]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (!code) {
      setMessage({ type: 'error', text: 'Invalid reset password link.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password, });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password reset successful!' });
      // Redirect to sign-in page after successful password reset
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000); // Redirect after 2 seconds
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-w-64 w-full mx-auto max-w-[400px] p-4 sm:p-8 items-center justify-center bg-slate-700/10 backdrop-blur-sm border-2 border-foreground/30 rounded-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col w-full gap-2 text-foreground min-w-64 max-w-64 mx-auto"
      >
        <div>
          <h1 className="text-2xl font-medium">Reset your password</h1>
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {message && <FormMessage message={message.text} type={message.type} />}
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            type="password"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </div>
  );
}