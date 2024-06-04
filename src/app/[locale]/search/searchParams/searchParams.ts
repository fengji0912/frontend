import { createSearchParamsCache } from 'nuqs/server';

import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  listFilterParser,
  pageSizeParser,
  pagesParser,
  queryParser,
  sortParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';

export const searchParamsSchema = {
  query: queryParser,
  pages: pagesParser,
  pageSize: pageSizeParser,
  sort: sortParser,
  columns: columnsParser,
  collectionItemIds: listFilterParser,
  excludeItems: excludeItemsParser,
  filter: filterParser,
};

export const searchParamsCache = createSearchParamsCache(searchParamsSchema);
