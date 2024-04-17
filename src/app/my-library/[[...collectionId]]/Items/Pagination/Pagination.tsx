'use client';

import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

import {
  pageParser,
  pageSizeParser,
} from '@/app/my-library/[[...collectionId]]/searchParamsParsers';
import PaginationBox from '@/components/PaginationBox/PaginationBox';

export default function Pagination({ totalItems }: { totalItems: number }) {
  const [isLoading, startTransition] = useTransition();

  const [page, setPage] = useQueryState(
    'page',
    pageParser.withOptions({ startTransition, scroll: true })
  );
  const [pageSize, setPageSize] = useQueryState('pageSize', pageSizeParser);

  return (
    <PaginationBox
      totalItems={totalItems}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={isLoading}
    />
  );
}
