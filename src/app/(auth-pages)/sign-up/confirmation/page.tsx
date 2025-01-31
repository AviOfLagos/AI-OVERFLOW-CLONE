// app/(auth-pages)/sign-up/confirmation/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  // Mask the email for privacy
  const maskedEmail = email.replace(/^(.{3}).*(@.*)$/, '$1*****$2');

  return (
    <div className="h-full flex-1 flex flex-col min-w-64 w-full mx-auto max-w-[400px] p-4 sm:p-8 item-center justify-center bg-slate-700/10 backdrop-blur-sm border-2 border-foreground/30 rounded-3xl">
      <h1 className="text-2xl font-medium mb-4">Verify Your Email</h1>
      <p className="text-center">
        Thanks for signing up! Please click the link in the email we sent to{" "}
        <strong>{maskedEmail}</strong> to complete your registration.
      </p>
    </div>
  );
}