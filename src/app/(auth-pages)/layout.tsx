import React from 'react';

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen w-full relative flex flex-col items-center justify-center'>
      <div className="w-screen h-screen flex flex-col gap-12 items-center justify-center max-h-[600px] ">
        {children}
      </div>
      <div className="fixed bottom-10 right-10  backdrop-blur-sm">
      </div>
      <div className="fixed  bg-background/80 backdrop-blur-sm" />
    </div>
  );
}
