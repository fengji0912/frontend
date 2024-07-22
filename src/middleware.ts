import createMiddleware from 'next-intl/middleware';

import { localePrefix } from '@/components/Navigation/Navigation';
import locales from '@/constants/locales';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix,
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - Make exception for /item/[id]/[slug] where the slug can contain a dot
  // See: https://next-intl-docs.vercel.app/docs/routing/middleware#matcher-no-prefix
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/item/(.+)'],
};
