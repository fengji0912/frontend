'use client';

import { SelectItem } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { sortParser } from '@/app/search/searchParams/searchParamsParsers';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import Select from '@/components/NextUi/Select/Select';

const SORT_OPTIONS = [
  {
    value: 'relevance',
    label: 'Relevance',
  },
  {
    value: 'recency',
    label: 'Newest',
  },
];

export default function Sort() {
  const [isLoading, startTransition] = useTransition();
  const [sort, setSort] = useQueryState(
    'sort',
    sortParser.withOptions({ startTransition })
  );

  return (
    <div className="box-white mt-4 relative">
      <Select
        disallowEmptySelection
        label="Sort by"
        selectedKeys={[sort]}
        labelPlacement="outside-left"
        onChange={(e) => setSort(e.target.value)}
        classNames={{
          base: 'items-center',
          label: 'grow font-bold text-base',
          mainWrapper: 'w-auto grow',
        }}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <SelectItem value={value} key={value}>
            {label}
          </SelectItem>
        ))}
      </Select>
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
