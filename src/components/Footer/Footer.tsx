'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import ROUTES from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="text-center">
      <ul className="inline-block mt-[35px] pb-[35px] flex-wrap text-center">
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
        <ListItem>Version: {process.env.version}</ListItem>
      </ul>
    </footer>
  );
}

function ListItem({ children }: { children: ReactNode }) {
  return (
    <li className="after:content-['___•___'] after:last:content-[''] after:whitespace-pre text-secondary-800 [&_a]:text-secondary-800 dark:text-secondary dark:[&_a]:text-secondary inline">
      {children}
    </li>
  );
}
