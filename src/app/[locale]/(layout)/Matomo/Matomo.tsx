'use client';

import { init, push } from '@socialgouv/matomo-next';
import { useSearchParams } from 'next/navigation';
import { env } from 'next-runtime-env';
import { Suspense, useEffect, useState } from 'react';

import { usePathname } from '@/components/Navigation/Navigation';

/**
 * @remarks Copied from {@link https://github.com/SocialGouv/matomo-next/issues/99}
 */
const MATOMO_URL = env('NEXT_PUBLIC_MATOMO_URL');
const MATOMO_SITE_ID = env('NEXT_PUBLIC_MATOMO_SITE_ID');

const MatomoComponent = () => {
  const [initialised, setInitialised] = useState(false);
  useEffect(() => {
    if (MATOMO_URL && MATOMO_SITE_ID && !initialised) {
      init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
    }
    return () => {
      setInitialised(true);
      push(['HeatmapSessionRecording::disable']);
    };
  }, [initialised, setInitialised]);

  const searchParams = useSearchParams(),
    pathname = usePathname();

  const searchParamsString = searchParams.toString();
  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParamsString ? '?' + searchParamsString : '');
    push(['setCustomUrl', url]);
    push(['trackPageView']);
  }, [pathname, searchParamsString]);
  return null;
};

export default function Matomo() {
  return (
    <Suspense>
      <MatomoComponent />
    </Suspense>
  );
}
