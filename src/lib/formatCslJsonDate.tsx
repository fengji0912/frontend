import moment from 'moment';

import { IDate } from '@/types/csl-json';

export default function formatCslJsonDate(
  date: IDate | undefined
): string | null {
  return date?.['date-parts']?.[0]?.[0]
    ? `${
        date?.['date-parts']?.[0]?.[1]
          ? moment(date?.['date-parts']?.[0]?.[1], 'M').format('MMMM') + ' '
          : ''
      }${date?.['date-parts']?.[0]?.[0]}`
    : null;
}
