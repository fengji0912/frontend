import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import slugify from 'slugify';

import ReadMore from '@/app/[locale]/item/[id]/[[...slug]]/ReadMore/ReadMore';
import Authors from '@/components/Item/Authors/Authors';
import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';
import useCslJsonDateFormatter from '@/lib/useCslJsonDateFormatter';
import { IData } from '@/types/csl-json';

type ItemProps = {
  item: IData;
};

export default function Item({ item }: ItemProps) {
  const { formatDate } = useCslJsonDateFormatter();

  return (
    <div className="bg-secondary-50 rounded-2xl p-4 mx-3 h-full">
      <Link
        href={`${ROUTES.ITEM}/${item.id}/${slugify(item.title ?? '')}`}
        className="font-semibold line-clamp-3"
      >
        {item.title}
      </Link>
      <div className="text-secondary-800">
        <Authors authors={item.author} />
        <div className="mb-3">
          {formatDate(item.issued) && (
            <div className="whitespace-nowrap">
              <FontAwesomeIcon icon={faCalendar} className="opacity-75 me-2" />
              {formatDate(item.issued)}
            </div>
          )}
        </div>
        <ReadMore maxLength={100} text={item.abstract} />
      </div>
    </div>
  );
}
