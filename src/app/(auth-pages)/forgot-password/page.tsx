"use client";
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import FormMessage from '@/components/form-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();
  // const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password reset email sent!' });
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col min-w-64 w-full mx-auto max-w-[400px] p-4 sm:p-8 items-center justify-center bg-slate-700/10 backdrop-blur-sm border-2 border-foreground/30 rounded-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col w-full gap-2 text-foreground min-w-64 max-w-64 mx-auto"
      >
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Remembered your password?{' '}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
            Reset Password
          </button>
          {message && <FormMessage message={message.text} type={message.type} />}
        </div>
      </form>
    </div>
  );
}
