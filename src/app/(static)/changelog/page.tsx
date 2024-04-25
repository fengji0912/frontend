import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

import changelogPath from '../../../../CHANGELOG.md';

export const metadata: Metadata = {
  title: 'Changelog',
};

export default async function Changelog() {
  // const changelog = await getChangelog();
  return (
    <div className="container-box [&>p]:mb-3">
      <ReactMarkdown>{changelogPath}</ReactMarkdown>
    </div>
  );
}
