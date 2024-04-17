'use client';

import { groupBy } from 'lodash';
import { useQueryState } from 'nuqs';

import { filterParser } from '@/app/search/searchParams/searchParamsParsers';
import AddFilter from '@/app/search/Sidebar/Filters/CustomFilters/AddFilter/AddFilter';
import CustomFilterItem from '@/app/search/Sidebar/Filters/CustomFilters/CustomFilterItem/CustomFilterItem';

export const FILTER_FIELDS = [
  {
    label: 'Title',
    value: 'title',
  },
  {
    label: 'Abstract',
    value: 'abstract',
  },
  {
    label: 'Citation count (estimate)',
    value: 'citation_count',
  },
  {
    label: 'Publisher',
    value: 'publisher',
  },
];

export const FILTER_OPERATORS = [
  {
    label: 'Contains',
    value: 'contains',
    generateFilter: (v: string | number) => `LIKE "${v}"`,
  },
  {
    label: 'Equals',
    value: 'equals',
    generateFilter: (v: string | number) => `= "${v}"`,
  },
  {
    label: 'Greater than',
    value: 'greaterThan',
    generateFilter: (v: string | number) => `> ${v}`,
  },
  {
    label: 'Smaller than',
    value: 'smallerThan',
    generateFilter: (v: string | number) => `< ${v}`,
  },
  {
    label: 'Is empty',
    value: 'isEmpty',
    generateFilter: (v: string | number) => `IS_NULL(${v})`,
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
