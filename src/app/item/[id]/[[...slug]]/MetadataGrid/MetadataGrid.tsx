import {
  faBarcode,
  faBook,
  faBuildingColumns,
  faCalendar,
  faCircle,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IData } from 'csl-json';

import { LANGUAGES } from '@/app/search/Sidebar/Filters/helpers/languages';
import formatCslJsonDate from '@/lib/formatCslJsonDate';

type MetadataGridProps = {
  item: IData;
};

export default function MetadataGrid({ item }: MetadataGridProps) {
  const METADATA_GRID_ITEMS = [
    {
      label: 'Publication date',
      icon: faCalendar,
      value: formatCslJsonDate(item.issued),
    },
    {
      label: 'DOI',
      icon: faCircle,
      value: item?.DOI,
    },
    {
      label: 'Publisher',
      icon: faBuildingColumns,
      value: item?.publisher,
    },
    {
      label: 'ISSN',
      icon: faBarcode,
      value: item?.ISSN,
    },
    {
      label: 'Journal',
      icon: faBook,
      value: item?.journalAbbreviation,
    },
    {
      label: 'Language',
      icon: faLanguage,
      value: item?.language ? LANGUAGES[item.language] : '',
    },
  ];
  return (
    <div className="flex gap-1 rounded-2xl overflow-hidden flex-wrap flex-row">
      {METADATA_GRID_ITEMS.map((item) => {
        return item.value ? (
          <div
            className="py-4 px-4 bg-[#ffffff49] dark:bg-secondary-950 grow basis-[calc(25%-0.25rem)]"
            key={item.label}
          >
            <div className="text-secondary-700 text-small mb-1">
              <FontAwesomeIcon
                icon={item.icon}
                className="text-secondary-600"
              />{' '}
              {item.label}
            </div>
            {item.value}
          </div>
        ) : null;
      })}
    </div>
  );
}
