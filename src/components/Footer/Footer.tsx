import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';
import { getBackendVersion } from '@/services/backend';

export default async function Footer() {
  const t = await getTranslations();
  let backendVersion = '';
  try {
    backendVersion = (await getBackendVersion())?.payload?.version ?? '';
  } catch (e) {
    console.error(e);
  }

  return (
    <footer className="text-center">
      <ul className="inline-block mt-[35px] pb-[35px] flex-wrap text-center leading-7">
        <ListItem>
          <Link href={`${ROUTES.PAGES}/about`}>
            {t('flaky_icy_millipede_strive')}
          </Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.CONTACT}>{t('suave_early_sparrow_lend')}</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.DATA_PROTECTION}>{t('fun_only_emu_race')}</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.ACCESSIBILITY}>
            {t('spare_petty_shrimp_borrow')}
          </Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.IMPRINT}>{t('civil_equal_robin_find')}</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.CHANGELOG}>{t('early_helpful_gazelle_urge')}</Link>
        </ListItem>
        <ListItem>
          {t('active_noble_haddock_attend')}: v{process.env.version}
        </ListItem>
        <ListItem>
          {t('alive_quick_kangaroo_rush')}: v{backendVersion}
        </ListItem>
      </ul>
    </footer>
  );
}

function ListItem({ children }: { children: ReactNode }) {
  return (
    <li className="after:content-['•'] after:inline-block after:px-2 after:last:px-0 after:last:content-[''] text-secondary-800 [&_a]:text-secondary-800 dark:text-secondary dark:[&_a]:text-secondary inline">
      {children}
    </li>
  );
}
