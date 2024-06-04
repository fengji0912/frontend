'use server';

import { cookies } from 'next/headers';

export async function dismissCookieWarning() {
  const oneMonth = 24 * 60 * 60 * 1000 * 30;

  cookies().set('isCookieWarningDismissed', 'true', {
    expires: Date.now() + oneMonth,
    httpOnly: true,
  });

  return 'test';
}
