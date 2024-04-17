import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { columnsParser } from '@/app/search/searchParams/searchParamsParsers';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';
import formatCslJsonDate from '@/lib/formatCslJsonDate';

export default function CsvDownload() {
  const [columns] = useQueryState('columns', columnsParser);
  const { items, llmData } = useContext(tableDataContext);

  const csvData = useMemo(
    () => [
      ['title', 'DOI', 'authors', 'publication date', 'URL', ...columns],
      ...items.map((item) => [
        item.cslData?.title ?? '',
        item.cslData?.DOI ?? '',
        item.cslData?.author
          ?.map((author) => formatCslJsonAuthor(author))
          .join('; ') ?? '',
        formatCslJsonDate(item.cslData?.issued) ?? '',
        item.cslData?.URL ?? '',
        ...columns.map((column) => llmData?.[item.cslData!.id]?.[column] ?? ''),
      ]),
    ],
    [columns, items, llmData]
  );

  return (
    <Button
      color="secondary"
      className="dark:!bg-secondary-200 min-w-12"
      startContent={<FontAwesomeIcon icon={faDownload} />}
      as={CSVLink}
      data={csvData}
      filename="results.csv"
    >
      <span className="hidden md:inline">CSV</span>
    </Button>
  );
}
