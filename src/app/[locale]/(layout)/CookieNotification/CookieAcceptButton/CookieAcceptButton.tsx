'use client';

import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { dismissCookieWarning } from '@/app/[locale]/(layout)/CookieNotification/CookieAcceptButton/actions';

export default function CookieAcceptButton() {
  const t = useTranslations();
  const [isLoading, startTransition] = useTransition();

  const handleDismiss = () => {
    startTransition(() => {
      dismissCookieWarning();
    });
  };

  return (
    <Button color="primary" onClick={handleDismiss} isLoading={isLoading}>
      {t('civil_misty_beaver_bless')}
    </Button>
  );
}
