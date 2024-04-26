import '@/assets/scss/global.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PublicEnvScript } from 'next-runtime-env';
import NextTopLoader from 'nextjs-toploader';

import CookieNotification from '@/app/(layout)/CookieNotification/CookieNotification';
import Feedback from '@/app/(layout)/Feedback/Feedback';
import Matomo from '@/app/(layout)/Matomo/Matomo';
import { Providers } from '@/app/providers';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ORKG Ask',
    template: '%s | ORKG Ask',
  },
  description: 'Find the research you are actually looking for',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <PublicEnvScript />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <NextTopLoader color="#e86161" />
        <Providers>
          <div className="bg">
            <Feedback />
            <Header />
            <div className="px-2">{children}</div>
            <Footer />
            <CookieNotification />
          </div>
        </Providers>
        <Matomo />
      </body>
    </html>
  );
}
