'use client';

import { useTranslations } from 'next-intl';

import { DEFAULT_COLUMNS } from '@/app/[locale]/search/Results/hooks/defaultColumns';
import useColumns from '@/app/[locale]/search/Toolbar/EditColumns/hooks/useColumns';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

export default function PopularColumns() {
  const t = useTranslations();
  const { isPending, columns, setColumns } = useColumns();

  // popular columns are columns that are not in the columns state but are in default columns
  const popularColumns = DEFAULT_COLUMNS.filter((c) => !columns.includes(c));

  const handleAddColumn = (column: string) => {
    setColumns((_columns) => [..._columns, column]);
  };

  return (
    <>
      <LoadingOverlay isVisible={isPending} />

      {popularColumns.length > 0 && (
        <>
          <div className="fw-bold mt-3 mb-2 font-bold">
            {t('strong_fresh_vulture_hunt')}
          </div>
          <ul className="space-y-1">
            {popularColumns.map((column) => (
              <li
                style={{ cursor: 'pointer' }}
                onClick={() => handleAddColumn(column)}
                className="rounded-3xl min-w-[290px] w-full block py-2 px-4 bg-secondary-50"
                key={column}
              >
                <div className="flex-grow-1">{column}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
