import { IDate } from 'csl-json';
import { useFormatter } from 'next-intl';

export default function useCslJsonDateFormatter() {
  const format = useFormatter();

  const formatDate = (date: IDate | undefined): string | null => {
    if (!date?.['date-parts']?.[0]?.[0]) {
      return null;
    }

    const year = parseInt(String(date?.['date-parts']?.[0]?.[0]), 10);
    const month = date?.['date-parts']?.[0]?.[1]
      ? parseInt(String(date?.['date-parts']?.[0]?.[1]), 10) - 1
      : null;
    const parsedDate = new Date(year, month ?? 0);

    return format.dateTime(parsedDate, {
      year: 'numeric',
      month: month !== null ? 'long' : undefined,
    });
  };

  return { formatDate };
}
