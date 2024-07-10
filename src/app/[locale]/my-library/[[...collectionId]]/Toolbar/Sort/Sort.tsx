'use client';

import { SelectItem } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { sortParser } from '@/app/[locale]/my-library/[[...collectionId]]/searchParamsParsers';
import Select from '@/components/NextUi/Select/Select';

export default function Sort() {
  const t = useTranslations();
  const [isLoading, startTransition] = useTransition();
  const [sort, setSort] = useQueryState(
    'sort',
    sortParser.withOptions({ startTransition })
  );

  const SORT_OPTIONS = [
    {
      value: '-created',
      label: t('bald_factual_osprey_absorb'),
    },
    {
      value: '+created',
      label: t('round_true_cockroach_quell'),
    },
    {
      value: '+cslData.title',
      label: t('quaint_wide_ocelot_fond'),
    },
    {
      value: '-cslData.title',
      label: t('dizzy_plain_moose_fade'),
    },
  ];

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
