'use client';

import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState, useTransition } from 'react';

import { filterParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import Input from '@/components/NextUi/Input/Input';

export default function Year() {
  const t = useTranslations();
  const [isLoading, startTransition] = useTransition();
  const [filter, setFilter] = useQueryState('filter', filterParser);

  const [startYearLocal, setStartYearLocal] = useState(
    filter.find((f) => f.field === 'year' && f.operator === 'greaterThan')
      ?.value
  );
  const [endYearLocal, setEndYearLocal] = useState(
    filter.find((f) => f.field === 'year' && f.operator === 'smallerThan')
      ?.value
  );

  const handleChange = () => {
    startTransition(async () => {
      setFilter((prevFilter) => {
        const newFilter = prevFilter.filter(
          (f) =>
            f.field !== 'year' &&
            f.operator !== 'greaterThan' &&
            f.operator !== 'smallerThan'
        );
        if (startYearLocal) {
          newFilter.push({
            field: 'year',
            operator: 'greaterThan',
            value: startYearLocal.toString(),
          });
        }
        if (endYearLocal) {
          newFilter.push({
            field: 'year',
            operator: 'smallerThan',
            value: endYearLocal.toString(),
          });
        }
        return newFilter;
      });
    });
  };

  return (
    <>
      <div className="flex items-center">
        <Input
          type="number"
          value={startYearLocal?.toString()}
          onChange={(e) => setStartYearLocal(parseInt(e.target.value))}
          onBlur={handleChange}
          size="sm"
          placeholder="1950"
          aria-label={t('green_honest_slug_slide')}
        />
        <div className="mx-2">{t('helpful_crisp_impala_smile')}</div>
        <Input
          type="number"
          value={endYearLocal?.toString()}
          onChange={(e) => setEndYearLocal(parseInt(e.target.value))}
          onBlur={handleChange}
          size="sm"
          placeholder={new Date().getFullYear().toString()}
          aria-label={t('weary_red_hedgehog_slide')}
        />
      </div>
      <div className="mt-2">
        <Button color="secondary" variant="bordered" className="me-2" size="sm">
          {t('tasty_ideal_rabbit_adapt')}
        </Button>
      </div>
      <LoadingOverlay isVisible={isLoading} />
    </>
  );
}
