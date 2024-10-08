'use client';

import { Button } from '@nextui-org/react';
import { push } from '@socialgouv/matomo-next';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useContext, useEffect, useMemo } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import useSWRInfinite from 'swr/infinite';

import TableRow from '@/app/[locale]/search/Results/Table/TableRow/TableRow';
import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  pagesParser,
  queryParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import useFilters from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/hooks/useFilters';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import useColumnTranslator from '@/lib/useColumnTranslator';
import useLoadingTime from '@/lib/useLoadingTime';
import { search } from '@/services/backend';
import { components } from '@/services/backend/types';
import { IData } from '@/types/csl-json';
import {
  CollectionItemsResponse,
  CollectionsResponse,
} from '@/types/pocketbase-types';

const PAGE_SIZE = 5;

export default function Table({
  collectionItems,
}: {
  collectionItems: CollectionItemsResponse<
    IData,
    { collection?: CollectionsResponse }
  >[];
}) {
  const t = useTranslations();
  const { translateColumn } = useColumnTranslator();
  const [query] = useQueryState('query', queryParser);
  const [columns] = useQueryState('columns', columnsParser);
  const [pages, setPages] = useQueryState('pages', pagesParser);
  const [excludeItems] = useQueryState('excludeItems', excludeItemsParser);
  const [filter] = useQueryState('filter', filterParser);
  const { createFilter } = useFilters();

  const filterString = createFilter({
    filter,
  });

  const getKey = (
    pageIndex: number,
    previousPageData: components['schemas']['QdrantPagedDocumentsResponse']
  ) => {
    if (
      previousPageData &&
      previousPageData.payload &&
      previousPageData.payload.items &&
      !previousPageData.payload.items.length
    )
      return null; // reached the end
    return { type: 'search', query, pageIndex, filter, collectionItems }; // SWR key
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    (keyData) =>
      search({
        query,
        filter: filterString,
        offset: keyData.pageIndex * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    {
      initialSize: pages,
      onSuccess: () => {
        trackLoadingTime();
      },
    }
  );

  const { trackLoadingTime } = useLoadingTime({
    isValidating,
    actionLabel: 'Search results loading time',
  });

  useEffect(() => {
    if (size > 1) {
      setPages(size);
    }
  }, [setPages, size]);

  const items = useMemo(
    () =>
      [
        ...collectionItems.map((item) => ({
          ...item,
          type: 'collectionItem' as const,
        })),
        ...(data
          ? data
              .map(
                (results) =>
                  results.items?.map((item) => ({
                    id: item.id,
                    cslData: item,
                    type: 'searchItem' as const,
                  }))
              )
              .flat()
          : []),
      ]
        // remove excluded items
        .filter((item) => (item.id ? !excludeItems.includes(item.id) : true))
        // remove duplicates from collectionItems
        .filter(
          (item) =>
            !(
              item.type === 'searchItem' &&
              collectionItems.find(
                (collectionItem) => collectionItem.linkedItemId === item.id
              )
            )
        ),
    [collectionItems, data, excludeItems]
  );

  const { setItems } = useContext(tableDataContext);

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);

  useEffect(() => {
    push(['trackEvent', 'search query', query]);
  }, [query]);

  const loadMore = () => {
    setSize(size + 1);
    push(['trackEvent', 'load more results', size + 1]);
  };

  const rowStyle =
    columns && columns?.length
      ? {
          minWidth: `calc(${columns.length * 300}px + 1.5rem + 4px)`,
        } // column width + padding + border
      : {};

  return (
    <>
      <div className="box-white !px-0 !pt-0">
        <ScrollSync>
          <div>
            <ScrollSyncPane>
              <div className="sticky top-16 z-50 bg-white/75 dark:bg-secondary-950/75 backdrop-blur overflow-hidden rounded-t-3xl">
                <div style={rowStyle}>
                  <div className="mx-3 flex border-2 border-transparent">
                    {columns.map((column) => (
                      <div
                        className="min-w-[300px] w-full px-5 border-secondary-100 border-r-2 font-semibold my-2 first:pl-[40px] last:border-r-0 line-clamp-3"
                        key={column}
                        title={translateColumn(column)}
                      >
                        {translateColumn(column)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane>
              <div className="overflow-x-scroll pt-1">
                <div style={rowStyle}>
                  {items.map((item) => (
                    <TableRow item={item} key={item.id} />
                  ))}
                </div>
              </div>
            </ScrollSyncPane>
          </div>
        </ScrollSync>
      </div>
      <div className="flex items-center mt-3">
        <Button
          color="primary"
          onPress={loadMore}
          isLoading={
            isLoading ||
            (size > 0 && data && typeof data[size - 1] === 'undefined')
          }
        >
          {t('steep_mild_lionfish_hint')}
        </Button>{' '}
        <div className="ms-4 text-secondary text-sm">
          {t('flaky_sleek_snake_flip', {
            start: items.length,
            end: data?.[0]?.total_hits.toLocaleString(),
          })}
        </div>
      </div>
    </>
  );
}
