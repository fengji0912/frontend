import '@/assets/scss/global.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CookiesProvider } from 'next-client-cookies/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { PublicEnvScript } from 'next-runtime-env';
import NextTopLoader from 'nextjs-toploader';

import CookieNotification from '@/app/[locale]/(layout)/CookieNotification/CookieNotification';
import Feedback from '@/app/[locale]/(layout)/Feedback/Feedback';
import Matomo from '@/app/[locale]/(layout)/Matomo/Matomo';
import { Providers } from '@/app/[locale]/providers';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import locales from '@/constants/locales';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ORKG Ask',
    template: '%s | ORKG Ask',
  },
  description: 'Find the research you are actually looking for',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className="light">
      <head>
        <PublicEnvScript />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <CookiesProvider>
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
          </CookiesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
