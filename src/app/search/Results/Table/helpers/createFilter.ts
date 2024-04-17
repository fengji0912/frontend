import { Filter } from '@/app/search/searchParams/searchParamsParsers';
import { FILTER_OPERATORS } from '@/app/search/Sidebar/Filters/CustomFilters/CustomFilters';

type CreateQueryParams = {
  filter: Filter[];
};

export default function createFilter({ filter }: CreateQueryParams) {
  const filters: string[] = [];

  if (filter.length > 0) {
    filter.map((_filter) =>
      filters.push(
        `${_filter.field} ${FILTER_OPERATORS.find(
          (filterOperator) => filterOperator.value === _filter.operator
        )?.generateFilter(
          _filter.value as (string | number) & (string | number)[]
        )}`
      )
    );
  }
  return filters.join(' AND ');
}
