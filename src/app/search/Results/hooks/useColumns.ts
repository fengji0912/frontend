'use client';

import { useQueryState } from 'nuqs';

import { columnsParser } from '@/app/search/searchParams/searchParamsParsers';

export default function useColumns() {
  const [columns, setColumns] = useQueryState('columns', columnsParser);

  return { columns, setColumns };
}
