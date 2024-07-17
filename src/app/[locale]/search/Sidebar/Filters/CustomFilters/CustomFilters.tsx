'use client';

import { groupBy } from 'lodash';
import { useQueryState } from 'nuqs';

import { filterParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import AddFilter from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/AddFilter/AddFilter';
import CustomFilterItem from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/CustomFilterItem/CustomFilterItem';

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
