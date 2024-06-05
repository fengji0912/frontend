import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

import changelogPath from '../../../../../CHANGELOG.md';

export const metadata: Metadata = {
  title: 'Changelog',
};

export default async function Changelog() {
  return (
    <div className="container-box [&>p]:mb-3 [&_ul]:list-disc [&_ul]:ps-7 [&_h1]:mt-5 [&_h2]:mt-5 [&_h3]:mt-5">
      <ReactMarkdown>{changelogPath}</ReactMarkdown>
    </div>
  );
}
