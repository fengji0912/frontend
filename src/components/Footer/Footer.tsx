import { ReactNode } from 'react';

import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';
import { getBackendVersion } from '@/services/backend';

export default async function Footer() {
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
          <Link href={`${ROUTES.PAGES}/about`}>About</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.CONTACT}>Contact</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.DATA_PROTECTION}>Data Protection</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.ACCESSIBILITY}>Accessibility</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.IMPRINT}>Imprint</Link>
        </ListItem>
        <ListItem>
          <Link href={ROUTES.CHANGELOG}>Changelog</Link>
        </ListItem>
        <ListItem>Frontend: v{process.env.version}</ListItem>
        <ListItem>Backend: v{backendVersion}</ListItem>
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
