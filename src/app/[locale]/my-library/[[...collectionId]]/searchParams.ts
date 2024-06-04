import { createSearchParamsCache } from 'nuqs/server';

import {
  pageParser,
  pageSizeParser,
  sortParser,
} from '@/app/[locale]/my-library/[[...collectionId]]/searchParamsParsers';

export const searchParamsCache = createSearchParamsCache({
  sort: sortParser,
  page: pageParser,
  pageSize: pageSizeParser,
});
