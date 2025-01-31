"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormMessage from '@/components/form-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [signUpError, setSignUpError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    setSignUpError('');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });

    if (error) {
      setSignUpError(error.message);
    } else {
      // Redirect to the dashboard or desired page
      router.push('/dashboard');
    }
  };

  return (
    <>
      {signUpError && <FormMessage message={signUpError} type="error" />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex-1 flex flex-col min-w-64 w-full mx-auto max-w-[400px] p-4 sm:p-8 items-center justify-center bg-slate-700/10 backdrop-blur-sm border-2 border-foreground/30 rounded-3xl"
      >
        <h1 className="text-2xl font-medium">Sign up</h1>

        <div className="flex flex-col gap-2 mt-8">
          <Label htmlFor="username">Username</Label>
          <Input {...register('username')} placeholder="Your username" />
          {errors.username && (
            <span className="text-sm text-red-600">{errors.username.message}</span>
          )}

          <Label htmlFor="email">Email</Label>
          <Input {...register('email')} placeholder="you@example.com" />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            {...register('password')}
            placeholder="Your password"
          />
          {errors.password && (
            <span className="text-sm text-red-600">{errors.password.message}</span>
          )}

          <button
            type="submit"
            className="mt-4 bg-primary text-white py-2 px-4 rounded"
          >
            Sign up
          </button>
        </div>
      </form>
      <p className="text-sm text-foreground">
        Already have an account?{' '}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </>
  );
}
