'use client';

import { SelectItem } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Select from '@/components/NextUi/Select/Select';

export default function ImpactFilter() {
  const [field, setField] = useState('');
  const t = useTranslations();

  return (
    <>
      <input type="hidden" name="operator" value="equals" />
      <Select
        label={t('sad_basic_horse_zoom')}
        selectedKeys={field ? [field] : new Set([])}
        isRequired
        onChange={(e) => setField(e.target.value)}
        name="value"
      >
        <SelectItem key="high">{t('fancy_keen_gull_favor')}</SelectItem>
        <SelectItem key="medium">{t('ok_full_octopus_propel')}</SelectItem>
        <SelectItem key="low">{t('free_loose_oryx_ascend')}</SelectItem>
      </Select>
    </>
  );
}
