'use client';

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations();
  return (
    <main>
      <div className="container flex justify-center items-center mt-10 box-white !py-10">
        <h1 className="text-4xl pe-5">404</h1>{' '}
        <span>{t('tense_clear_bulldog_file')}</span>
      </div>
    </main>
  );
}
