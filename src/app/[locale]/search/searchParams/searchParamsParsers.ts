import { createParser, parseAsArrayOf, parseAsInteger } from 'nuqs';
import QueryString from 'qs';

import { DEFAULT_COLUMNS } from '@/app/[locale]/search/Results/hooks/defaultColumns';

// The default parseAsString from nuqs is not fully URI encoded, to make the URI look nice
// However, NextJS's redirect function doesn't work with unencoded semicolons
// For safely, we use encodeURIComponent and decodeURIComponent and ignore nice looking URIs

export const parseAsStringUriEncoded = createParser({
  parse: (query: string) => decodeURIComponent(query),
  serialize: (value: string) => encodeURIComponent(value),
});

export type FilterQueryString = {
  [operator: string]: {
    [field: string]: {
      [operator: string]: string | number | string[];
    };
  }[];
};

export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'greaterThan'
  | 'smallerThan'
  | 'isEmpty'
  | 'inList';

export type Filter = {
  field: string;
  operator: FilterOperator;
  value: string | number | string[];
};

export const qsParser = createParser<Filter[]>({
  parse: (query: string) => {
    const parsedFilter = QueryString.parse(query) as FilterQueryString;
    const filters: Filter[] = [];

    if (parsedFilter.AND) {
      for (const filterItem of parsedFilter.AND) {
        const field = Object.keys(filterItem)[0];
        const filterObject = Object.values(filterItem)[0];
        const operator = Object.keys(filterObject)[0] as FilterOperator;
        const value = Object.values(filterObject)[0];
        filters.push({
          field,
          operator,
          value,
        });
      }
    }
    return filters;
  },
  serialize: (value: Filter[]) => {
    const filter: FilterQueryString = {
      AND: [],
    };
    if (value && value.length > 0) {
      filter.AND = value.map((filterItem) => {
        const { field, operator, value } = filterItem;
        return {
          [field]: {
            [operator]: value,
          },
        };
      });
    }

    return QueryString.stringify(filter, {
      encodeValuesOnly: true, // prettify URL
    });
  },
});

export const queryParser = parseAsStringUriEncoded.withDefault('').withOptions({
  shallow: false,
});
export const listFilterParser = parseAsArrayOf(parseAsStringUriEncoded)
  .withDefault([])
  .withOptions({
    shallow: false,
    throttleMs: 1000,
  });

export const pageParser = parseAsInteger.withDefault(1).withOptions({
  shallow: false,
});
export const pagesParser = parseAsInteger.withDefault(1).withOptions({
  shallow: true,
});
export const pageSizeParser = parseAsInteger.withDefault(10).withOptions({
  shallow: false,
});
export const sortParser = parseAsStringUriEncoded
  .withDefault('relevance')
  .withOptions({
    shallow: false,
  });
export const columnsParser = parseAsArrayOf(parseAsStringUriEncoded)
  .withDefault(DEFAULT_COLUMNS)
  .withOptions({
    shallow: false,
  });
export const excludeItemsParser = parseAsArrayOf(parseAsStringUriEncoded)
  .withDefault([])
  .withOptions({
    shallow: false,
  });

export const filterParser = qsParser.withDefault([]).withOptions({
  shallow: false,
});
