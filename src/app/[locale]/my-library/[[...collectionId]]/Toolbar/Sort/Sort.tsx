'use client';

import { SelectItem } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { sortParser } from '@/app/[locale]/my-library/[[...collectionId]]/searchParamsParsers';
import Select from '@/components/NextUi/Select/Select';

const SORT_OPTIONS = [
  {
    value: '-created',
    label: 'Newest first',
  },
  {
    value: '+created',
    label: 'Oldest first',
  },
  {
    value: '+cslData.title',
    label: 'Title A-Z',
  },
  {
    value: '-cslData.title',
    label: 'Title Z-A',
  },
];

export default function Sort() {
  const [isLoading, startTransition] = useTransition();
  const [sort, setSort] = useQueryState(
    'sort',
    sortParser.withOptions({ startTransition })
  );

  return (
    <Select
      disallowEmptySelection
      selectedKeys={[sort]}
      onChange={(e) => setSort(e.target.value)}
      className="max-w-40"
      labelPlacement="outside"
      isLoading={isLoading}
    >
      {SORT_OPTIONS.map(({ value, label }) => (
        <SelectItem value={value} key={value}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}
