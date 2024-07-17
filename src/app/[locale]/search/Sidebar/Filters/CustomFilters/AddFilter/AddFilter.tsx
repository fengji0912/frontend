'use client';

import { Button, SelectItem } from '@nextui-org/react';
import { push } from '@socialgouv/matomo-next';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useId, useRef, useState } from 'react';

import {
  FilterOperator,
  filterParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import ImpactFilter from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/AddFilter/ImpactFilter/ImpactFilter';
import useFilters from '@/app/[locale]/search/Sidebar/Filters/CustomFilters/hooks/useFilters';
import FilterItem from '@/app/[locale]/search/Sidebar/Filters/FilterItem/FilterItem';
import Input from '@/components/NextUi/Input/Input';
import Select from '@/components/NextUi/Select/Select';

export default function AddFilter() {
  const [field, setField] = useState('impact');
  const t = useTranslations();
  const [, setFilter] = useQueryState('filter', filterParser);
  const { FILTER_FIELDS, FILTER_OPERATORS } = useFilters();
  const ref = useRef<HTMLFormElement>(null);
  const labelId = useId();
  const selectedFilter = FILTER_FIELDS.find((f) => f.value === field);

  return (
    <FilterItem label={t('bright_teary_camel_slurp')}>
      <form
        ref={ref}
        action={async (formData) => {
          setFilter((prevFilter) => [
            ...prevFilter,
            {
              field,
              operator: formData.get('operator') as FilterOperator,
              value: formData.get('value') as string,
            },
          ]);
          setField(''); // form reset doesn't work with NextUI Select, so make it a controlled component
          ref.current?.reset();
          push([
            'trackEvent',
            'add custom filter',
            `${field} filter added ${formData.get('operator')} ${formData.get(
              'value'
            )}`,
          ]);
        }}
      >
        <div className="space-y-3">
          <Select
            label="Field"
            selectedKeys={field ? [field] : new Set([])}
            isRequired
            onChange={(e) => setField(e.target.value)}
          >
            {FILTER_FIELDS.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </Select>
          {selectedFilter && (
            <>
              <div>
                {field === 'impact' && <ImpactFilter />}
                {field !== 'impact' && (
                  <Input
                    type="text"
                    placeholder={t('super_plain_shrike_clap')}
                    isRequired
                    name="value"
                    startContent={
                      <div className="flex items-center">
                        <label className="sr-only" htmlFor={labelId}>
                          {t('home_gaudy_capybara_ask')}
                        </label>
                        <select
                          className="outline-none border-0 bg-transparent text-small"
                          id={labelId}
                          name="operator"
                        >
                          {FILTER_OPERATORS.filter(
                            (operator) =>
                              operator.label &&
                              operator.types?.includes(selectedFilter.type)
                          ).map((operator) => (
                            <option value={operator.value} key={operator.label}>
                              {operator.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    }
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button color="primary" type="submit">
                  {t('that_few_shrimp_assure')}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FilterItem>
  );
}
