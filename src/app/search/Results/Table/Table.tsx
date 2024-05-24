'use client';

import { Button } from '@nextui-org/react';
import { push } from '@socialgouv/matomo-next';
import { useQueryState } from 'nuqs';
import { useContext, useEffect, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';

import createFilter from '@/app/search/Results/Table/helpers/createFilter';
import TableRow from '@/app/search/Results/Table/TableRow/TableRow';
import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  pagesParser,
  queryParser,
} from '@/app/search/searchParams/searchParamsParsers';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
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
  const [query] = useQueryState('query', queryParser);
  const [columns] = useQueryState('columns', columnsParser);
  const [pages, setPages] = useQueryState('pages', pagesParser);
  const [excludeItems] = useQueryState('excludeItems', excludeItemsParser);
  const [filter] = useQueryState('filter', filterParser);

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

  const { data, size, setSize, isLoading } = useSWRInfinite(
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
    }
  );

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

  return (
    <>
      <div className="box-white !px-0">
        <div className="overflow-x-scroll">
          <div className="flex">
            {columns.map((column) => (
              <div
                className="min-w-[300px] w-full px-5 border-secondary-100 border-r-2 font-semibold mb-2 first:pl-[40px] last:border-r-0"
                key={column}
              >
                {column}
              </div>
            ))}
          </div>
          <div
            style={
              columns && columns?.length
                ? { minWidth: columns.length * 300 }
                : {}
            }
          >
            {items.map((item) => (
              <TableRow item={item} key={item.id} />
            ))}
          </div>
        </div>
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
          Load more
        </Button>{' '}
        <div className="ms-4 text-secondary text-sm">
          Showing {items.length} of {data?.[0]?.total_hits.toLocaleString()}{' '}
          results
        </div>
      </div>
    </>
  );
}
