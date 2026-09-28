'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';
import { useTheme } from 'next-themes';

/// موفّر الإشعارات (Toaster) المبني على sonner.
export function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      position="top-center"
      dir="rtl"
      richColors
      theme={(theme as 'light' | 'dark' | 'system') ?? 'system'}
      toastOptions={{
        style: { fontFamily: 'var(--font-arabic), sans-serif' },
      }}
    />
  );
}

export { toast };
