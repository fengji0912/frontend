'use client';

import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { ListResult } from 'pocketbase';
import { useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';

import { getSavedSearches } from '@/app/[locale]/search/SavedSearches/actions';
import SavedSearchItem from '@/app/[locale]/search/SavedSearches/SavedSearchItem/SavedSearchItem';
import { SearchData } from '@/app/[locale]/search/SavedSearches/types';
import { pagesParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import useAuth from '@/components/User/hooks/useAuth';
import { SavedSearchesResponse } from '@/types/pocketbase-types';

const PAGE_SIZE = 5;

export default function SavedSearches() {
  const t = useTranslations();
  const [pages, setPages] = useQueryState('pages', pagesParser);
  const { isAuthenticated } = useAuth();

  const getKey = (
    pageIndex: number,
    previousPageData: ListResult<SavedSearchesResponse<SearchData>>
  ) => {
    if (
      previousPageData &&
      previousPageData.items &&
      !previousPageData.items.length
    )
      return null; // reached the end
    return isAuthenticated ? { type: 'savedSearches', pageIndex } : null;
  };

  const { data, size, setSize, isLoading, mutate } = useSWRInfinite(
    getKey,
    (keyData) =>
      getSavedSearches({
        page: keyData.pageIndex + 1,
        limit: PAGE_SIZE,
      }),
    {
      initialSize: pages,
      revalidateAll: true,
    }
  );

  useEffect(() => {
    if (size > 1) {
      setPages(size);
    }
  }, [setPages, size]);

  const isLoadingLoadMoreButton =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  return isAuthenticated ? (
    <div className="mt-4 box">
      <h2 className="text-2xl font-semibold mb-5">
        {t('clear_east_skate_care')}
      </h2>
      <ul>
        {data?.map((savedSearches) =>
          savedSearches.items.map((savedSearch) => (
            <SavedSearchItem
              key={savedSearch.id}
              item={savedSearch}
              mutate={mutate}
            />
          ))
        )}
      </ul>
      {((data?.[0]?.totalPages && data?.[0]?.totalPages > size) ||
        isLoadingLoadMoreButton) && (
        <Button
          color="primary"
          onPress={() => setSize(size + 1)}
          isLoading={isLoadingLoadMoreButton}
        >
          {t('frail_red_cod_taste')}
        </Button>
      )}
    </div>
  ) : null;
}
