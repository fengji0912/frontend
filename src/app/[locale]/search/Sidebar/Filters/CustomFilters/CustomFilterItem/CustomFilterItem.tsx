import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';

import {
  Filter,
  filterParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import {
  FILTER_FIELDS,
  FILTER_OPERATORS,
} from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/CustomFilters';
import FilterItem from '@/app/[locale]/search/Sidebar/Filters/FilterItem/FilterItem';

type CustomFilterItemProps = {
  type: string;
  filters: Filter[];
};

export default function CustomFilterItem({
  type,
  filters,
}: CustomFilterItemProps) {
  const [, setFilter] = useQueryState('filter', filterParser);

  const handleDelete = ({ field, operator, value }: Filter) => {
    setFilter((prevFilter) =>
      prevFilter.filter(
        (filter) =>
          filter.field !== field &&
          filter.operator !== operator &&
          filter.value !== value
      )
    );
  };

  return (
    <FilterItem
      label={`${
        FILTER_FIELDS.find((filterField) => filterField.value === type)
          ?.label ?? ''
      } (${filters.length})`}
    >
      <ul className="space-y-1">
        {filters.map((filter, i) => (
          <li
            key={i}
            className="bg-[#f2f5f7] rounded-2xl p-2 ps-4 text-small flex justify-between items-center"
          >
            <div>
              <div className="text-secondary-700">
                {
                  FILTER_OPERATORS.find(
                    (filterOperator) => filterOperator.value === filter.operator
                  )?.label
                }
              </div>
              {filter.value}
            </div>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              size="sm"
              onPress={() => handleDelete(filter)}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </Button>
          </li>
        ))}
      </ul>
    </FilterItem>
  );
}
