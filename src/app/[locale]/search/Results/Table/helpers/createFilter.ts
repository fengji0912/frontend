import { Filter } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import { FILTER_OPERATORS } from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/CustomFilters';

type CreateQueryParams = {
  filter: Filter[];
};

export default function createFilter({ filter }: CreateQueryParams) {
  const filters: string[] = [];

  if (filter.length > 0) {
    for (const _filter of filter) {
      if (_filter.field === 'impact') {
        if (_filter.value === 'low') {
          filters.push(`citation_count <= 10 `);
        }
        if (_filter.value === 'medium') {
          filters.push(`citation_count > 10, <=50`);
        }
        if (_filter.value === 'high') {
          filters.push(`citation_count > 50`);
        }
      } else {
        filters.push(
          `${_filter.field} ${FILTER_OPERATORS.find(
            (filterOperator) => filterOperator.value === _filter.operator
          )?.generateFilter(
            _filter.value as (string | number) & (string | number)[]
          )}`
        );
      }
    }
  }
  return filters.join(' AND ');
}
