'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="min-h-screen">
      <SWRConfig
        value={{ shouldRetryOnError: false, revalidateOnFocus: false }}
      >
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </SWRConfig>
    </NextUIProvider>
  );
}
