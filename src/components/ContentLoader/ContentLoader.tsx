'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ReactContentLoader, { IContentLoaderProps } from 'react-content-loader';

export default function ContentLoader({
  children,
  ...props
}: IContentLoaderProps) {
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ReactContentLoader
      foregroundColor={resolvedTheme === 'light' ? '#f3f3f3' : '#303237'}
      backgroundColor={resolvedTheme === 'light' ? '#ecebeb' : '#1D2024'}
      {...props}
    >
      {children}
    </ReactContentLoader>
  );
}
