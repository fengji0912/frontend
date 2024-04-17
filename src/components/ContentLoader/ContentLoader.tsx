'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ReactContentLoader, { IContentLoaderProps } from 'react-content-loader';

export default function ContentLoader({
  children,
  ...props
}: IContentLoaderProps) {
  const [mounted, setMounted] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ReactContentLoader
      foregroundColor={theme === 'light' ? '#f3f3f3' : '#303237'}
      backgroundColor={theme === 'light' ? '#ecebeb' : '#1D2024'}
      {...props}
    >
      {children}
    </ReactContentLoader>
  );
}
