'use client';

import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <main>
      <div className="container mt-10 box-white !py-10 flex items-center flex-col ">
        <div className="flex  items-center">
          <h1 className="text-4xl pe-5">{t('sea_just_grebe_cut')}</h1>{' '}
          <span>{error.message}</span>{' '}
        </div>
        <Button color="primary" onPress={() => reset()} className="mt-2">
          {t('flaky_empty_lark_spur')}
        </Button>
      </div>
      <div className="flex justify-center items-center mt-5 text-secondary-800 italic">
        {t('strong_main_swan_seek')}: {error.digest}
      </div>
    </main>
  );
}
