import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';

import TranslationMissingAlert from '@/components/TranslationMissingAlert/TranslationMissingAlert';

import changelogPath from '../../../../../CHANGELOG.md';

export const metadata: Metadata = {
  title: 'Changelog',
};

export default async function Changelog({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div className="container-box [&>p]:mb-3 [&_ul]:list-disc [&_ul]:ps-7 [&_h1]:mt-5 [&_h2]:mt-5 [&_h3]:mt-5">
      <TranslationMissingAlert />

      <ReactMarkdown>{changelogPath}</ReactMarkdown>
    </div>
  );
}
