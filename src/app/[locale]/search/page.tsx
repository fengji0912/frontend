import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import Feedback from '@/app/[locale]/search/Feedback/Feedback';
import LoadingResults from '@/app/[locale]/search/Results/LoadingResults/LoadingResults';
import Results from '@/app/[locale]/search/Results/Results';
import SavedSearches from '@/app/[locale]/search/SavedSearches/SavedSearches';
import { searchParamsCache } from '@/app/[locale]/search/searchParams/searchParams';
import Toolbar from '@/app/[locale]/search/Toolbar/Toolbar';
import SearchBar from '@/components/SearchBar/SearchBar';
import SelectedItemsProvider from '@/components/SelectedItemsProvider/SelectedItemsProvider';
import TableDataProvider from '@/components/TableDataProvider/TableDataProvider';

const Sidebar = dynamic(() => import('@/app/[locale]/search/Sidebar/Sidebar'), {
  ssr: false,
});

type SearchProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ searchParams }: SearchProps): Metadata {
  const query = decodeURIComponent((searchParams.query as string) ?? '');

  return query
    ? {
        title: `${query} | Search`,
        description: `Search results for ${query}`,
      }
    : {
        title: 'Search',
        description: 'Find the research you are actually looking for',
      };
}

export default function Search({ searchParams }: SearchProps) {
  searchParamsCache.parse(searchParams); // ensure the search params are available in the cache
  const query = searchParamsCache.get('query');

  return (
    <div>
      {query ? (
        <>
          <SelectedItemsProvider>
            <TableDataProvider>
              <Toolbar />
              <div className="container mt-4 lg:flex max-w-full lg:max-w-[calc(100%-100px)]">
                <Sidebar />
                <Suspense fallback={<LoadingResults />}>
                  <Results />
                </Suspense>
              </div>
            </TableDataProvider>
          </SelectedItemsProvider>
          <Feedback />
        </>
      ) : (
        <div className="container mt-16 max-w-[1000px]">
          <SearchBar />
          <SavedSearches />
        </div>
      )}
    </div>
  );
}
