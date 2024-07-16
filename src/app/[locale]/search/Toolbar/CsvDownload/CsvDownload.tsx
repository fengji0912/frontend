import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { columnsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';
import useCslJsonDateFormatter from '@/lib/useCslJsonDateFormatter';

export default function CsvDownload() {
  const t = useTranslations();
  const { formatDate } = useCslJsonDateFormatter();
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
        formatDate(item.cslData?.issued) ?? '',
        item.cslData?.URL ?? '',
        ...columns.map((column) => llmData?.[item.cslData!.id]?.[column] ?? ''),
      ]),
      [
        `${t('spare_smart_capybara_wave')} ${
          process.env.version
        } - https://ask.orkg.org`,
      ],
    ],
    [columns, formatDate, items, llmData, t]
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
      <span className="hidden md:inline">
        {
          // eslint-disable-next-line react/jsx-no-literals
        }
        CSV
      </span>
    </Button>
  );
}
