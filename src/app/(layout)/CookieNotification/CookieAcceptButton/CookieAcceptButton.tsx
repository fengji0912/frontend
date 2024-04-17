'use client';

import { Button } from '@nextui-org/react';
import { useTransition } from 'react';

import { dismissCookieWarning } from '@/app/(layout)/CookieNotification/CookieAcceptButton/actions';

export default function CookieAcceptButton() {
  const [isLoading, startTransition] = useTransition();

  const handleDismiss = () => {
    startTransition(() => {
      dismissCookieWarning();
    });
  };

  return (
    <Button color="primary" onClick={handleDismiss} isLoading={isLoading}>
      Accept
    </Button>
  );
}
