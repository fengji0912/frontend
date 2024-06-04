import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import { columnsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';

export default function useColumns() {
  const [isPending, startTransition] = useTransition();

  const [columns, setColumns] = useQueryState(
    'columns',
    columnsParser.withOptions({
      startTransition,
    })
  );

  return {
    columns,
    setColumns,
    isPending,
  };
}
