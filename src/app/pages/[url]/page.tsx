import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { initPocketbase } from '@/components/User/actions/actions';
import { Collections } from '@/types/pocketbase-types';

type PageProps = {
  params: { url: string };
};

const getPage = async (url: string) => {
  const pb = await initPocketbase();

  try {
    return await pb
      .collection(Collections.Pages)
      .getFirstListItem(`url="${url}"`);
  } catch (e) {
    console.error(e);
  }
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPage(params.url);
  return page
    ? {
        title: page.title,
        description: page.content,
      }
    : {};
}

export default async function Page({ params }: PageProps) {
  const page = await getPage(params.url);

  if (!page) {
    notFound();
  }

  return (
    <div className="container-box [&>p]:mb-3">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
