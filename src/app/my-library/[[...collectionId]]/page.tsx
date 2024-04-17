import { times } from 'lodash';
import { Metadata } from 'next';
import { Suspense } from 'react';

import Collections from '@/app/my-library/[[...collectionId]]/Collections/Collections';
import getCollection from '@/app/my-library/[[...collectionId]]/helpers/getCollection';
import getItems from '@/app/my-library/[[...collectionId]]/Items/helpers/getItems';
import Items from '@/app/my-library/[[...collectionId]]/Items/Items';
import { searchParamsCache } from '@/app/my-library/[[...collectionId]]/searchParams';
import Toolbar from '@/app/my-library/[[...collectionId]]/Toolbar/Toolbar';
import Unauthorized from '@/app/unauthorized';
import ContentLoader from '@/components/ContentLoader/ContentLoader';
import SelectedItemsProvider from '@/components/SelectedItemsProvider/SelectedItemsProvider';
import { checkIfAuthenticated } from '@/components/User/actions/actions';

export async function generateMetadata({
  params,
}: {
  params: { collectionId?: string[] };
}): Promise<Metadata> {
  const isAuthenticated = await checkIfAuthenticated();
  if (!isAuthenticated) {
    return {};
  }

  const collectionId = params?.collectionId?.[0] ?? null;
  const collection = await getCollection(collectionId);

  return {
    title: collection?.title ?? 'My library',
    description: 'Manage your collections and items in your library',
  };
}

export default async function MyLibrary({
  params,
  searchParams,
}: {
  params: { collectionId?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const isAuthenticated = await checkIfAuthenticated();

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  searchParamsCache.parse(searchParams);
  const collectionId = params?.collectionId?.[0] ?? null;
  const collection = await getCollection(collectionId);
  const items = collectionId ? await getItems(collectionId) : null;

  return (
    <div>
      <div className="container mt-4">
        <SelectedItemsProvider>
          <Toolbar />
          <div className="block md:flex mt-4 gap-3">
            <div className="md:max-w-72 shrink-0 w-full">
              <div className="box-white me-1 !p-0">
                <Collections activeCollectionId={collection?.id ?? null} />
              </div>
            </div>
            <div className="min-w-0 w-full mt-4 md:mt-0">
              <Suspense fallback={<LoadingItems />}>
                <Items items={items} />
              </Suspense>
            </div>
          </div>
        </SelectedItemsProvider>
      </div>
    </div>
  );
}

function LoadingItems() {
  return (
    <div className="box-white">
      {times(4, (i) => (
        <ContentLoader key={i} speed={2} width={'100%'} height={80}>
          <rect x="0" y="0" rx="16" ry="16" width="100%" height="70" />
        </ContentLoader>
      ))}
    </div>
  );
}
