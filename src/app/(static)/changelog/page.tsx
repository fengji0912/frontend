import * as fs from 'fs';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'Changelog',
};

const getChangelog = async () => {
  try {
    return fs.readFileSync('./CHANGELOG.md', 'utf8');
  } catch (error) {
    return 'Error: CHANGELOG.md not found';
  }
};

export default async function Changelog() {
  const changelog = await getChangelog();
  return (
    <div className="container-box [&>p]:mb-3">
      <ReactMarkdown>{changelog}</ReactMarkdown>
    </div>
  );
}
