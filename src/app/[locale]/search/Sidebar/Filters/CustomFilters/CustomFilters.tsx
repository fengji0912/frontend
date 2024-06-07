'use client';

import { groupBy } from 'lodash';
import { useQueryState } from 'nuqs';

import { filterParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import AddFilter from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/AddFilter/AddFilter';
import CustomFilterItem from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/CustomFilterItem/CustomFilterItem';

type FilterTypes = 'impact' | 'number' | 'text';

export const FILTER_FIELDS: {
  label: string;
  value: string;
  type: FilterTypes;
}[] = [
  {
    label: 'Impact',
    value: 'impact',
    type: 'impact',
  },
  {
    label: 'Citation count (estimate)',
    value: 'citation_count',
    type: 'number',
  },
  {
    label: 'Title',
    value: 'title',
    type: 'text',
  },
  {
    label: 'Abstract',
    value: 'abstract',
    type: 'text',
  },
  {
    label: 'Publisher',
    value: 'publisher',
    type: 'text',
  },
  {
    label: 'Authors',
    value: 'authors',
    type: 'text',
  },
];

export const FILTER_OPERATORS: {
  label?: string;
  value: string;
  generateFilter:
    | ((v: string | number) => string)
    | ((values: (string | number)[]) => string);
  types?: FilterTypes[];
}[] = [
  {
    label: 'Contains',
    value: 'contains',
    generateFilter: (v: string | number) => `LIKE "${v}"`,
    types: ['text'],
  },
  {
    label: 'Equals',
    value: 'equals',
    generateFilter: (v: string | number) => `= "${v}"`,
    types: ['text', 'number'],
  },
  {
    label: 'Greater than',
    value: 'greaterThan',
    generateFilter: (v: string | number) => `> ${v}`,
    types: ['number'],
  },
  {
    label: 'Smaller than',
    value: 'smallerThan',
    generateFilter: (v: string | number) => `< ${v}`,
    types: ['number'],
  },
  {
    label: 'Is empty',
    value: 'isEmpty',
    generateFilter: (v: string | number) => `IS_NULL(${v})`,
    types: ['text', 'number'],
  },
  {
    // operator without a label are not displayed in the dropdown
    value: 'inList',
    generateFilter: (values: (string | number)[]) =>
      `IN [${values.map((value) => `"${value}"`).join(', ')}]`,
  },
];

export default function CustomFilters() {
  const [filter] = useQueryState('filter', filterParser);
  const groupedFilters = groupBy(filter, (filter) => filter.field);

  return (
    <>
      {groupedFilters &&
        Object.entries(groupedFilters)
          .filter(([type]) => type !== 'language' && type !== 'year') // year and language are handled separately
          .map(([type, filters]) => (
            <CustomFilterItem key={type} type={type} filters={filters} />
          ))}

      <AddFilter />
    </>
  );
}
