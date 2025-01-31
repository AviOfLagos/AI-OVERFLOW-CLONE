"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormMessage from '../../../components/form-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function Login() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const supabase = useSupabaseClient();

  const onSubmit = async (data: SignInFormData) => {
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setLoginError(error.message);
    } else {
      // Redirect to the callbackUrl or home page
      router.push(callbackUrl || '/');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full flex-1 flex flex-col min-w-64 w-full max-w-[400px] p-4 sm:p-8 items-center justify-center bg-slate-700/10 backdrop-blur-sm border-2 border-foreground/30 rounded-3xl"
    >
      <h1 className="text-2xl font-medium">Sign in</h1>
      {error && <FormMessage message={error!} type="error" />}
      {loginError && (
        <span className="text-sm text-red-600">{loginError}</span>
      )}
      <div className="flex flex-col gap-2 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input {...register('email')} placeholder="you@example.com" />
        {errors.email && (
          <span className="text-sm text-red-600">
            {errors.email.message}
          </span>
        )}

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          {...register('password')}
          placeholder="Your password"
        />
        {errors.password && (
          <span className="text-sm text-red-600">
            {errors.password.message}
          </span>
        )}

        <button
          type="submit"
          className="mt-4 bg-primary text-white py-2 px-4 rounded"
        >
          Sign in
        </button>
        <div className="flex gap-2 mt-4">
          <p className="text-sm text-foreground/60">
            Dont have an account?{' '}
            <Link
              className="text-foreground/60 font-medium underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
