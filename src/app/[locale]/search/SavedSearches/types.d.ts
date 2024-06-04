import {
  columnsParser,
  excludeItemsParser,
  filterParser,
  listFilterParser,
  pagesParser,
  queryParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';

/**
 * Type of the saved search data, consisting of query params needed to reconstruct the search
 * @remarks: probably getting the types can be optimized
 */
export type SearchData = {
  query: ReturnType<typeof queryParser.parseServerSide>;
  columns: ReturnType<typeof columnsParser.parseServerSide>;
  pages: ReturnType<typeof pagesParser.parseServerSide>;
  excludeItems: ReturnType<typeof excludeItemsParser.parseServerSide>;
  collectionItemIds?: ReturnType<typeof listFilterParser.parseServerSide>;
  filter?: ReturnType<typeof filterParser.parseServerSide>;
};

export type ItemType = 'collectionItem' | 'searchItem';
