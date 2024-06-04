import { useQueryState } from 'nuqs';

import { filterParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import CustomFilters from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/CustomFilters';
import FilterItem from '@/app/[locale]/search/Sidebar/Filters/FilterItem/FilterItem';
import { LANGUAGES } from '@/app/[locale]/search/Sidebar/Filters/helpers/languages';
import ListFilter from '@/app/[locale]/search/Sidebar/Filters/ListFilter/ListFilter';
import Year from '@/app/[locale]/search/Sidebar/Filters/Year/Year';

export default function Filters() {
  const [filter] = useQueryState('filter', filterParser);

  const generateFilterLabel = ({
    label,
    field,
  }: {
    label: string;
    field: string;
  }) => {
    const filterValues =
      (filter.find((_filter) => _filter.field === field)?.value as string[])
        ?.length ?? 0;

    if (filterValues === 0) {
      return label;
    }
    return `${label} (${filterValues})`;
  };

  return (
    <div className="pt-[0.05px]">
      <div className="box-white !px-0 pb-0 relative mt-4">
        <div className="font-bold mb-2 px-3">Filters</div>

        <FilterItem label="Year">
          <Year />
        </FilterItem>
        <FilterItem
          label={generateFilterLabel({
            label: 'Language',
            field: 'language',
          })}
        >
          <ListFilter listItems={LANGUAGES} type="language" />
        </FilterItem>
        <CustomFilters />
      </div>
    </div>
  );
}
