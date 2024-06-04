import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import locales from '@/constants/locales';

export const localePrefix = 'as-needed'; // don't have a /en/ prefix when the default language is chosen

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
