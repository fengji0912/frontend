'use client';

import { Pagination } from '@nextui-org/react';

import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import PageSize from '@/components/PaginationBox/PageSize/PageSize';

type PaginationBoxProps = {
  totalItems: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  isLoading: boolean;
};

export default function PaginationBox({
  totalItems,
  page,
  setPage,
  pageSize,
  setPageSize,
  isLoading,
}: PaginationBoxProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div
      className="box-white mt-4 grow relative text-secondary"
      style={{ minWidth: 0 }}
    >
      <LoadingOverlay isVisible={isLoading} />
      <div className="flex sm:flex-row gap-2 flex-col items-center justify-between">
        <div className="flex items-center">
          <Pagination
            total={totalPages > 999 ? 999 : totalPages}
            initialPage={1}
            page={page}
            onChange={setPage}
          />
          <div className="ms-3 hidden lg:block">
            Showing {(page - 1) * pageSize + 1}-
            {(page - 1) * pageSize + pageSize} of {totalItems.toLocaleString()}{' '}
            results
          </div>
        </div>
        <PageSize pageSize={pageSize} setPageSize={setPageSize} />
      </div>
    </div>
  );
}
