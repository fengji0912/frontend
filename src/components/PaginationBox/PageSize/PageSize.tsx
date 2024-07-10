'use client';

import { SelectItem } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import Select from '@/components/NextUi/Select/Select';

const ITEM_LIMITS = [1, 2, 5, 10, 25, 50, 100];

type PageSizeProps = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};

export default function PageSize({ pageSize, setPageSize }: PageSizeProps) {
  const t = useTranslations();

  return (
    <div>
      <Select
        selectedKeys={[pageSize.toString()]}
        onChange={(e) => setPageSize(parseInt(e.target.value))}
        label={t('ago_vivid_cod_grip')}
        labelPlacement="outside-left"
        disallowEmptySelection
        fullWidth={false}
        classNames={{
          base: 'items-center',
          label: 'grow text-base text-inherit',
          mainWrapper: 'w-auto grow w-20',
        }}
      >
        {ITEM_LIMITS.map((limit) => (
          <SelectItem value={limit} key={limit}>
            {limit.toString()}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
