import { useTranslations } from 'next-intl';

import { Filter } from '@/app/[locale]/search/searchParams/searchParamsParsers';

export default function useFilters() {
  const t = useTranslations();
  type FilterTypes = 'impact' | 'number' | 'text';

  const FILTER_FIELDS: {
    label: string;
    value: string;
    type: FilterTypes;
  }[] = [
    {
      label: t('fancy_agent_ant_pride'),
      value: 'impact',
      type: 'impact',
    },
    {
      label: t('less_round_jackal_swim'),
      value: 'citation_count',
      type: 'number',
    },
    {
      label: t('full_upper_maggot_conquer'),
      value: 'title',
      type: 'text',
    },
    {
      label: t('heroic_icy_lark_rise'),
      value: 'abstract',
      type: 'text',
    },
    {
      label: t('wacky_aqua_husky_roar'),
      value: 'publisher',
      type: 'text',
    },
    {
      label: t('same_plain_rat_hack'),
      value: 'authors',
      type: 'text',
    },
  ];

  const FILTER_OPERATORS: {
    label?: string;
    value: string;
    generateFilter:
      | ((v: string | number) => string)
      | ((values: (string | number)[]) => string);
    types?: FilterTypes[];
  }[] = [
    {
      label: t('white_noble_starfish_succeed'),
      value: 'contains',
      generateFilter: (v: string | number) => `LIKE "${v}"`,
      types: ['text'],
    },
    {
      label: t('smug_neat_buzzard_expand'),
      value: 'equals',
      generateFilter: (v: string | number) => `= "${v}"`,
      types: ['text', 'number'],
    },
    {
      label: t('north_cuddly_lobster_transform'),
      value: 'greaterThan',
      generateFilter: (v: string | number) => `> ${v}`,
      types: ['number'],
    },
    {
      label: t('novel_clear_elk_strive'),
      value: 'smallerThan',
      generateFilter: (v: string | number) => `< ${v}`,
      types: ['number'],
    },
    {
      label: t('ornate_clear_stork_pause'),
      value: 'isEmpty',
      generateFilter: (v: string | number) => `IS_NULL(${v})`,
      types: ['text', 'number'],
    },
    {
      // operator without a label are not displayed in the dropdown
      value: 'inList',
      generateFilter: (values: (string | number)[]) =>
        `IN [${values.map((value) => `"${value}"`).join(', ')}]`,
    },
  ];

  type CreateQueryParams = {
    filter: Filter[];
  };

  const createFilter = ({ filter }: CreateQueryParams) => {
    const filters: string[] = [];

    if (filter.length > 0) {
      for (const _filter of filter) {
        if (_filter.field === 'impact') {
          if (_filter.value === 'low') {
            filters.push(`citation_count <= 10 `);
          }
          if (_filter.value === 'medium') {
            filters.push(`citation_count > 10, <=50`);
          }
          if (_filter.value === 'high') {
            filters.push(`citation_count > 50`);
          }
        } else {
          filters.push(
            `${_filter.field} ${FILTER_OPERATORS.find(
              (filterOperator) => filterOperator.value === _filter.operator
            )?.generateFilter(
              _filter.value as (string | number) & (string | number)[]
            )}`
          );
        }
      }
    }
    return filters.join(' AND ');
  };

  return { FILTER_FIELDS, FILTER_OPERATORS, createFilter };
}
